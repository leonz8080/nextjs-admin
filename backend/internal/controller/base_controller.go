package controller

import (
	"nextjs-admin-go/internal/model"

	"github.com/allegro/bigcache/v3"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

type BaseController struct {
	DB          *gorm.DB
	ConfigCache *bigcache.BigCache
}

func BindRequest[T any](c *gin.Context) (*model.Request[T], error) {
	var req model.Request[T]

	if err := c.ShouldBindJSON(&req); err != nil {
		return nil, err
	}

	if v, ok := c.Get("adminId"); ok {
		if id, ok := v.(uint); ok {
			req.AdminId = id
		}
	}
	if v, ok := c.Get("permission"); ok {
		if p, ok := v.([]string); ok {
			req.Permission = p
		}
	}

	validate := validator.New()
	if err := validate.Struct(req.Data); err != nil {
		return nil, err
	}

	return &req, nil
}
