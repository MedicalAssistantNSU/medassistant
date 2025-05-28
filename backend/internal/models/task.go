package models

type Task struct {
	UserID  int
	Message CreateMsg
	Done    chan string
}
