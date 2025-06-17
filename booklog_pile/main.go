package main

import (
	"log"

	"booklog-pile/api"
)

func main() {
	if err := api.Run(); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
