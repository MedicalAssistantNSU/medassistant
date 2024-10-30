package models

type Chat struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

type Message struct {
	Id        int    `json:"id"`
	SenderId  int    `json:"senderId" db:"sender_id"`
	Content   string `json:"content"`
	Type      string `json:"type"`
	CreatedAt string `json:"createdAt" db:"created_at"`
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
