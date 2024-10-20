package models

type Chat struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

type Message struct {
	Id        int    `json:"id"`
	SenderId  int    `json:"user_id"`
	Content   string `json:"content"`
	Image     string `json:"image"`
	Document  string `json:"document"`
	CreatedAt string `json:"created_at"`
}

type ChatMessages struct {
	Id        int
	ChatId    int
	MessageId int
}

type UsersChats struct {
	Id     int
	UserId int
	ChatId int
}
