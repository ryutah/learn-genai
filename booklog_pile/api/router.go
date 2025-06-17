package api

import (
	"booklog-pile/api/middleware"
	"booklog-pile/internal/handler"

	"github.com/gin-gonic/gin"
)

// NewRouter は新しいginルーターをセットアップして返す
func NewRouter() *gin.Engine {
	router := gin.Default()

	// APIのバージョンプレフィックス
	v1 := router.Group("/v1")
	{
		// 認証
		auth := v1.Group("/auth")
		{
			auth.POST("/register", handler.RegisterUser)
			auth.POST("/login", handler.LoginUser)
		}

		// 書籍検索 (認証不要)
		v1.GET("/books/search", handler.SearchBooks)

		// 感想一覧 (認証不要)
		v1.GET("/booklog/:booklogId/reviews", handler.GetReviews)

		// 認証が必要なエンドポイント
		authRequired := v1.Group("/")
		authRequired.Use(middleware.AuthMiddleware())
		{
			// ユーザー情報
			authRequired.GET("/users/me", handler.GetMyUser)

			// 蔵書 (積読リスト)
			booklog := authRequired.Group("/booklog")
			{
				booklog.GET("", handler.GetMyBooklog)
				booklog.POST("", handler.AddBookToBooklog)
				booklog.PATCH("/:booklogId", handler.UpdateBooklogStatus)
				booklog.DELETE("/:booklogId", handler.DeleteBooklogEntry)
			}

			// 感想投稿
			authRequired.POST("/booklog/:booklogId/reviews", handler.PostReview)

			// "同志" マッチング
			authRequired.GET("/comrades/search", handler.SearchComrades)

			// 読書ログ
			authRequired.GET("/stats/me", handler.GetMyStats)
		}
	}

	return router
}
