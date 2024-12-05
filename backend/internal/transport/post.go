package transport

import (
	"med-asis/internal/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type GetAllPostsResponses struct {
	Data []models.Post `json:"data"`
}

// @Summary Get all posts
// @Security ApiKeyAuth
// @Tags posts
// @Description Get all posts
// @ID get-all-posts
// @Accept  json
// @Produce  json
// @Success 200 {integer} integer 1
// @Failure 400,404 {object} transort_error
// @Failure 500 {object} transort_error
// @Failure default {object} transort_error
// @Router /api/v1/posts/ [get]
func (h *Handler) getAllPosts(c *gin.Context) {
	_, ok := c.Get(UserId)
	if !ok {
		NewTransportErrorResponse(c, http.StatusBadRequest, "You are not authorized!!!")
		return
	}

	posts, err := h.services.Post.GetAll()
	if err != nil {
		NewTransportErrorResponse(c, http.StatusInternalServerError, "some problems while getting posts")
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"data": posts,
	})
}

// @Summary Create post
// @Security ApiKeyAuth
// @Tags posts
// @Description create post
// @ID create-post
// @Accept  json
// @Produce  json
// @Param input body models.Post true "post info"
// @Success 200 {integer} integer 1
// @Failure 400,404 {object} transort_error
// @Failure 500 {object} transort_error
// @Failure default {object} transort_error
// @Router /api/v1/posts/ [post]
func (h *Handler) createPost(c *gin.Context) {
	var input models.Post

	_, ok := c.Get(UserId)
	if !ok {
		NewTransportErrorResponse(c, http.StatusBadRequest, "You are not authorized!!!")
		return
	}

	if err := c.BindJSON(&input); err != nil {
		NewTransportErrorResponse(c, http.StatusBadRequest, "Bad request")
		return
	}

	id, err := h.services.Post.Create(input)
	if err != nil {
		NewTransportErrorResponse(c, http.StatusInternalServerError, "some problems")
		return
	}
	c.JSON(http.StatusOK, map[string]interface{}{
		"id": id,
	})
}

// @Summary Get Post by Id
// @Security ApiKeyAuth
// @Tags posts
// @Description Get post by Id
// @ID get-post-by-id
// @Accept  json
// @Produce  json
// @Param id  path int true "Post ID"
// @Success 200 {integer} integer 1
// @Failure 400,404 {object} transort_error
// @Failure 500 {object} transort_error
// @Failure default {object} transort_error
// @Router /api/v1/posts/{id} [get]
func (h *Handler) getPostById(c *gin.Context) {
	_, ok := c.Get(UserId)
	if !ok {
		NewTransportErrorResponse(c, http.StatusBadRequest, "You not authorized!!!")
		return
	}

	postId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		NewTransportErrorResponse(c, http.StatusBadRequest, "bad post id")
		return
	}

	post, err := h.services.Post.GetById(postId)
	if err != nil {
		NewTransportErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, post)
}

// @Summary Update Post
// @Security ApiKeyAuth
// @Tags posts
// @Description Update post by Id
// @ID update-post
// @Accept  json
// @Produce  json
// @Param id  path int true "Post ID"
// @Success 200 {integer} integer 1
// @Failure 400,404 {object} transort_error
// @Failure 500 {object} transort_error
// @Failure default {object} transort_error
// @Router /api/v1/posts/{id} [put]
func (h *Handler) updatePost(c *gin.Context) {
	_, ok := c.Get(UserId)
	if !ok {
		NewTransportErrorResponse(c, http.StatusBadRequest, "You are not authorized!!!")
		return
	}

	chatId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		NewTransportErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	var input models.Post
	if err := c.BindJSON(&input); err != nil {
		NewTransportErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.services.Post.Update(chatId, input); err != nil {
		NewTransportErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, "i updated it")
}

// @Summary Delete Post
// @Security ApiKeyAuth
// @Tags posts
// @Description Delete post by Id
// @ID delete-post
// @Accept  json
// @Produce  json
// @Param id  path int true "Post ID"
// @Success 200 {integer} integer 1
// @Failure 400,404 {object} transort_error
// @Failure 500 {object} transort_error
// @Failure default {object} transort_error
// @Router /api/v1/posts/{id} [delete]
func (h *Handler) deletePost(c *gin.Context) {
	_, ok := c.Get(UserId)
	if !ok {
		NewTransportErrorResponse(c, http.StatusBadRequest, "You are not authorized!!!")
		return
	}

	chatId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		NewTransportErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.services.Post.Delete(chatId); err != nil {
		NewTransportErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, "i deleted it :D")
}
