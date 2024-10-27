package repository

import (
	"fmt"
	"med-asis/internal/models"

	"github.com/jmoiron/sqlx"
)

type MessageRepo struct {
	db *sqlx.DB
}

func NewMessageRepo(db *sqlx.DB) *MessageRepo {
	return &MessageRepo{
		db: db,
	}
}

func (i *MessageRepo) Create(chat_id int, msg models.Message) (int, error) {
	var id int
	tr, err := i.db.Begin()
	if err != nil {
		return 0, err
	}

	query1 := fmt.Sprintf("INSERT INTO %s (content, sender_id, type, created_at) values ($1, $2, $3, $4) RETURNING id", messageTable)
	row := tr.QueryRow(query1, msg.Content, msg.SenderId, msg.Type, msg.CreatedAt)
	if err := row.Scan(&id); err != nil {
		return 0, err
	}

	query2 := fmt.Sprintf("INSERT INTO %s (message_id, chat_id) values ($1, $2)", chatMessages)
	_, err = tr.Exec(query2, id, chat_id)
	if err != nil {
		tr.Rollback()
		return 0, err
	}

	return id, tr.Commit()
}

func (i *MessageRepo) GetAll(chat_id int) ([]models.Message, error) {
	var items []models.Message
	query := fmt.Sprintf(`SELECT il.id, il.content, il.sender_id, il.type, il.created_at FROM %s il 
						INNER JOIN %s li on li.message_id = il.id
						INNER JOIN %s ul on li.chat_id = ul.chat_id
						WHERE li.chat_id = $1`,
		messageTable, chatMessages, usersChats)

	err := i.db.Select(&items, query, chat_id)
	return items, err
}

func (i *MessageRepo) GetItemById(user_id, message_id int) (models.Message, error) {
	var input models.Message
	query := fmt.Sprintf(`SELECT il.id, il.content, il.sender_id, il.type, il.created_at FROM %s il 
						INNER JOIN %s li on li.message_id = il.id
						INNER JOIN %s ul on li.chat_id = ul.chat_id
						WHERE ul.user_id = $1 AND il.id = $2`,
		messageTable, chatMessages, usersChats)
	err := i.db.Get(&input, query, user_id, message_id)
	return input, err
}

func (i *MessageRepo) GetMsgById(message_id int) (models.Message, error) {
	var input models.Message
	query := fmt.Sprintf("SELECT il.id, il.content, il.sender_id, il.type, il.created_at FROM %s il WHERE il.id = $1", messageTable)
	err := i.db.Get(&input, query, message_id)
	return input, err
}

func (i *MessageRepo) Delete(user_id, message_id int) error {
	query := fmt.Sprintf("DELETE FROM %s ti USING %s ul, %s li WHERE ti.id = li.message_id AND li.chat_id = ul.chat_id AND ul.user_id = $1 AND ti.id = $2",
		messageTable, usersChats, chatMessages)

	_, err := i.db.Exec(query, user_id, message_id)
	return err
}

func (i *MessageRepo) Update(user_id, message_id int, updatedMessage models.Message) error {
	query := fmt.Sprintf(`UPDATE %s ti SET content = $1, sender_id = $2, type = $3, created_at = $5 FROM %s ul, %s li 
							WHERE ti.id = li.message_id AND li.chat_id = ul.chat_id AND ul.user_id = $4 AND ti.id = $5`,
		messageTable, usersChats, chatMessages)
	_, err := i.db.Exec(query, updatedMessage.Content, updatedMessage.SenderId,
		updatedMessage.Type, updatedMessage.CreatedAt, user_id, message_id)
	return err
}
