package middleware

import (
	"crypto/sha256"
	"encoding/hex"

	"nextjs-admin-go/internal/cache"
	"nextjs-admin-go/internal/pkg"
	"nextjs-admin-go/internal/pkg/jwt"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AuthRequired(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		token, err := c.Cookie("token")
		if err != nil {
			c.JSON(200, gin.H{"result": 401, "message": "Unauthorized"})
			c.Abort()
			return
		}

		claims, err := jwt.ParseToken(token)
		if err != nil {
			c.JSON(200, gin.H{"result": 401, "message": "Unauthorized"})
			c.Abort()
			return
		}

		admin, err := cache.GetAdmin(claims.AdminId, db)
		if err != nil {
			c.JSON(200, gin.H{"result": 401, "message": "Unauthorized"})
			c.Abort()
			return
		}

		if admin.Jti != claims.ID {
			c.JSON(200, gin.H{"result": 401, "message": "Unauthorized"})
			c.Abort()
			return
		}

		hash := sha256.Sum256([]byte(token))
		hashToken := hex.EncodeToString(hash[:])
		if admin.TokenHash != hashToken {
			c.JSON(200, gin.H{"result": 401, "message": "Unauthorized"})
			c.Abort()
			return
		}

		c.Set("adminId", claims.AdminId)
		c.Set("permission", admin.Permissions)

		c.Next()
	}
}

func PermissionMiddleware(requiredPerm []string, db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		value, exists := c.Get("adminId")
		if !exists {
			c.AbortWithStatusJSON(401, gin.H{"error": "adminId not found"})
			return
		}

		adminId, ok := value.(uint)
		if !ok {
			c.AbortWithStatusJSON(400, gin.H{"error": "invalid adminId"})
			return
		}

		admin, _ := cache.GetAdmin(adminId, db)
		if !pkg.HasIntersection(requiredPerm, admin.Permissions) {
			c.AbortWithStatusJSON(403, gin.H{"error": "forbidden"})
			return
		}
		c.Next()
	}
}
