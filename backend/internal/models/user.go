package models

type User struct {
	Id        int    `json:"id" db:"id"`
	Name      string `json:"name" db:"name"`
	Username  string `json:"username" db:"username"`
	Password  string `json:"-" db:"password_hash"`
	Embedding string `json:"embedding"`
	Profile   *UserProfile
}

type UserProfile struct {
	UserID     int    `json:"user_id" db:"user_id"`
	AvatarUrl  string `json:"avatar_url" db:"avatar_url"`
	Age        *int   `json:"age" db:"age"`
	Height     *int   `json:"height" db:"height"`
	Profession string `json:"profession" db:"profession"`
	Gender     string `json:"gender" db:"gender"`
	Weight     *int   `json:"weight" db:"weight"`
}

type InputUserProfile struct {
	UserID     int    `json:"user_id" db:"user_id"`
	AvatarUrl  string `json:"avatar_url" db:"avatar_url"`
	Age        int    `json:"age" db:"age"`
	Height     int    `json:"height" db:"height"`
	Profession string `json:"profession" db:"profession"`
	Gender     string `json:"gender" db:"gender"`
	Weight     int    `json:"weight" db:"weight"`
}
