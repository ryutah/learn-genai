package main

import (
	"booklog-pile/api"
	"booklog-pile/internal/db"
	"log"
)

func main() {
	// データベースを初期化
	db.InitDB()

	// サーバーを起動
	if err := api.Run(); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
