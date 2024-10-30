package service

import (
	"med-asis/internal/models"
	"med-asis/internal/repository"
)

type ChatsOutput struct {
	Id       int              `json:"id"`
	Name     string           `json:"name"`
	Messages []models.Message `json:"messages"`
}

type ChatService struct {
	chatRepo repository.ChatRepozitory
	msgRepo  repository.MessageRepository
}

func NewChatService(chatRepo repository.ChatRepozitory,
	msgRepo repository.MessageRepository) *ChatService {
	return &ChatService{
		chatRepo: chatRepo,
		msgRepo:  msgRepo,
	}
}

func (l *ChatService) Create(userId int, list models.Chat) (int, error) {
	return l.chatRepo.Create(userId, list)
}

func (l *ChatService) GetAll(userId int) ([]models.Chat, error) {
	return l.chatRepo.GetAll(userId)
}

func (l *ChatService) GetAllInfo(userId int) ([]ChatsOutput, error) {
	chats, err := l.chatRepo.GetAll(userId)
	if err != nil {
		return nil, err
	}

	output := make([]ChatsOutput, len(chats))

	for i, chat := range chats {
		messages, err := l.msgRepo.GetAll(chat.Id)
		if err != nil || messages == nil {
			messages = make([]models.Message, 0)
		}
		output[i] = ChatsOutput{
			Id:       chat.Id,
			Name:     chat.Name,
			Messages: messages,
		}
	}

	return output, nil
}

func (l *ChatService) GetById(userId, id int) (models.Chat, error) {
	return l.chatRepo.GetById(userId, id)
}

func (l *ChatService) Delete(userId, id int) error {
	return l.chatRepo.Delete(userId, id)
}

func (l *ChatService) Update(userId, id int, updatedChat models.Chat) error {
	return l.chatRepo.Update(userId, id, updatedChat)
}
