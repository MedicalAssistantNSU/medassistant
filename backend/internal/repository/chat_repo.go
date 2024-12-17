package repository

import (
	"fmt"
	"med-asis/internal/models"

	"github.com/jmoiron/sqlx"
	"github.com/sirupsen/logrus"
)

type ChatRepo struct {
	db *sqlx.DB
}

func NewChatRepo(db *sqlx.DB) *ChatRepo {
	return &ChatRepo{db: db}
}

func (l *ChatRepo) Create(userId int, chat models.Chat) (int, error) {
	var id int
	tr, err := l.db.Begin()
	if err != nil {
		return 0, err
	}

	query1 := fmt.Sprintf("INSERT INTO %s (name, context) values ($1, $2) RETURNING id", chatsTable)
	row := tr.QueryRow(query1, chat.Name, "")
	if err := row.Scan(&id); err != nil {
		return 0, err
	}

	query2 := fmt.Sprintf("INSERT INTO %s (user_id, chat_id) values ($1, $2)", usersChats)
	_, err = tr.Exec(query2, userId, id)
	if err != nil {

		return 0, err
	}

	return id, tr.Commit()
}

func (l *ChatRepo) GetAll(userId int) ([]models.Chat, error) {
	var chats []models.Chat
	query := fmt.Sprintf("SELECT lt.id, lt.name, lt.context FROM %s lt INNER JOIN %s ul on ul.chat_id = lt.id WHERE ul.user_id = $1", chatsTable, usersChats)

	err := l.db.Select(&chats, query, userId)
	if err != nil {
		return nil, err
	}
	return chats, nil
}

func (l *ChatRepo) GetById(userId, id int) (models.Chat, error) {
	var chat models.Chat
	query := fmt.Sprintf("SELECT lt.id, lt.name, lt.context FROM %s lt INNER JOIN %s ul on ul.chat_id = lt.id WHERE ul.user_id = $1 AND lt.id = $2",
		chatsTable, usersChats)

	err := l.db.Get(&chat, query, userId, id)
	logrus.Info(chat.Name)
	return chat, err
}

func (l *ChatRepo) Delete(userId int, id int) error {
	query := fmt.Sprintf("DELETE FROM %s lt USING %s ul WHERE ul.chat_id = lt.id AND ul.user_id = $1 AND lt.id = $2",
		chatsTable, usersChats)
	_, err := l.db.Exec(query, userId, id)
	return err
}

func (l *ChatRepo) Update(userId, id int, updatedChat models.Chat) error {
	query := fmt.Sprintf("UPDATE %s lt SET name = $1, context = $2 FROM %s ul WHERE lt.id = ul.chat_id AND ul.user_id = $3 AND lt.id = $4",
		chatsTable, usersChats)

	_, err := l.db.Exec(query, updatedChat.Name, updatedChat.Context, userId, id)
	return err
}
