package model

import "time"

// BookStatus は書籍の読書ステータスを表す
type BookStatus string

const (
	StatusTsundoku BookStatus = "積読"
	StatusReading  BookStatus = "読書中"
	StatusRead     BookStatus = "読了"
)

// User はユーザー情報を表す
type User struct {
	ID        string    `json:"id"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"createdAt"`
}

// UserRegistration は新規ユーザー登録のリクエストボディを表す
type UserRegistration struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
}

// UserLogin はログインのリクエストボディを表す
type UserLogin struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// Book は書籍情報を表す
type Book struct {
	ISBN          string `json:"isbn"`
	Title         string `json:"title"`
	Author        string `json:"author"`
	Publisher     string `json:"publisher"`
	PublishedDate string `json:"publishedDate"` // "YYYY-MM-DD"
	Description   string `json:"description"`
	PageCount     int    `json:"pageCount"`
	ThumbnailURL  string `json:"thumbnailUrl"`
}

// BooklogEntry は蔵書リストのエントリを表す
type BooklogEntry struct {
	ID      string     `json:"id"`
	User    User       `json:"user"`
	Book    Book       `json:"book"`
	Status  BookStatus `json:"status"`
	AddedAt time.Time  `json:"addedAt"`
}

// Review は感想を表す
type Review struct {
	ID         string    `json:"id"`
	User       User      `json:"user"`
	Comment    string    `json:"comment"`
	HasSpoiler bool      `json:"hasSpoiler"`
	CreatedAt  time.Time `json:"createdAt"`
}

// ReviewInput は感想投稿のリクエストボディを表す
type ReviewInput struct {
	Comment    string `json:"comment" binding:"required"`
	HasSpoiler bool   `json:"hasSpoiler"`
}

// ReadingStats は読書ログの統計データを表す
type ReadingStats struct {
	MonthlyReadCount int `json:"monthlyReadCount"`
	MonthlyPageCount int `json:"monthlyPageCount"`
	History          []struct {
		Month string `json:"month"`
		Count int    `json:"count"`
	} `json:"history"`
}
