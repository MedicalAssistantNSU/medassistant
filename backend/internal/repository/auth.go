package repository

import (
	"fmt"
	"med-asis/internal/models"

	"github.com/jmoiron/sqlx"
)

type AuthPostgres struct {
	db *sqlx.DB
}

func NewAuthPostgres(db *sqlx.DB) *AuthPostgres {
	return &AuthPostgres{db: db}
}

func (a *AuthPostgres) CreateUser(user models.User) (int, error) {
	var id int
	query := fmt.Sprintf("INSERT INTO %s (name, username, password_hash) values ($1, $2, $3) RETURNING id", usersTable)
	row := a.db.QueryRow(query, user.Name, user.Username, user.Password)

	if err := row.Scan(&id); err != nil {
		return 0, err
	}

	return id, nil
}

func (a *AuthPostgres) GetUser(username, password string) (models.User, error) {
	var user models.User
	query := fmt.Sprintf("SELECT id FROM %s WHERE username=$1 AND password_hash=$2", usersTable)

	err := a.db.Get(&user, query, username, password)
	return user, err
}

func (a *AuthPostgres) GetUserByUsername(username string) (models.User, error) {
	var user models.User
	query := fmt.Sprintf("SELECT id, name, username, password_hash FROM %s WHERE username=$1", usersTable)

	err := a.db.Get(&user, query, username)
	return user, err
}

func (a *AuthPostgres) GetUserById(id int) (models.User, error) {
	var user models.User
	query := fmt.Sprintf("SELECT id, name, username, password_hash FROM %s WHERE id=$1", usersTable)

	err := a.db.Get(&user, query, id)
	return user, err
}
