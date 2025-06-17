package api

import "log"

// Run はHTTPサーバーを起動する
func Run() error {
	router := NewRouter()
	log.Println("Starting server on http://localhost:3000")
	// 開発環境サーバーのURL http://localhost:3000/v1 に合わせる
	return router.Run(":3000")
}
