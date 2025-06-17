package handler

import (
	"booklog-pile/internal/model"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
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
			ID:        uuid.NewString(),
			Username:  "comrade1",
			Email:     "comrade1@example.com",
			CreatedAt: time.Now().Add(-50 * 24 * time.Hour),
		},
		{
			ID:        uuid.NewString(),
			Username:  "comrade2",
			Email:     "comrade2@example.com",
			CreatedAt: time.Now().Add(-100 * 24 * time.Hour),
		},
	}

	c.JSON(http.StatusOK, mockComrades)
}
