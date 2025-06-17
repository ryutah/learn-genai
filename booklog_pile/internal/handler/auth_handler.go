package handler

import (
	"booklog-pile/internal/model"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// RegisterUser は新規ユーザーを登録する
func RegisterUser(c *gin.Context) {
	var req model.UserRegistration
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 本来はここでデータベースにユーザーを保存する
	// emailの重複チェックなども行う

	newUser := model.User{
		ID:        uuid.NewString(),
		Username:  req.Username,
		Email:     req.Email,
		CreatedAt: time.Now(),
	}

	c.JSON(http.StatusCreated, newUser)
}

// LoginUser はユーザーをログインさせる
func LoginUser(c *gin.Context) {
	var req model.UserLogin
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 本来はここでデータベースのユーザー情報と照合する
	// if email not found or password mismatch {
	// 	c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
	// 	return
	// }

	// 認証成功後、JWTを生成する
	accessToken := "dummy-jwt-access-token-for-" + req.Email

	c.JSON(http.StatusOK, gin.H{
		"accessToken": accessToken,
	})
}
