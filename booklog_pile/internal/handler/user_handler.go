package handler

import (
	"net/http"

	"booklog-pile/internal/model"

	"github.com/gin-gonic/gin"
)

// GetMyUser は認証済みユーザーの情報を取得する
func GetMyUser(c *gin.Context) {
	// AuthMiddlewareによってコンテキストにセットされたユーザー情報を取得
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User not found in context"})
		return
	}

	// アサーションして不要な情報（パスワードなど）を隠す
	// ここではUserモデルが `json:"-"` タグを持っているのでそのままでも安全
	me := user.(model.User)

	c.JSON(http.StatusOK, me)
}
