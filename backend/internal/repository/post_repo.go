package repository

import (
	"fmt"
	"med-asis/internal/models"

	"github.com/jmoiron/sqlx"
)

type PostRepo struct {
	db *sqlx.DB
}

func NewPostRepo(db *sqlx.DB) *PostRepo {
	return &PostRepo{db: db}
}

func (l *PostRepo) Create(post models.Post) (int, error) {
	var id int

	query1 := fmt.Sprintf(`
		INSERT INTO %s (
			title, 
			description,
			content, 
			published_at, 
			image_url
		) values ($1, $2, $3, $4, $5) RETURNING id`, postsTable)

	row := l.db.QueryRow(query1, post.Title, post.Description,
		post.Content, post.PublishedAt, post.ImageURL)

	if err := row.Scan(&id); err != nil {
		return 0, err
	}

	return id, nil
}

func (l *PostRepo) GetAll() ([]models.Post, error) {
	var posts []models.Post
	query := fmt.Sprintf(`SELECT 
		lt.id, 
		lt.title, 
		lt.description,
		lt.content,
		lt.published_at,
		lt.image_url
	FROM %s lt`, postsTable)

	err := l.db.Select(&posts, query)
	if err != nil {
		return nil, err
	}
	return posts, nil
}

func (l *PostRepo) GetById(id int) (models.Post, error) {
	var post models.Post
	query := fmt.Sprintf(`SELECT 
		lt.id, 
		lt.title, 
		lt.description,
		lt.content,
		lt.published_at ,
		lt.image_url
		FROM %s WHERE lt.id = $1`,
		postsTable)

	err := l.db.Get(&post, query, id)
	return post, err
}

func (l *PostRepo) Delete(id int) error {
	query := fmt.Sprintf("DELETE FROM %s lt WHERE lt.id = $1",
		postsTable)
	_, err := l.db.Exec(query, id)
	return err
}

func (l *PostRepo) Update(id int, updatedPost models.Post) error {
	query := fmt.Sprintf(`UPDATE %s lt SET 
		title = $1, 
		description = $2, 
		content = $3, 
		published_at = $4,
		image_url = $5,
		WHERE lt.id = $6`,
		postsTable)

	_, err := l.db.Exec(query, updatedPost.Title, updatedPost.Description, updatedPost.Content,
		updatedPost.PublishedAt, updatedPost.ImageURL, id)
	return err
}
