package transport

// import (
// 	"med-asis/internal/models"
// 	"net/http"

// 	"github.com/gin-gonic/gin"
// 	"github.com/gorilla/websocket"
// 	"github.com/sirupsen/logrus"
// )

// var upgrader = websocket.Upgrader{
// 	ReadBufferSize:  1024,
// 	WriteBufferSize: 1024,
// 	CheckOrigin:     func(r *http.Request) bool { return true },
// }

// type InputMsgWithChatId struct {
// 	ChatId    int    `json:"chatId"`
// 	Content   string `json:"content"`
// 	Type      string `json:"type"`
// 	CreatedAt string `json:"createdAt"`
// }

// func (h *Handler) wsChat(c *gin.Context) {
// 	authToken := c.Param("auth")

// 	id, err := h.services.Authorization.ParseToken(authToken)
// 	if err != nil {
// 		NewTransportErrorResponse(c, http.StatusBadRequest, "parse token failed")
// 		return
// 	}

// 	c.Set(UserId, id)

// 	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
// 	if err != nil {
// 		logrus.Error(err.Error())
// 		NewTransportErrorResponse(c, http.StatusInternalServerError, err.Error())
// 		return
// 	}
// 	// defer func() {
// 	// 	h.services.ITaskService.UnregisterConnection(id)
// 	// 	conn.Close()
// 	// }()

// 	h.services.ITaskService.RegisterConnection(id, conn)
// 	h.wsReader(conn, id)
// }

// func (h *Handler) wsReader(conn *websocket.Conn, userId int) {
// 	for {
// 		var input InputMsgWithChatId

// 		if err := conn.ReadJSON(&input); err != nil {
// 			logrus.Error(err.Error())
// 			break
// 		}

// 		inputMsg := models.Message{
// 			Content:   input.Content,
// 			Type:      input.Type,
// 			CreatedAt: input.CreatedAt,
// 		}

// 		logrus.Info(inputMsg)

// 		chat, err := h.services.Chat.GetById(userId, input.ChatId)
// 		if err != nil {
// 			logrus.Error(err.Error())
// 			continue
// 		}

// 		inputMsg.SenderId = userId
// 		createChatMsg := models.CreateMsg{
// 			Msg:     inputMsg,
// 			History: chat.Context,
// 			ChatId:  chat.Id,
// 		}

// 		h.services.ITaskService.EnqueueTask(userId, createChatMsg)
// 	}
// }
