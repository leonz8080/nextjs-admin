package controller

import (
	"encoding/base64"
	"encoding/binary"
	"encoding/json"
	"fmt"
	"nextjs-admin-go/internal/cache"
	"nextjs-admin-go/internal/model"
	"nextjs-admin-go/internal/pkg"
	"nextjs-admin-go/internal/pkg/jwt"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/pquerna/otp"
	"github.com/pquerna/otp/totp"
	"github.com/skip2/go-qrcode"
	"golang.org/x/crypto/bcrypt"
)

func (bc *BaseController) Login(c *gin.Context) {
	req, err := BindRequest[struct {
		Name          string `form:"name" binding:"required,min=1"`
		Password      string `form:"password" binding:"required,min=6"`
		GoogleCAPTCHA string `form:"password" binding:"omitempty,len=6"`
	}](c)

	if err != nil {
		c.JSON(200, gin.H{"result": 400, "message": "Bad request"})
		return
	}

	var admin model.Admin
	if err := bc.DB.Where("name = ?", req.Data.Name).First(&admin).Error; err != nil {
		c.JSON(200, gin.H{"result": 1, "message": "error-username-password"})
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(admin.Password), []byte(req.Data.Password))
	if err != nil {
		c.JSON(200, gin.H{"result": 1, "message": "error-username-password"})
		return
	}

	if admin.IsBindGoogle == 1 && (admin.GoogleSecret == nil || *admin.GoogleSecret == "") {
		valid := totp.Validate(req.Data.GoogleCAPTCHA, *admin.GoogleSecret)
		if !valid {
			c.JSON(200, gin.H{"result": 1, "message": "error-google-CAPTCHA"})
			return
		}
	}

	exp, err := cache.ConfigCache.Get("tokenExpiration")
	if err != nil {
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	var expUint uint16
	if len(exp) >= 2 {
		expUint = binary.BigEndian.Uint16(exp)
	} else if len(exp) == 1 {
		expUint = uint16(exp[0])
	} else {
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}
	signedToken, hashToken, jti, err := jwt.GenerateToken(admin.ID, expUint)
	if err != nil {
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}
	bc.DB.Model(&admin).Updates(model.Admin{Jti: &jti, TokenHash: &hashToken})

	var permissions []string

	if admin.Name == "admin" {
		permissions = []string{"admin"}
	} else {
		bc.DB.Raw("SELECT b.permission FROM AdminRole a, RolePermission b WHERE a.roleId = b.roleId and a.adminId = ?", admin.ID).Scan(&permissions)
	}

	authInfo := model.AdminAuth{
		ID:          admin.ID,
		Jti:         jti,
		TokenHash:   hashToken,
		Permissions: permissions,
	}

	if jsonData, jsonErr := json.Marshal(authInfo); jsonErr == nil {
		_ = cache.AdminCache.Set(strconv.FormatUint(uint64(admin.ID), 10), jsonData)
	}

	c.SetCookie(
		"token",
		signedToken,
		int(expUint)*60,
		"/",
		"localhost",
		os.Getenv("HTTPS_IS_REQUIRED") == "true",
		true,
	)

	c.JSON(200, gin.H{"result": 0, "message": "successful", "data": map[string]interface{}{"name": admin.Name, "avatar": admin.Avatar, "permissions": permissions}})
}

func (bc *BaseController) Logout(c *gin.Context) {
	req, err := BindRequest[struct{}](c)

	if err != nil {
		c.JSON(200, gin.H{"result": 400, "message": "Bad request"})
		return
	}

	bc.DB.Model(&model.Admin{}).
		Where("id = ?", req.AdminId).
		Updates(map[string]interface{}{
			"jti":       "",
			"tokenHash": "",
		})

	c.SetCookie(
		"token",
		"",
		0,
		"/",
		"",
		os.Getenv("HTTPS_IS_REQUIRED") == "true",
		true,
	)

	c.JSON(200, gin.H{"result": 0, "message": "successful"})
}

func (bc *BaseController) CheckToken(c *gin.Context) {
	c.JSON(200, gin.H{"result": 0, "message": "successful"})
}

func (bc *BaseController) UpdatePassword(c *gin.Context) {
	req, err := BindRequest[struct {
		Password  string `form:"password" binding:"required,min=6"`
		Password1 string `form:"password1" binding:"required,min=6"`
	}](c)

	if err != nil {
		c.JSON(200, gin.H{"result": 400, "message": "Bad request"})
		return
	}

	var admin model.Admin
	if err := bc.DB.Where("id = ?", req.AdminId).First(&admin).Error; err != nil {
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(admin.Password), []byte(req.Data.Password))
	if err != nil {
		c.JSON(200, gin.H{"result": 1, "message": "error-username-password"})
		return
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Data.Password1), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}
	bc.DB.Model(&admin).Updates(model.Admin{Password: string(hashed)})

	c.JSON(200, gin.H{"result": 0, "message": "successful"})
}

