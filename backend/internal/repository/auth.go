package repository

import (
	"database/sql"
	"fmt"
	"med-asis/internal/models"

	"strings"

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

	user.Embedding = createStartEmbedding()

	query := fmt.Sprintf("INSERT INTO %s (name, username, password_hash, embedding) values ($1, $2, $3, $4) RETURNING id", usersTable)
	row := a.db.QueryRow(query, user.Name, user.Username, user.Password, user.Embedding)

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

func (a *AuthPostgres) UpdateUser(userId int, updatedUser models.User, profile *models.InputUserProfile) error {
	tx, err := a.db.Beginx()
	if err != nil {
		return err
	}
	query := fmt.Sprintf(`UPDATE %s lt SET 
		name = $1, 
		username = $2, 
		password_hash = $3, 
		embedding = $4
		WHERE lt.id = $5`,
		usersTable)

	_, err = tx.Exec(query, updatedUser.Name, updatedUser.Username, updatedUser.Password, updatedUser.Embedding, userId)
	if err != nil {
		tx.Rollback()
		return err
	}

	// Проверяем, есть ли уже профиль
	var exists bool
	err = tx.Get(&exists, `SELECT EXISTS (SELECT 1 FROM user_profiles WHERE user_id = $1)`, userId)
	if err != nil {
		tx.Rollback()
		return err
	}

	profile.UserID = userId

	if exists {
		// Обновляем
		_, err = tx.NamedExec(`
            UPDATE user_profiles
            SET avatar_url = :avatar_url,
                age = :age,
                height = :height,
				weight = :weight,
				gender = :gender,
				profession = :profession
            WHERE user_id = :user_id
        `, profile)
	} else {
		// Вставляем новый профиль
		_, err = tx.NamedExec(`
            INSERT INTO user_profiles (user_id, avatar_url, age, height, weight, gender, profession)
            VALUES (:user_id, :avatar_url, :age, :height, :weight, :gender, :profession)
        `, profile)
	}

	if err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit()
}

func (a *AuthPostgres) GetUserProfile(userID int) (*models.UserProfile, error) {
	var profile models.UserProfile
	err := a.db.Get(&profile, "SELECT * FROM user_profiles WHERE user_id = $1", userID)

	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	return &profile, nil
}

func (a *AuthPostgres) DeleteUser(userId int) error {
	query := fmt.Sprintf("DELETE FROM %s lt WHERE lt.id = $1",
		usersTable)
	_, err := a.db.Exec(query, userId)
	return err
}

func createStartEmbedding() string {
	var sb strings.Builder

	for i := 0; i < 312; i++ {
		sb.WriteString("0.1")
		if i != 311 {
			sb.WriteString(",")
		}
	}

	return sb.String()
}
