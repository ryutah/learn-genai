package handler

import (
	"booklog-pile/internal/db"
	"booklog-pile/internal/model"
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// RegisterUser は新規ユーザーを登録する
func RegisterUser(c *gin.Context) {
	var req model.UserRegistration
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// パスワードをハッシュ化
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// 新規ユーザーオブジェクトを作成
	newUser := model.User{
		Username: req.Username,
		Email:    req.Email,
		Password: string(hashedPassword),
	}

	// データベースにユーザーを保存
	result := db.DB.Create(&newUser)
	if result.Error != nil {
		// emailやusernameの重複エラーなどをハンドリング
		c.JSON(http.StatusConflict, gin.H{"error": "Email or username already exists"})
		return
	}

	// パスワードフィールドを隠してレスポンスを返す
	newUser.Password = ""
	c.JSON(http.StatusCreated, newUser)
}

// LoginUser はユーザーをログインさせる
func LoginUser(c *gin.Context) {
	var req model.UserLogin
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// emailを元にデータベースからユーザーを検索
	var user model.User
	if err := db.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// パスワードを検証
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// 認証成功後、ダミーのJWTを生成する
	// 本番環境では、標準的なJWTライブラリを使用すること
	accessToken := "dummy-jwt-access-token-for-user-" + strconv.FormatUint(uint64(user.ID), 10)

	c.JSON(http.StatusOK, gin.H{
		"accessToken": accessToken,
	})
}
