package db

import (
	"booklog-pile/internal/model"
	"log"
	"os"
	"time"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// InitDB はデータベース接続を初期化し、マイグレーションを実行する
func InitDB() {
	var err error

	// GORMのロガーを設定して、実行されるSQLクエリをコンソールに表示する
	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags),
		logger.Config{
			SlowThreshold:             200 * time.Millisecond,
			LogLevel:                  logger.Info,
			IgnoreRecordNotFoundError: true,
			Colorful:                  true,
		},
	)

	// SQLiteデータベースに接続する
	DB, err = gorm.Open(sqlite.Open("booklog.db"), &gorm.Config{
		Logger: newLogger,
	})
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}

	log.Println("Database connection established.")

	// モデルに基づいてテーブルを自動マイグレーションする
	err = DB.AutoMigrate(
		&model.User{},
		&model.Book{},
		&model.BooklogEntry{},
		&model.Review{},
	)
	if err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}

	log.Println("Database migrated.")
}
