package handler

import (
	"net/http"
	"time"

	"booklog-pile/internal/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// SearchComrades は同志を探す
func SearchComrades(c *gin.Context) {
	isbn := c.Query("isbn")
	if isbn == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "isbn query parameter is required"})
		return
	}

	// 本来はDBで指定されたISBNを「積読」にしている他のユーザーを検索する
	mockComrades := []model.User{
		{
			Model: gorm.Model{
				ID:        101,
				CreatedAt: time.Now().Add(-50 * 24 * time.Hour),
			},
			Username: "comrade1",
			Email:    "comrade1@example.com",
		},
		{
			Model: gorm.Model{
				ID:        102,
				CreatedAt: time.Now().Add(-100 * 24 * time.Hour),
			},
			Username: "comrade2",
			Email:    "comrade2@example.com",
		},
	}

	c.JSON(http.StatusOK, mockComrades)
}
