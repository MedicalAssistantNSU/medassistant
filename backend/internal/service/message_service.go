package service

import (
	"med-asis/internal/models"
	"med-asis/internal/repository"
)

type MessageService struct {
	repo repository.MessageRepository
}

func NewMessageService(repo repository.MessageRepository) *MessageService {
	return &MessageService{
		repo: repo,
	}
}

func (i *MessageService) Create(chat_id int, msg models.Message) (int, error) {
	return i.repo.Create(chat_id, msg)
}

func (i *MessageService) GetAll(user_id, chat_id int) ([]models.Message, error) {
	return i.repo.GetAll(user_id, chat_id)
}

func (i *MessageService) GetItemById(user_id, message_id int) (models.Message, error) {
	return i.repo.GetItemById(user_id, message_id)
}

func (i *MessageService) Delete(user_id, message_id int) error {
	return i.repo.Delete(user_id, message_id)
}

func (i *MessageService) Update(user_id, message_id int, updatedMsg models.Message) error {
	return i.repo.Update(user_id, message_id, updatedMsg)
}
