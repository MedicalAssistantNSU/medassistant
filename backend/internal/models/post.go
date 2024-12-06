package models

type Post struct {
	Id          int    `json:"id" db:"id"`
	Title       string `json:"title" db:"title"`
	Description string `json:"description" db:"description"`
	Content     string `json:"content" db:"content"`
	PublishedAt string `json:"created_at" db:"published_at"`
	ImageURL    string `json:"image_url" db:"image_url"`
}
