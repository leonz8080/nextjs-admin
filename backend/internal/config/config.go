package config

import (
	"log"
	"os"
	"path/filepath"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

type Config struct {
	ServerAddress string
	Port          string
}

func LoadConfig() *Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	return &Config{
		ServerAddress: ":" + port,
		Port:          port,
	}
}

func InitDB() *gorm.DB {
	dbDir := "data"
	if _, err := os.Stat(dbDir); os.IsNotExist(err) {
		err := os.Mkdir(dbDir, 0755)
		if err != nil {
			log.Fatal("failed to create data directory:", err)
		}
	}

	dbPath := filepath.Join(dbDir, "demo.db")

	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database:", err)
	}

	return db
}
