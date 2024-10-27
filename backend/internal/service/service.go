package service

import (
	"context"
	"io"
	"med-asis/internal/models"
	"med-asis/internal/repository"
)

type Authorization interface {
	CreateUser(user models.User) (int, error)
	GenerateToken(username, password string) (string, error)
	ParseToken(token string) (int, error)
	GetUserByUsername(username string) (models.User, error)
	GetUserById(id int) (models.User, error)
}

type Chat interface {
	Create(userId int, list models.Chat) (int, error)
	GetAll(userId int) ([]models.Chat, error)
	GetById(userId, id int) (models.Chat, error)
	Delete(userId, id int) error
	Update(userId, id int, updatedChat models.Chat) error
	GetAllInfo(userId int) ([]ChatsOutput, error)
}

type Message interface {
	Create(chat_id int, msg models.Message) (models.Message, error)
	GetAll(user_id, chat_id int) ([]models.Message, error)
	GetItemById(user_id, message_id int) (models.Message, error)
	Delete(user_id, message_id int) error
	Update(user_id, message_id int, updatedMsg models.Message) error
}

type Uploader interface {
	Upload(ctx context.Context, file io.Reader, size int64, contentType string) (string, error)
}

type Service struct {
	Authorization
	Chat
	Message
	Uploader
}

func NewService(repos *repository.Respository) *Service {
	return &Service{
		Authorization: NewAuthService(repos.Authorization),
		Chat:          NewChatService(repos.ChatRepozitory, repos.MessageRepository),
		Message:       NewMessageService(repos.MessageRepository),
		Uploader:      NewUpdoaderService(repos.FileStorage),
	}
}
