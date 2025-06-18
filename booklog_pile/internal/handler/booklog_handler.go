package handler

import (
	"booklog-pile/internal/db"
	"booklog-pile/internal/model"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// GetMyBooklog は自分の蔵書リストを取得する
func GetMyBooklog(c *gin.Context) {
	userId, _ := c.Get("userId")
	status := c.Query("status")

	query := db.DB.Where("user_id = ?", userId).Preload("Book").Preload("User")

	if status != "" {
		query = query.Where("status = ?", status)
	}

	var entries []model.BooklogEntry
	if err := query.Find(&entries).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve booklog"})
		return
	}

	if entries == nil {
		entries = []model.BooklogEntry{}
	}

	c.JSON(http.StatusOK, entries)
}

// AddBookToBooklog は蔵書リストに本を追加する
func AddBookToBooklog(c *gin.Context) {
	userId, _ := c.Get("userId")
	user, _ := c.Get("user")

	var req struct {
		ISBN string `json:"isbn" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ISBNを元に書籍情報を探す。なければダミーデータで作成する。
	// 本来はここで外部API(e.g., Google Books API)を叩いて書籍情報を取得する
	book := model.Book{ISBN: req.ISBN}
	err := db.DB.FirstOrCreate(&book, model.Book{
		ISBN:         req.ISBN,
		Title:        "タイトル不明",
		Author:       "著者不明",
		Publisher:    "出版社不明",
		PublishedDate: "日付不明",
		Description:  "情報なし",
		PageCount:    0,
		ThumbnailURL: "",
	}).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get or create book"})
		return
	}

	// 既に同じ本を登録済みかチェック
	var existingEntry model.BooklogEntry
	err = db.DB.Where("user_id = ? AND book_isbn = ?", userId, req.ISBN).First(&existingEntry).Error
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusConflict, gin.H{"error": "This book is already in your booklog"})
		return
	}

	newEntry := model.BooklogEntry{
		UserID:   userId.(uint),
		BookISBN: req.ISBN,
		Status:   model.StatusTsundoku,
	}

	if err := db.DB.Create(&newEntry).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add book to booklog"})
		return
	}

	// レスポンスのためにUserとBookの情報を付与する
	newEntry.User = user.(model.User)
	newEntry.Book = book

	c.JSON(http.StatusCreated, newEntry)
}

// UpdateBooklogStatus は蔵書のステータスを更新する
func UpdateBooklogStatus(c *gin.Context) {
	userId, _ := c.Get("userId")
	booklogId := c.Param("booklogId")

	var req struct {
		Status model.BookStatus `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 対象のエントリをDBから探す（自分の所有物かどうかもチェック）
	var entry model.BooklogEntry
	err := db.DB.Where("id = ? AND user_id = ?", booklogId, userId).First(&entry).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Booklog entry not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// ステータスを更新
	if err := db.DB.Model(&entry).Update("status", req.Status).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update status"})
		return
	}

	// 更新後のエントリを返すためにリレーションを読み込む
	db.DB.Preload("Book").Preload("User").First(&entry, entry.ID)

	c.JSON(http.StatusOK, entry)
}

// DeleteBooklogEntry は蔵書を削除する
func DeleteBooklogEntry(c *gin.Context) {
	userId, _ := c.Get("userId")
	booklogId := c.Param("booklogId")

	// DBからbooklogIdとuserIdに一致するエントリを削除する
	result := db.DB.Where("id = ? AND user_id = ?", booklogId, userId).Delete(&model.BooklogEntry{})

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete entry"})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booklog entry not found"})
		return
	}

	c.Status(http.StatusNoContent)
}
