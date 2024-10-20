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

type Service struct {
	Authorization
	Chat
}

func NewService(repos *repository.Respository) *Service {
	return &Service{
		Authorization: NewAuthService(repos.Authorization),
		Chat:          NewChatService(repos.ChatRepozitory),
	}
}
