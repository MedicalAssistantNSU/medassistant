package transport

import (
	"med-asis/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

type InputAuth struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type InputRegister struct {
	Username string `json:"email"`
	Name     string `json:"name"`
	Password string `json:"password"`
}

type OutputAuth struct {
	User        models.User `json:"user"`
	AccessToken string      `json:"accessToken"`
}

// @Summary SignUp
// @Tags auth
// @Description create account
// @ID create-account
// @Accept  json
// @Produce  json
// @Param input body InputRegister true "account info"
// @Success 200 {integer} integer 1
// @Failure 400,404,500,default {object} transort_error
// @Router /auth/sign-up [post]
func (h *Handler) signUp(c *gin.Context) {
	var input InputRegister

	if err := c.BindJSON(&input); err != nil {
		NewTransportErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	user := models.User{
		Name:     input.Name,
		Password: input.Password,
		Username: input.Username,
	}

	logrus.Printf("create user with %s, %s, %s", input.Name, input.Username, input.Password)
	id, err := h.services.Authorization.CreateUser(user)
	if err != nil {
		NewTransportErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	token, err := h.services.Authorization.GenerateToken(input.Username, input.Password)
	if err != nil {
		NewTransportErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	user.Id = id

	c.JSON(http.StatusOK, OutputAuth{
		User:        user,
		AccessToken: token,
	})
}

// @Summary SignIn
// @Tags auth
// @Description login to account
// @ID login-to-account
// @Accept  json
// @Produce  json
// @Param input body InputAuth true "account info"
// @Success 200 {integer} integer 1
// @Failure 400,404,500,default {object} transort_error
// @Router /auth/sign-in [post]
func (h *Handler) signIn(c *gin.Context) {
	var input InputAuth

	if err := c.BindJSON(&input); err != nil {
		NewTransportErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	token, err := h.services.Authorization.GenerateToken(input.Username, input.Password)
	if err != nil {
		NewTransportErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	user, err := h.services.Authorization.GetUserByUsername(input.Username)
	if err != nil {
		NewTransportErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, OutputAuth{
		User:        user,
		AccessToken: token,
	})
}

// @Summary Get Account Ingo
// @Security ApiKeyAuth
// @Tags account
// @Description Get accound by id
// @ID get-account
// @Produce  json
// @Success 200 {integer} integer 1
// @Failure 400,404 {object} transort_error
// @Failure 500 {object} transort_error
// @Failure default {object} transort_error
// @Router /api/v1/account/my-account [get]
func (h *Handler) getAccountInfo(c *gin.Context) {
	userId, ok := c.Get(UserId)
	if !ok {
		NewTransportErrorResponse(c, http.StatusBadRequest, "You are not authorized!!!")
		return
	}

	user, err := h.services.Authorization.GetUserById(userId.(int))

	if err != nil {
		NewTransportErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, OutputAuth{
		User: user,
	})
}
