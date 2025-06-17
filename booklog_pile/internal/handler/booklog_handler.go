package handler

import (
	"booklog-pile/internal/model"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// モックデータ用の共通インスタンス
var mockUser = model.User{
	ID:        uuid.NewString(),
	Username:  "booklover",
	Email:     "user@example.com",
	CreatedAt: time.Now().Add(-30 * 24 * time.Hour),
}

var mockBook1 = model.Book{
	ISBN:          "9784101010015",
	Title:         "こころ",
	Author:        "夏目漱石",
	Publisher:     "新潮社",
	PublishedDate: "1989-05-20",
	Description:   "先生と私、二人の人間のこころの触れ合いを描いた名作。",
	PageCount:     280,
	ThumbnailURL:  "https://cover.openbd.jp/9784101010015.jpg",
}

var mockBook2 = model.Book{
	ISBN:          "9784167158057",
	Title:         "人間失格",
	Author:        "太宰治",
	Publisher:     "角川書店",
	PublishedDate: "1985-05-25",
	Description:   "自己の生涯を作品に昇華させた太宰文学の代表作。",
	PageCount:     180,
	ThumbnailURL:  "https://cover.openbd.jp/9784167158057.jpg",
}

// GetMyBooklog は自分の蔵書リストを取得する
func GetMyBooklog(c *gin.Context) {
	status := c.Query("status")

	// 本来はDBからユーザーの蔵書リストを取得する
	allEntries := []model.BooklogEntry{
		{ID: uuid.NewString(), User: mockUser, Book: mockBook1, Status: model.StatusTsundoku, AddedAt: time.Now().Add(-10 * 24 * time.Hour)},
		{ID: uuid.NewString(), User: mockUser, Book: mockBook2, Status: model.StatusReading, AddedAt: time.Now().Add(-5 * 24 * time.Hour)},
	}

	if status == "" {
		c.JSON(http.StatusOK, allEntries)
		return
	}

	var filteredEntries []model.BooklogEntry
	for _, entry := range allEntries {
		if string(entry.Status) == status {
			filteredEntries = append(filteredEntries, entry)
		}
	}

	c.JSON(http.StatusOK, filteredEntries)
}

// AddBookToBooklog は蔵書リストに本を追加する
func AddBookToBooklog(c *gin.Context) {
	var req struct {
		ISBN string `json:"isbn" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 本来はISBNを元に書籍情報を取得し、DBに蔵書エントリを作成する
	// 既に追加済みかのチェックも行う

	newEntry := model.BooklogEntry{
		ID:      uuid.NewString(),
		User:    mockUser,
		Book:    mockBook1, // ダミーで固定の書籍を返す
		Status:  model.StatusTsundoku,
		AddedAt: time.Now(),
	}
	// リクエストされたISBNをBook情報に反映
	newEntry.Book.ISBN = req.ISBN

	c.JSON(http.StatusCreated, newEntry)
}

// UpdateBooklogStatus は蔵書のステータスを更新する
func UpdateBooklogStatus(c *gin.Context) {
	booklogId := c.Param("booklogId")
	var req struct {
		Status model.BookStatus `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 本来はDBからbooklogIdに対応するエントリを探し、ステータスを更新する
	// 見つからなければ404を返す

	updatedEntry := model.BooklogEntry{
		ID:      booklogId,
		User:    mockUser,
		Book:    mockBook1,
		Status:  req.Status, // リクエストされたステータスに更新
		AddedAt: time.Now().Add(-10 * 24 * time.Hour),
	}

	c.JSON(http.StatusOK, updatedEntry)
}

// DeleteBooklogEntry は蔵書を削除する
func DeleteBooklogEntry(c *gin.Context) {
	_ = c.Param("booklogId") // booklogId を取得

	// 本来はDBからbooklogIdに対応するエントリを削除する
	// 見つからなければ404を返す

	c.Status(http.StatusNoContent)
}
