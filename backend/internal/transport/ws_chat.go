package transport

import (
	"med-asis/internal/models"
	"med-asis/internal/service"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/sirupsen/logrus"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

type InputMsgWithChatId struct {
	ChatId    int    `json:"chatId"`
	Content   string `json:"content"`
	Type      string `json:"type"`
	CreatedAt string `json:"createdAt"`
}

func (h *Handler) wsChat(c *gin.Context) {
	authToken := c.Param("auth")

	id, err := h.services.Authorization.ParseToken(authToken)
	if err != nil {
		NewTransportErrorResponse(c, http.StatusBadRequest, "parse token failed")
		return
	}

	c.Set(UserId, id)

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		logrus.Error(err.Error())
		NewTransportErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	defer conn.Close()

	requests := make(chan InputMsgWithChatId)

	var wg sync.WaitGroup
	wg.Add(2)

	go wsReader(conn, requests, &wg)

	go goWorker(h, id, conn, requests, &wg)

	wg.Wait()
}

func wsReader(conn *websocket.Conn, requests chan<- InputMsgWithChatId, wg *sync.WaitGroup) {
	defer conn.Close()
	defer wg.Done()
	defer close(requests)
	for {
		var input InputMsgWithChatId

		if err := conn.ReadJSON(&input); err != nil {
			logrus.Error(err.Error())
			break
		}

		requests <- input
	}
}

func goWorker(h *Handler, id int, conn *websocket.Conn, requests <-chan InputMsgWithChatId, wg *sync.WaitGroup) {
	defer conn.Close()
	defer wg.Done()
	for {
		req := <-requests

		inputMsg := models.Message{
			Content:   req.Content,
			Type:      req.Type,
			CreatedAt: req.CreatedAt,
		}

		logrus.Info(inputMsg)

		chat, err := h.services.Chat.GetById(id, req.ChatId)
		if err != nil {
			logrus.Error(err.Error())
			break
		}

		inputMsg.SenderId = id
		answer, err := h.services.Message.Create(req.ChatId, service.CreateMsg{
			Msg:     inputMsg,
			History: chat.Context,
		})
		if err != nil {
			logrus.Error(err.Error())
			break
		}

		updatedChat := models.Chat{
			Name:    chat.Name,
			Context: answer.History,
		}

		logrus.Info(chat.Context)

		if err := h.services.Chat.Update(id, req.ChatId, updatedChat); err != nil {
			logrus.Error(err.Error())
			break
		}

		if err = conn.WriteJSON(answer.Msg); err != nil {
			logrus.Error(err.Error())
			break
		}
	}
}
