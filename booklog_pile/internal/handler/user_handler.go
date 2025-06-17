package handler

import (
	"booklog-pile/internal/model"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// GetMyUser は認証済みユーザーの情報を取得する
func GetMyUser(c *gin.Context) {
	// 本来はミドルウェアでセットされたユーザーIDを元にDBから情報を取得する
	// userId, _ := c.Get("userId")

	mockUser := model.User{
		ID:        uuid.NewString(),
		Username:  "booklover",
		Email:     "user@example.com",
		CreatedAt: time.Now().Add(-30 * 24 * time.Hour), // 30日前に作成されたと仮定
	}

	c.JSON(http.StatusOK, mockUser)
}
