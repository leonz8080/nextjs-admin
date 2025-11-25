package main

import (
	"nextjs-admin-go/internal/cache"
	"nextjs-admin-go/internal/config"
	"nextjs-admin-go/internal/controller"
	"nextjs-admin-go/internal/model"
	"nextjs-admin-go/internal/router"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"log"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found")
	}

	cfg := config.LoadConfig()

	db := config.InitDB()
	db.AutoMigrate(
		&model.Admin{},
		&model.AdminRole{},
		&model.ChannelAddUp{},
		&model.Config{},
		&model.MonthAddUp{},
		&model.Notices{},
		&model.RolePermission{},
		&model.Roles{},
		&model.Users{},
	)

	cache.InitCache(db)

	bc := &controller.BaseController{
		DB:          db,
		ConfigCache: cache.ConfigCache,
	}

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	router.RegisterRoutes(r, bc)

	r.Run(cfg.ServerAddress)
}
