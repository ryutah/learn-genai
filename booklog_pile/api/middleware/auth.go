package middleware

import (
	"booklog-pile/internal/db"
	"booklog-pile/internal/model"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

// AuthMiddleware はJWTの検証（今回はダミー）を行い、ユーザー情報をコンテキストにセットする
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

		token := parts[1]

		// ダミートークンからユーザーIDを抽出する
		// 実際のアプリケーションでは、ここでJWTライブラリを使ってトークンを検証・デコードする
		if !strings.HasPrefix(token, "dummy-jwt-access-token-for-user-") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}
		userIdStr := strings.TrimPrefix(token, "dummy-jwt-access-token-for-user-")
		userId, err := strconv.ParseUint(userIdStr, 10, 64)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID in token"})
			c.Abort()
			return
		}

		// ユーザーがデータベースに存在するか確認
		var user model.User
		if err := db.DB.First(&user, uint(userId)).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			c.Abort()
			return
		}

		// ユーザー情報をコンテキストにセットして後続のハンドラで使えるようにする
		c.Set("userId", user.ID)
		c.Set("user", user) // ユーザーオブジェクト全体もセットしておくと便利

		c.Next()
	}
}
