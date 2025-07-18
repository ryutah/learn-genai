package handler

import (
	"net/http"
	"time"

	"booklog-pile/internal/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// mockUser はテスト用のダミーユーザー
var mockUser = model.User{
	Model: gorm.Model{
		ID:        1,
		CreatedAt: time.Now().Add(-365 * 24 * time.Hour),
	},
	Username: "test_user",
	Email:    "test@example.com",
}

// GetReviews は本の感想一覧を取得する
func GetReviews(c *gin.Context) {
	_ = c.Param("booklogId") // booklogId を取得

	// 本来はbooklogIdに関連する感想をDBから取得する
	mockReviews := []model.Review{
		{
			Model: gorm.Model{
				ID:        1,
				CreatedAt: time.Now().Add(-2 * 24 * time.Hour),
			},
			User:       mockUser,
			Comment:    "非常に考えさせられる作品でした。",
			HasSpoiler: false,
		},
		{
			Model: gorm.Model{
				ID:        2,
				CreatedAt: time.Now().Add(-1 * 24 * time.Hour),
			},
			User:       model.User{Model: gorm.Model{ID: 2}, Username: "another_user"},
			Comment:    "結末には驚きました。ネタバレあり。",
			HasSpoiler: true,
		},
	}

	c.JSON(http.StatusOK, mockReviews)
}

// PostReview は感想を投稿する
func PostReview(c *gin.Context) {
	_ = c.Param("booklogId") // booklogId を取得
	var req model.ReviewInput
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 本来はDBに感想を保存する
	// 投稿するユーザーは認証情報から取得する
	// 対象の蔵書が「読了」ステータスであるかチェックするなどのロジックも必要

	newReview := model.Review{
		Model: gorm.Model{
			ID:        3, // 適当なID
			CreatedAt: time.Now(),
		},
		User:       mockUser, // 投稿者は認証済みユーザー
		Comment:    req.Comment,
		HasSpoiler: req.HasSpoiler,
	}

	c.JSON(http.StatusCreated, newReview)
}
