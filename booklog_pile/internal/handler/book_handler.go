package handler

import (
	"booklog-pile/internal/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

// SearchBooks は書籍を検索する
func SearchBooks(c *gin.Context) {
	isbn := c.Query("isbn")
	keyword := c.Query("keyword")

	// ISBNまたはキーワードが指定されている必要がある
	if isbn == "" && keyword == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "isbn or keyword query parameter is required"})
		return
	}

	// 本来はここで外部API(e.g., Google Books API, openBD)を叩いて書籍情報を取得する
	// 以下はダミーのレスポンス

	mockBooks := []model.Book{
		{
			ISBN:          "9784101010015",
			Title:         "こころ",
			Author:        "夏目漱石",
			Publisher:     "新潮社",
			PublishedDate: "1989-05-20",
			Description:   "先生と私、二人の人間のこころの触れ合いを描いた名作。",
			PageCount:     280,
			ThumbnailURL:  "https://cover.openbd.jp/9784101010015.jpg",
		},
		{
			ISBN:          "9784003101027",
			Title:         "吾輩は猫である",
			Author:        "夏目漱石",
			Publisher:     "岩波書店",
			PublishedDate: "1990-07-17",
			Description:   "猫の視点から人間社会を風刺したユーモラスな作品。",
			PageCount:     650,
			ThumbnailURL:  "https://cover.openbd.jp/9784003101027.jpg",
		},
	}

	// ISBNが指定されていれば1件だけ返す
	if isbn != "" {
		for _, book := range mockBooks {
			if book.ISBN == isbn {
				c.JSON(http.StatusOK, []model.Book{book})
				return
			}
		}
		c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
		return
	}

	c.JSON(http.StatusOK, mockBooks)
}
