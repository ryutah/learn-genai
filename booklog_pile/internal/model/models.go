package model

import (
	"gorm.io/gorm"
)

// BookStatus は書籍の読書ステータスを表す
type BookStatus string

const (
	StatusTsundoku BookStatus = "積読"
	StatusReading  BookStatus = "読書中"
	StatusRead     BookStatus = "読了"
)

// User はユーザー情報を表す
type User struct {
	gorm.Model
	Username string `json:"username" gorm:"unique"`
	Email    string `json:"email" gorm:"unique"`
	Password string `json:"-"` // パスワードはレスポンスに含めない
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
	ISBN          string `json:"isbn" gorm:"primaryKey"`
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
	gorm.Model
	UserID   uint       `json:"-"`
	User     User       `json:"user"`
	BookISBN string     `json:"-"`
	Book     Book       `json:"book"`
	Status   BookStatus `json:"status" gorm:"default:'積読'"`
}

// Review は感想を表す
type Review struct {
	gorm.Model
	UserID         uint   `json:"-"`
	User           User   `json:"user"`
	BooklogEntryID uint   `json:"-"`
	Comment        string `json:"comment"`
	HasSpoiler     bool   `json:"hasSpoiler"`
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
