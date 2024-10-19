package repository

import (
	"med-asis/internal/models"

	"github.com/jmoiron/sqlx"
)

type Authorization interface {
	CreateUser(user models.User) (int, error)
	GetUser(username, password string) (models.User, error)
}

type Respository struct {
	Authorization
}

func NewRepository(db *sqlx.DB) *Respository {
	return &Respository{
		Authorization: NewAuthPostgres(db),
	}
}
