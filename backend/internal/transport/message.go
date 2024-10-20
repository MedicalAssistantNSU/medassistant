package transport

import (
	"med-asis/internal/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type AllMessages struct {
	Data []models.Message `json:"messages"`
}

// @Summary Get all messages
// @Security ApiKeyAuth
// @Tags messages
// @Description Get all messages
// @ID get-all-messages
// @Accept  json
// @Produce  json
// @Param chat_id  path int true "Chat ID"
// @Success 200 {integer} integer 1
// @Failure 400,404 {object} transort_error
// @Failure 500 {object} transort_error
// @Failure default {object} transort_error
// @Router /api/v1/chats/{chat_id}/ [get]
func (h *Handler) getAllMessages(c *gin.Context) {
	user_id, ok := c.Get(UserId)
	if !ok {
		NewTransportErrorResponse(c, http.StatusBadRequest, "You are not authorized!!!")
		return
	}

	chat_id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		NewTransportErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	messages, err := h.services.Message.GetAll(user_id.(int), chat_id)
	if err != nil {
		NewTransportErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, &AllMessages{
		Data: messages,
	})
}

// @Summary Create message
// @Security ApiKeyAuth
// @Tags message
// @Description Create message
// @ID create-message
// @Accept  json
// @Produce  json
// @Param input body models.Message true "message info"
// @Param chat_id  path int true "Chat ID"
// @Success 200 {integer} integer 1
// @Failure 400,404 {object} transort_error
// @Failure 500 {object} transort_error
// @Failure default {object} transort_error
// @Router /api/v1/chats/{chat_id}/ [post]
func (h *Handler) createMessage(c *gin.Context) {
	chat_id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		NewTransportErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	var input models.Message
	if err := c.BindJSON(&input); err != nil {
		NewTransportErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	message_id, err := h.services.Message.Create(chat_id, input)
	if err != nil {
		NewTransportErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"message_id": message_id,
	})
}

// @Summary Get message by Id
// @Security ApiKeyAuth
// @Tags messages
// @Description Get message by Id
// @ID get-message-by-id
// @Accept  json
// @Produce  json
// @Param chat_id  path int true "Chat ID"
// @Param message_id  path int true "Message ID"
// @Success 200 {integer} integer 1
// @Failure 400,404 {object} transort_error
// @Failure 500 {object} transort_error
// @Failure default {object} transort_error
// @Router /api/v1/chats/{chat_id}/{message_id} [get]
func (h *Handler) getMessageById(c *gin.Context) {
	message_id, err := strconv.Atoi(c.Param("message_id"))
	if err != nil {
		NewTransportErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	user_id, ok := c.Get(UserId)
	if !ok {
		NewTransportErrorResponse(c, http.StatusBadRequest, "You are not authorized!!!")
		return
	}

	message, err := h.services.Message.GetItemById(user_id.(int), message_id)
	if err != nil {
		NewTransportErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, message)
}

// @Summary Delete message by Id
// @Security ApiKeyAuth
// @Tags messages
// @Description Delete message by Id
// @ID delete-message-by-id
// @Accept  json
// @Produce  json
// @Param chat_id  path int true "Chat ID"
// @Param message_id  path int true "Message ID"
// @Success 200 {integer} integer 1
// @Failure 400,404 {object} transort_error
// @Failure 500 {object} transort_error
// @Failure default {object} transort_error
// @Router /api/v1/chats/{chat_id}/{message_id} [delete]
func (h *Handler) deleteMessage(c *gin.Context) {
	message_id, err := strconv.Atoi(c.Param("message_id"))
	if err != nil {
		NewTransportErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	user_id, ok := c.Get(UserId)
	if !ok {
		NewTransportErrorResponse(c, http.StatusBadRequest, "You are not authorized!!!")
		return
	}

	if err := h.services.Message.Delete(user_id.(int), message_id); err != nil {
		NewTransportErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, "i deleted it :D")
}

// @Summary Update message
// @Security ApiKeyAuth
// @Tags messages
// @Description Update message by Id
// @ID update-message
// @Accept  json
// @Produce  json
// @Param chat_id  path int true "Chat ID"
// @Param message_id  path int true "Message ID"
// @Success 200 {integer} integer 1
// @Failure 400,404 {object} transort_error
// @Failure 500 {object} transort_error
// @Failure default {object} transort_error
// @Router /api/v1/chats/{chat_id}/{message_id} [put]
func (h *Handler) updateMessage(c *gin.Context) {
	message_id, err := strconv.Atoi(c.Param("message_id"))
	if err != nil {
		NewTransportErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	user_id, ok := c.Get(UserId)
	if !ok {
		NewTransportErrorResponse(c, http.StatusBadRequest, "You are not authorized!!!")
		return
	}

	var input models.Message
	if err := c.BindJSON(&input); err != nil {
		NewTransportErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.services.Message.Update(user_id.(int), message_id, input); err != nil {
		NewTransportErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, "i updated it :D")
}
