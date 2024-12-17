package repository

import (
	"fmt"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

const (
	usersTable   = "users"
	chatsTable   = "chats"
	messageTable = "messages"
	usersChats   = "user_chats"
	chatMessages = "chat_messages"
	postsTable   = "posts"
)

type Config struct {
	Port     string
	Host     string
	Username string
	DBName   string
	SSLMode  string
	Password string
}

func NewPostgresDB(config Config) (*sqlx.DB, error) {
	dataSourse := fmt.Sprintf("host=%s port=%s user=%s dbname=%s sslmode=%s password=%s", config.Host, config.Port,
		config.Username, config.DBName, config.SSLMode, config.Password)
	db, err := sqlx.Open("postgres", dataSourse)
	if err != nil {
		return nil, err
	}

	err = db.Ping()
	if err != nil {
		return nil, err
	}
	return db, nil
}
