package handler_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"booklog-pile/api"
	"booklog-pile/internal/db"
	"booklog-pile/internal/model"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// setupTestDB はテスト用のインメモリデータベースをセットアップする
func setupTestDB(t *testing.T) {
	var err error
	// インメモリSQLiteを使用し、複数のテスト関数でコネクションを共有可能にする
	db.DB, err = gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	assert.NoError(t, err)

	// 既存のテーブルをクリア
	db.DB.Exec("DROP TABLE IF EXISTS users")
	db.DB.Exec("DROP TABLE IF EXISTS books")
	db.DB.Exec("DROP TABLE IF EXISTS booklog_entries")
	db.DB.Exec("DROP TABLE IF EXISTS reviews")

	// モデルをマイグレーション
	err = db.DB.AutoMigrate(&model.User{}, &model.Book{}, &model.BooklogEntry{}, &model.Review{})
	assert.NoError(t, err)
}

// setupRouter はテスト用のルーターをセットアップする
func setupRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := api.NewRouter()
	return router
}

func TestRegisterUser(t *testing.T) {
	setupTestDB(t)
	router := setupRouter()

	t.Run("正常なユーザー登録", func(t *testing.T) {
		// リクエストボディを作成
		regInfo := model.UserRegistration{
			Username: "testuser",
			Email:    "test@example.com",
			Password: "password123",
		}
		body, _ := json.Marshal(regInfo)

		// リクエストを作成
		req, _ := http.NewRequest(http.MethodPost, "/v1/auth/register", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")

		// レスポンスを記録
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		// アサーション
		assert.Equal(t, http.StatusCreated, w.Code)

		var user model.User
		err := json.Unmarshal(w.Body.Bytes(), &user)
		assert.NoError(t, err)
		assert.Equal(t, regInfo.Username, user.Username)
		assert.Equal(t, regInfo.Email, user.Email)
		assert.Empty(t, user.Password) // パスワードは返されない
	})

	t.Run("重複したメールアドレスでの登録", func(t *testing.T) {
		// 1回目の登録と同じ情報でリクエスト
		regInfo := model.UserRegistration{
			Username: "anotheruser",
			Email:    "test@example.com", // 同じEmail
			Password: "password123",
		}
		body, _ := json.Marshal(regInfo)
		req, _ := http.NewRequest(http.MethodPost, "/v1/auth/register", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		// アサーション
		assert.Equal(t, http.StatusConflict, w.Code)
	})
}

func TestLoginUser(t *testing.T) {
	setupTestDB(t)
	router := setupRouter()

	// テスト用のユーザーを事前に登録
	regInfo := model.UserRegistration{
		Username: "loginuser",
		Email:    "login@example.com",
		Password: "password123",
	}
	regBody, _ := json.Marshal(regInfo)
	req, _ := http.NewRequest(http.MethodPost, "/v1/auth/register", bytes.NewBuffer(regBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusCreated, w.Code)

	t.Run("正常なログイン", func(t *testing.T) {
		loginInfo := model.UserLogin{
			Email:    regInfo.Email,
			Password: regInfo.Password,
		}
		body, _ := json.Marshal(loginInfo)
		req, _ := http.NewRequest(http.MethodPost, "/v1/auth/login", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)

		var res map[string]string
		err := json.Unmarshal(w.Body.Bytes(), &res)
		assert.NoError(t, err)
		assert.Contains(t, res, "accessToken")
		assert.NotEmpty(t, res["accessToken"])
	})

	t.Run("不正なパスワードでのログイン", func(t *testing.T) {
		loginInfo := model.UserLogin{
			Email:    regInfo.Email,
			Password: "wrongpassword",
		}
		body, _ := json.Marshal(loginInfo)
		req, _ := http.NewRequest(http.MethodPost, "/v1/auth/login", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})
}
