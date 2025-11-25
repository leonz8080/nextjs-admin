package cache

import (
	"context"
	"encoding/json"
	"log"
	"strconv"
	"time"

	"github.com/allegro/bigcache/v3"
	"gorm.io/gorm"

	"nextjs-admin-go/internal/model"
)

var ConfigCache *bigcache.BigCache
var AdminCache *bigcache.BigCache

func InitCache(db *gorm.DB) {
	ctx := context.Background()
	config := bigcache.Config{
		Shards:           512,
		LifeWindow:       100 * 365 * 24 * time.Hour,
		CleanWindow:      0,
		HardMaxCacheSize: 64,
	}

	var err error
	ConfigCache, err = bigcache.New(ctx, config)
	if err != nil {
		log.Fatalf("failed to init config cache: %v", err)
	}

	preloadConfig(db)

	AdminCache, err = bigcache.New(ctx, config)
	if err != nil {
		log.Fatalf("failed to init config cache: %v", err)
	}
}

func preloadConfig(db *gorm.DB) {
	var confs []model.Config
	if err := db.Find(&confs).Error; err != nil {
		log.Printf("failed to preload configs: %v", err)
		return
	}

	for _, conf := range confs {
		ConfigCache.Set(conf.Name, []byte(conf.Value))
	}
}

func GetAdmin(adminId uint, db *gorm.DB) (*model.AdminAuth, error) {
	key := strconv.FormatUint(uint64(adminId), 10)

	data, err := AdminCache.Get(key)
	if err == nil {
		var admin model.AdminAuth
		if jsonErr := json.Unmarshal(data, &admin); jsonErr != nil {
			return nil, jsonErr
		}

		return &admin, nil
	}

	var admin model.Admin
	if dbErr := db.First(&admin, adminId).Error; dbErr != nil {
		return nil, dbErr
	}

	var permissions []string
	if admin.ID == 1 {
		permissions = []string{"admin"}
	} else {
		db.Raw("SELECT b.permission FROM AdminRole a, RolePermission b WHERE a.roleId = b.roleId and a.adminId = ?", adminId).Scan(&permissions)
	}

	authInfo := model.AdminAuth{
		ID:          admin.ID,
		Jti:         *admin.Jti,
		TokenHash:   *admin.TokenHash,
		Permissions: permissions,
	}

	if jsonData, jsonErr := json.Marshal(authInfo); jsonErr == nil {
		_ = AdminCache.Set(key, jsonData)
	}

	return &authInfo, nil
}

func GetConfigString(key string, def string) string {
	val, err := ConfigCache.Get(key)
	if err != nil {
		return def
	}
	return string(val)
}
