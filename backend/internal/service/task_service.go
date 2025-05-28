package service

import (
	"med-asis/internal/models"
	"time"

	"sync"

	"github.com/gorilla/websocket"
	"github.com/sirupsen/logrus"
)

type TaskService struct {
	queue          chan models.Task
	conns          sync.Map
	chatService    Chat
	messageService Message
}

func NewTaskService(chat Chat, message Message) *TaskService {
	s := &TaskService{
		queue:          make(chan models.Task, 100),
		chatService:    chat,
		messageService: message,
	}
	go s.startWorkers(1)
	return s
}

func (s *TaskService) startWorkers(n int) {
	for i := 0; i < n; i++ {
		go func(workerID int) {
			for task := range s.queue {
				logrus.Printf("Worker %d обработал задачу для %d", workerID, task.UserID)
				s.processTask(task)
			}
		}(i)
	}
}

func (s *TaskService) RegisterConnection(userID int, conn *websocket.Conn) {
	s.conns.Store(userID, conn)
	// val, ok := s.conns.Load(userID)
	// logrus.Info(userID, val, ok)
}

func (s *TaskService) UnregisterConnection(userID int) {
	s.conns.Delete(userID)
}

func (s *TaskService) EnqueueTask(userID int, message models.CreateMsg) {
	s.queue <- models.Task{
		UserID:  userID,
		Message: message,
	}
}

func (s *TaskService) processTask(task models.Task) {

	logrus.Infof("processTask: sending to user %d", task.UserID)
	connAny, ok := s.conns.Load(task.UserID)
	if !ok {
		logrus.Warnf("no conn for user %d", task.UserID)
		return
	}
	conn := connAny.(*websocket.Conn)

	req := task

	inputMsg := models.Message{
		Content:   req.Message.Msg.Content,
		Type:      req.Message.Msg.Type,
		CreatedAt: req.Message.Msg.CreatedAt,
	}

	logrus.Info(inputMsg)

	chat, err := s.chatService.GetById(task.UserID, req.Message.ChatId)
	if err != nil {
		logrus.Error(err.Error())

	}

	inputMsg.SenderId = task.UserID
	answer, err := s.messageService.Create(req.Message.ChatId, models.CreateMsg{
		Msg:     inputMsg,
		History: chat.Context,
		ChatId:  chat.Id,
	})

	if err != nil {
		logrus.Error(err.Error())
	}

	updatedChat := models.Chat{
		Name:    chat.Name,
		Context: answer.History,
	}

	// logrus.Info(chat.Context)

	if err := s.chatService.Update(task.UserID, req.Message.ChatId, updatedChat); err != nil {
		logrus.Error(err.Error())
	}

	if !isAlive(conn) {
		logrus.Error("conn failed")
	}

	logrus.Info(answer)
	if err = conn.WriteJSON(&answer); err != nil {
		logrus.Info("what")
		logrus.Error(err.Error())
		s.conns.Delete(task.UserID)
		conn.Close()
	}
}

func isAlive(conn *websocket.Conn) bool {
	// sends a ping, waiting for at most 5 s for the write
	err := conn.WriteControl(
		websocket.PingMessage,
		nil,
		time.Now().Add(5*time.Second),
	)
	return err == nil
}
