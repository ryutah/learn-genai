package handler_test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"booklog-pile/internal/model"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

// createUserAndLogin はテストユーザーを作成し、ログインしてトークンを返すヘルパー
func createUserAndLogin(t *testing.T, router *gin.Engine, username, email, password string) (uint, string) {
	// ユーザー登録
	regInfo := model.UserRegistration{Username: username, Email: email, Password: password}
	regBody, _ := json.Marshal(regInfo)
	req, _ := http.NewRequest(http.MethodPost, "/v1/auth/register", bytes.NewBuffer(regBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusCreated, w.Code)

	var user model.User
	json.Unmarshal(w.Body.Bytes(), &user)

	// ログイン
	loginInfo := model.UserLogin{Email: email, Password: password}
	loginBody, _ := json.Marshal(loginInfo)
	req, _ = http.NewRequest(http.MethodPost, "/v1/auth/login", bytes.NewBuffer(loginBody))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)

	var res map[string]string
	json.Unmarshal(w.Body.Bytes(), &res)
	return user.ID, res["accessToken"]
}

func TestBooklogHappyPath(t *testing.T) {
	setupTestDB(t)
	router := setupRouter()
	_, token := createUserAndLogin(t, router, "bookloguser", "booklog@example.com", "password123")

	var createdEntry model.BooklogEntry

	// 1. 蔵書に本を追加
	t.Run("蔵書に本を追加", func(t *testing.T) {
		addReqBody, _ := json.Marshal(gin.H{"isbn": "978-4-04-102616-8"})
		req, _ := http.NewRequest(http.MethodPost, "/v1/booklog", bytes.NewBuffer(addReqBody))
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", "Bearer "+token)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusCreated, w.Code)
		err := json.Unmarshal(w.Body.Bytes(), &createdEntry)
		assert.NoError(t, err)
		assert.Equal(t, "978-4-04-102616-8", createdEntry.Book.ISBN)
		assert.Equal(t, model.StatusTsundoku, createdEntry.Status)
	})

	// 2. 蔵書リストを取得
	t.Run("蔵書リストを取得", func(t *testing.T) {
		req, _ := http.NewRequest(http.MethodGet, "/v1/booklog", nil)
		req.Header.Set("Authorization", "Bearer "+token)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		var entries []model.BooklogEntry
		err := json.Unmarshal(w.Body.Bytes(), &entries)
		assert.NoError(t, err)
		assert.Len(t, entries, 1)
		assert.Equal(t, createdEntry.ID, entries[0].ID)
	})

	// 3. 蔵書のステータスを更新
	t.Run("蔵書のステータスを更新", func(t *testing.T) {
		updateReqBody, _ := json.Marshal(gin.H{"status": model.StatusRead})
		url := fmt.Sprintf("/v1/booklog/%d", createdEntry.ID)
		req, _ := http.NewRequest(http.MethodPatch, url, bytes.NewBuffer(updateReqBody))
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", "Bearer "+token)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		var updatedEntry model.BooklogEntry
		err := json.Unmarshal(w.Body.Bytes(), &updatedEntry)
		assert.NoError(t, err)
		assert.Equal(t, model.StatusRead, updatedEntry.Status)
	})

	// 4. 蔵書を削除
	t.Run("蔵書を削除", func(t *testing.T) {
		url := fmt.Sprintf("/v1/booklog/%d", createdEntry.ID)
		req, _ := http.NewRequest(http.MethodDelete, url, nil)
		req.Header.Set("Authorization", "Bearer "+token)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusNoContent, w.Code)

		// 削除されたことを確認
		getReq, _ := http.NewRequest(http.MethodGet, "/v1/booklog", nil)
		getReq.Header.Set("Authorization", "Bearer "+token)
		getW := httptest.NewRecorder()
		router.ServeHTTP(getW, getReq)
		assert.Equal(t, http.StatusOK, getW.Code)
		var entries []model.BooklogEntry
		json.Unmarshal(getW.Body.Bytes(), &entries)
		assert.Len(t, entries, 0)
	})
}

func TestBooklogAuthErrors(t *testing.T) {
	setupTestDB(t)
	router := setupRouter()

	t.Run("認証トークンなしでAPIアクセス", func(t *testing.T) {
		req, _ := http.NewRequest(http.MethodGet, "/v1/booklog", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)
		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})
}
