package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// AuthMiddleware はダミーの認証ミドルウェア
// 実際の実装ではJWTの検証などを行う
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			c.Abort()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header format must be Bearer {token}"})
			c.Abort()
			return
		}

		// ここでトークン (parts[1]) の検証を行う
		// 今回はダミーなので、トークンが存在すればOKとする
		// 例: token, err := jwt.Parse(...)
		// if err != nil { ... }

		// ユーザー情報をコンテキストにセットして後続のハンドラで使えるようにする
		// c.Set("userId", "user-id-from-token")

		c.Next()
	}
}
