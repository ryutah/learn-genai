package handler

import (
	"net/http"

	"booklog-pile/internal/model"

	"github.com/gin-gonic/gin"
)

// GetMyStats は自分の読書ログを取得する
func GetMyStats(c *gin.Context) {
	// 本来は認証済みユーザーの読書履歴をDBから集計する
	mockStats := model.ReadingStats{
		MonthlyReadCount: 5,
		MonthlyPageCount: 1500,
		History: []struct {
			Month string `json:"month"`
			Count int    `json:"count"`
		}{
			{Month: "2025-03", Count: 4},
			{Month: "2025-04", Count: 8},
			{Month: "2025-05", Count: 5},
		},
	}

	c.JSON(http.StatusOK, mockStats)
}
