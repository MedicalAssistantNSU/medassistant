package models

type User struct {
	Id       int    `json:"id"`
	Name     string `json:"name"`
	Username string `json:"email" db:"username"`
	Password string `json:"-" db:"password_hash"`
}
