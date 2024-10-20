package transport

import (
	"med-asis/internal/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type getAllChatsResponses struct {
	Data []models.Chat `json:"data"`
}

// @Summary Get all chats
// @Security ApiKeyAuth
// @Tags chats
// @Description Get all chats
// @ID get-all-chats
// @Accept  json
// @Produce  json
// @Success 200 {integer} integer 1
// @Failure 400,404 {object} transort_error
// @Failure 500 {object} transort_error
// @Failure default {object} transort_error
// @Router /api/v1/chats/ [get]
func (h *Handler) getAllChats(c *gin.Context) {
	id, ok := c.Get(UserId)
	if !ok {
		NewTransportErrorResponse(c, http.StatusBadRequest, "You are not authorized!!!")
		return
	}

	chats, err := h.services.Chat.GetAll(id.(int))
	if err != nil {
		NewTransportErrorResponse(c, http.StatusInternalServerError, "some problems while getting chats")
		return
	}

	c.JSON(http.StatusOK, &getAllChatsResponses{
		Data: chats,
	})
}

// @Summary Create chat
// @Security ApiKeyAuth
// @Tags chats
// @Description create chat
// @ID create-chat
// @Accept  json
// @Produce  json
// @Param input body models.Chat true "chat info"
// @Success 200 {integer} integer 1
// @Failure 400,404 {object} transort_error
// @Failure 500 {object} transort_error
// @Failure default {object} transort_error
// @Router /api/v1/chats/ [post]
func (h *Handler) createChat(c *gin.Context) {
	var input models.Chat

	userId, ok := c.Get(UserId)
	if !ok {
		NewTransportErrorResponse(c, http.StatusBadRequest, "You are not authorized!!!")
		return
	}

	if err := c.BindJSON(&input); err != nil {
		NewTransportErrorResponse(c, http.StatusBadRequest, "Bad request")
		return
	}

	id, err := h.services.Chat.Create(userId.(int), input)
	if err != nil {
		NewTransportErrorResponse(c, http.StatusInternalServerError, "some problems")
		return
	}
	c.JSON(http.StatusOK, map[string]interface{}{
		"id": id,
	})
}

// @Summary Get Chat by Id
// @Security ApiKeyAuth
// @Tags chats
// @Description Get chat by Id
// @ID get-chat-by-id
// @Accept  json
// @Produce  json
// @Param id  path int true "Chat ID"
// @Success 200 {integer} integer 1
// @Failure 400,404 {object} transort_error
// @Failure 500 {object} transort_error
// @Failure default {object} transort_error
// @Router /api/chats/{id} [get]
func (h *Handler) getChatById(c *gin.Context) {
	userId, ok := c.Get(UserId)
	if !ok {
		NewTransportErrorResponse(c, http.StatusBadRequest, "You not authorized!!!")
		return
	}

	list_id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		NewTransportErrorResponse(c, http.StatusBadRequest, "bad list id")
		return
	}

	list, err := h.services.Chat.GetById(userId.(int), list_id)
	if err != nil {
		NewTransportErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, list)
}

// @Summary Update Chat
// @Security ApiKeyAuth
// @Tags chats
// @Description Update chat by Id
// @ID update-chat
// @Accept  json
// @Produce  json
// @Param id  path int true "Chat ID"
// @Success 200 {integer} integer 1
// @Failure 400,404 {object} transort_error
// @Failure 500 {object} transort_error
// @Failure default {object} transort_error
// @Router /api/chats/{id} [put]
func (h *Handler) updateChat(c *gin.Context) {
	userId, ok := c.Get(UserId)
	if !ok {
		NewTransportErrorResponse(c, http.StatusBadRequest, "You are not authorized!!!")
		return
	}

	chat_id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		NewTransportErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	var input models.Chat
	if err := c.BindJSON(&input); err != nil {
		NewTransportErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.services.Chat.Update(userId.(int), chat_id, input); err != nil {
		NewTransportErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, "i updated it")
}

// @Summary Delete Chat
// @Security ApiKeyAuth
// @Tags chats
// @Description Delete chat by Id
// @ID delete-chat
// @Accept  json
// @Produce  json
// @Param id  path int true "Chat ID"
// @Success 200 {integer} integer 1
// @Failure 400,404 {object} transort_error
// @Failure 500 {object} transort_error
// @Failure default {object} transort_error
// @Router /api/v1/chats/{id} [delete]
func (h *Handler) deleteChat(c *gin.Context) {
	userId, ok := c.Get(UserId)
	if !ok {
		NewTransportErrorResponse(c, http.StatusBadRequest, "You are not authorized!!!")
		return
	}

	chat_id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		NewTransportErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.services.Chat.Delete(userId.(int), chat_id); err != nil {
		NewTransportErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, "i deleted it :D")
}
