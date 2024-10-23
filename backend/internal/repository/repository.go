package repository

import (
	"med-asis/internal/models"

	"github.com/jmoiron/sqlx"
)

type Authorization interface {
	CreateUser(user models.User) (int, error)
	GetUser(username, password string) (models.User, error)
}

type ChatRepozitory interface {
	Create(userId int, chat models.Chat) (int, error)
	GetAll(userId int) ([]models.Chat, error)
	GetById(userId, id int) (models.Chat, error)
	Delete(userId int, id int) error
	Update(userId, id int, updatedChat models.Chat) error
}

type MessageRepository interface {
	Create(chat_id int, msg models.Message) (int, error)
	GetAll(user_id, chat_id int) ([]models.Message, error)
	GetItemById(user_id, message_id int) (models.Message, error)
	Delete(user_id, message_id int) error
	Update(user_id, message_id int, updatedMessage models.Message) error
}

type Respository struct {
	Authorization
	ChatRepozitory
	MessageRepository
	*FileStorage
}

func NewRepository(db *sqlx.DB, fs *FileStorage) *Respository {
	return &Respository{
		Authorization:     NewAuthPostgres(db),
		ChatRepozitory:    NewChatRepo(db),
		MessageRepository: NewMessageRepo(db),
		FileStorage:       fs,
	}
}
