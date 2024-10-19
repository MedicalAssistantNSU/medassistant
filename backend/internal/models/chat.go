package models

type Chat struct {
	Id   int    `json:"-"`
	Name string `json:"name"`
}
