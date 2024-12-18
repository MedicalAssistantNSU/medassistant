package repository

import (
	"med-asis/internal/models"

	"github.com/jmoiron/sqlx"
)

type Authorization interface {
	CreateUser(user models.User) (int, error)
	GetUser(username, password string) (models.User, error)
	GetUserByUsername(username string) (models.User, error)
	GetUserById(id int) (models.User, error)
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
	GetAll(chat_id int) ([]models.Message, error)
	GetItemById(user_id, message_id int) (models.Message, error)
	Delete(user_id, message_id int) error
	Update(user_id, message_id int, updatedMessage models.Message) error
	GetMsgById(message_id int) (models.Message, error)
	GetScans(user_id int) ([]models.Message, error)
}

type PostRepository interface {
	Update(id int, updatedPost models.Post) error
	Delete(id int) error
	GetById(id int) (models.Post, error)
	GetAll() ([]models.Post, error)
	Create(post models.Post) (int, error)
}

type Respository struct {
	Authorization
	ChatRepozitory
	MessageRepository
	PostRepository
	*FileStorage
}

func NewRepository(db *sqlx.DB, fs *FileStorage) *Respository {
	return &Respository{
		Authorization:     NewAuthPostgres(db),
		ChatRepozitory:    NewChatRepo(db),
		MessageRepository: NewMessageRepo(db),
		PostRepository:    NewPostRepo(db),
		FileStorage:       fs,
	}
}
