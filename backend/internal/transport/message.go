package transport

import (
	"med-asis/internal/models"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
)

const MAX_UPLOAD_SIZE = 20 << 20 // 20 Mb

var IMAGE_TYPES = map[string]interface{}{
	"image/jpeg": nil,
	"image/png":  nil,
}

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

type uploadResponse struct {
	Status string `json:"status"`
	Msg    string `json:"message,omitempty"`
	URL    string `json:"url,omitempty"`
	OCR    string `json:"ocr"`
}

// @Summary Upload file
// @Security ApiKeyAuth
// @Tags files
// @Description Upload file
// @ID upload-file
// @Accept json
// @Produce json
// @Param file formData file true "Body with file"
// @Success 200 {integer} integer 1
// @Failure 400,404 {object} transort_error
// @Failure 500 {object} transort_error
// @Failure default {object} transort_error
// @Router /api/v1/files/upload [post]
func (h *Handler) uploadFile(c *gin.Context) {
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, MAX_UPLOAD_SIZE)

	file, fileHeader, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, &uploadResponse{
			Status: "error",
			Msg:    err.Error(),
		})
		return
	}
	defer file.Close()

	buffer := make([]byte, fileHeader.Size)
	file.Read(buffer)
	fileType := http.DetectContentType(buffer)

	// Validate File Type
	if _, ex := IMAGE_TYPES[fileType]; !ex {
		c.JSON(http.StatusBadRequest, &uploadResponse{
			Status: "error",
			Msg:    "file type is not supported",
		})
		return
	}

	url, err := h.services.Upload(c.Request.Context(), file, fileHeader.Size, fileType)

	if err != nil {
		c.JSON(http.StatusBadRequest, &uploadResponse{
			Status: "error",
			Msg:    err.Error(),
		})
		return
	}

	// write file
	path := filepath.Join("../CV", path.Base(url))
	newFile, err := os.Create(path)
	if err != nil {
		c.JSON(http.StatusBadRequest, &uploadResponse{
			Status: "error",
			Msg:    err.Error(),
		})
		return
	}

	defer newFile.Close()
	defer os.Remove(path)
	if _, err := newFile.Write(buffer); err != nil || newFile.Close() != nil {
		c.JSON(http.StatusBadRequest, &uploadResponse{
			Status: "error",
			Msg:    err.Error(),
		})
		return
	}

	//out, err := pkg.Perform(path)
	if err != nil {
		c.JSON(http.StatusBadRequest, &uploadResponse{
			Status: "error",
			Msg:    err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, &uploadResponse{
		Status: "ok",
		URL:    url,
	})
}
