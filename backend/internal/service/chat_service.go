package service

import (
	"med-asis/internal/models"
	"med-asis/internal/repository"
)

type ChatService struct {
	repo repository.ChatRepozitory
}

func NewChatService(repo repository.ChatRepozitory) *ChatService {
	return &ChatService{
		repo: repo,
	}
}

func (l *ChatService) Create(userId int, list models.Chat) (int, error) {
	return l.repo.Create(userId, list)
}

func (l *ChatService) GetAll(userId int) ([]models.Chat, error) {
	return l.repo.GetAll(userId)
}

func (l *ChatService) GetById(userId, id int) (models.Chat, error) {
	return l.repo.GetById(userId, id)
}

func (l *ChatService) Delete(userId, id int) error {
	return l.repo.Delete(userId, id)
}

func (l *ChatService) Update(userId, id int, updatedChat models.Chat) error {
	return l.repo.Update(userId, id, updatedChat)
}
