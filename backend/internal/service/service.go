package service

import (
	"med-asis/internal/models"
	"med-asis/internal/repository"
)

type Authorization interface {
	CreateUser(user models.User) (int, error)
	GenerateToken(username, password string) (string, error)
	ParseToken(token string) (int, error)
}

type Chat interface {
	Create(userId int, list models.Chat) (int, error)
	GetAll(userId int) ([]models.Chat, error)
	GetById(userId, id int) (models.Chat, error)
	Delete(userId, id int) error
	Update(userId, id int, updatedChat models.Chat) error
}

type Message interface {
	Create(chat_id int, msg models.Message) (int, error)
	GetAll(user_id, chat_id int) ([]models.Message, error)
	GetItemById(user_id, message_id int) (models.Message, error)
	Delete(user_id, message_id int) error
	Update(user_id, message_id int, updatedMsg models.Message) error
}

type Service struct {
	Authorization
	Chat
	Message
}

func NewService(repos *repository.Respository) *Service {
	return &Service{
		Authorization: NewAuthService(repos.Authorization),
		Chat:          NewChatService(repos.ChatRepozitory),
		Message:       NewMessageService(repos.MessageRepository),
	}
}