func (bc *BaseController) GetAdmin(c *gin.Context) {
	req, err := BindRequest[struct{}](c)

	if err != nil {
		c.JSON(200, gin.H{"result": 400, "message": "Bad request"})
		return
	}

	var admin model.Admin
	if err := bc.DB.Where("id = ?", req.AdminId).First(&admin).Error; err != nil {
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	c.JSON(200, gin.H{"result": 0, "message": "successful", "data": map[string]interface{}{"name": admin.Name, "avatar": admin.Avatar, "email": admin.Email, "tele": admin.Tele, "address": admin.Address}})
}

func (bc *BaseController) UpdateAdminBySelf(c *gin.Context) {
	req, err := BindRequest[struct {
		Avatar  string `form:"avatar" binding:"required,min=1"`
		Email   string `form:"email" binding:"required,email"`
		Tele    string `form:"tele" binding:"required,min=1"`
		Address string `form:"address"`
	}](c)

	if err != nil {
		c.JSON(200, gin.H{"result": 400, "message": "Bad request"})
		return
	}

	avatar := ""
	if strings.HasPrefix(req.Data.Avatar, "data:image/png;base64") {
		var fileName = strconv.FormatInt((time.Now().UnixMilli()), 10) + ".png"
		var path = filepath.Join(os.Getenv("PUBLIC_PATH"), "uploads", "admin", strconv.FormatUint(uint64(req.AdminId), 10))
		if _, err := os.Stat(path); os.IsNotExist(err) {
			err = os.MkdirAll(path, os.ModePerm)
			if err != nil {
				c.JSON(200, gin.H{"result": 1, "message": "fail"})
				return
			}
		}
		path = filepath.Join(path, fileName)
		err := pkg.SaveBase64Image(req.Data.Avatar, path)
		if err != nil {
			c.JSON(200, gin.H{"result": 1, "message": "fail"})
			return
		}
		avatar = "/uploads/admin/" + fileName
	} else {
		avatar = req.Data.Avatar
	}

	bc.DB.Model(&model.Admin{}).
		Where("id = ?", req.AdminId).
		Updates(map[string]interface{}{
			"avatar":  avatar,
			"email":   req.Data.Email,
			"tele":    req.Data.Tele,
			"address": req.Data.Address,
		})

	c.JSON(200, gin.H{"result": 0, "message": "successful"})
}

func (bc *BaseController) GetGoogleAuthQr(c *gin.Context) {
	req, err := BindRequest[struct{}](c)

	if err != nil {
		c.JSON(200, gin.H{"result": 400, "message": "Bad request"})
		return
	}

	var admin model.Admin
	if err := bc.DB.Where("id = ?", req.AdminId).First(&admin).Error; err != nil {
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	if admin.IsBindGoogle == 1 {
		c.JSON(200, gin.H{"result": 0, "message": "successful", "data": map[string]interface{}{"binded": 1, "url": ""}})
		return
	}

	var key *otp.Key

	if admin.GoogleSecret == nil || *admin.GoogleSecret == "" {
		key, err = totp.Generate(totp.GenerateOpts{
			Issuer:      "/leonz8080/nextjs-admin",
			AccountName: admin.Name,
		})
		if err != nil {
			c.JSON(200, gin.H{"result": 1, "message": "fail"})
			return
		}

		secret := key.Secret()
		bc.DB.Model(&admin).Updates(model.Admin{GoogleSecret: &secret})
	} else {
		secret := *admin.GoogleSecret

		key, err = otp.NewKeyFromURL(
			fmt.Sprintf("otpauth://totp/%s:%s?secret=%s&issuer=%s",
				"/leonz8080/nextjs-admin",
				admin.Name,
				secret,
				"/leonz8080/nextjs-admin",
			),
		)
		if err != nil {
			c.JSON(200, gin.H{"result": 1, "message": "fail"})
			return
		}
	}

	png, _ := qrcode.Encode(key.URL(), qrcode.Medium, 256)
	qrBase64 := "data:image/png;base64," + base64.StdEncoding.EncodeToString(png)

	c.JSON(200, gin.H{"result": 0, "message": "successful", "data": map[string]interface{}{"binded": 0, "url": qrBase64}})
}

func (bc *BaseController) ResetGoogleAuthQr(c *gin.Context) {
	req, err := BindRequest[struct{}](c)

	if err != nil {
		c.JSON(200, gin.H{"result": 400, "message": "Bad request"})
		return
	}

	var admin model.Admin
	if err := bc.DB.Where("name = ?", req.AdminId).First(&admin).Error; err != nil {
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	key, err := totp.Generate(totp.GenerateOpts{
		Issuer:      "/leonz8080/nextjs-admin",
		AccountName: admin.Name,
	})
	if err != nil {
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	secret := key.Secret()
	bc.DB.Model(&admin).Updates(model.Admin{GoogleSecret: &secret})

	png, _ := qrcode.Encode(key.URL(), qrcode.Medium, 256)
	qrBase64 := "data:image/png;base64," + base64.StdEncoding.EncodeToString(png)

	c.JSON(200, gin.H{"result": 0, "message": "successful", "data": map[string]interface{}{"binded": 0, "url": qrBase64}})
}

func (bc *BaseController) VerifyGoogleAuth(c *gin.Context) {
	req, err := BindRequest[struct {
		Code string `form:"code" binding:"required,len=6"`
	}](c)

	if err != nil {
		c.JSON(200, gin.H{"result": 400, "message": "Bad request"})
		return
	}

	var admin model.Admin
	if err := bc.DB.Where("name = ?", req.AdminId).First(&admin).Error; err != nil {
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	if !totp.Validate(req.Data.Code, *admin.GoogleSecret) {
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	bc.DB.Model(&admin).Updates(model.Admin{IsBindGoogle: 1})

	c.JSON(200, gin.H{"result": 0, "message": "successful"})
}

func (bc *BaseController) CancelGoogleAuth(c *gin.Context) {
	req, err := BindRequest[struct {
		Code string `form:"code" binding:"required,len=6"`
	}](c)

	if err != nil {
		c.JSON(200, gin.H{"result": 400, "message": "Bad request"})
		return
	}

	bc.DB.Model(&model.Admin{}).
		Where("id = ?", req.AdminId).
		Updates(map[string]interface{}{
			"isBindGoogle": 0,
			"googleSecret": "",
		})

	c.JSON(200, gin.H{"result": 0, "message": "successful"})
}
