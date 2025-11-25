package controller

import (
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"

	"nextjs-admin-go/internal/cache"
	"nextjs-admin-go/internal/model"
)

func (bc *BaseController) Upload(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(200, gin.H{"result": 400, "message": "Bad request"})
		return
	}

	adminIdUint := c.GetUint("adminId")
	adminIdStr := strconv.FormatUint(uint64(adminIdUint), 10)

	catalog := c.PostForm("catalog")
	path := filepath.Join(os.Getenv("PUBLIC_PATH"), "uploads", catalog, adminIdStr)
	if _, err := os.Stat(path); os.IsNotExist(err) {
		err = os.MkdirAll(path, os.ModePerm)
		if err != nil {
			c.JSON(200, gin.H{"result": 1, "message": "fail"})
			return
		}
	}

	var fileName = strconv.FormatInt((time.Now().UnixMilli()), 10) + filepath.Ext(file.Filename)
	c.SaveUploadedFile(file, path+"/"+fileName)

	url := "/uploads/" + catalog + "/" + adminIdStr + "/" + fileName
	c.JSON(200, gin.H{"result": 0, "message": "successful", "data": map[string]interface{}{"url": url}})
}

func (bc *BaseController) GetNotices(c *gin.Context) {
	req, err := BindRequest[struct {
		PageIndex int64 `form:"pageIndex" binding:"required"`
		PageSize  int64 `form:"pageSize" binding:"required"`
	}](c)
	if err != nil {
		c.JSON(200, gin.H{"result": 400, "message": "Bad request"})
		return
	}

	var total int64
	if err = bc.DB.Where("send_to in (?)", []uint{0, uint(req.AdminId)}).Find(&model.Notices{}).Count(&total).Error; err != nil {
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	if (req.Data.PageIndex-1)*req.Data.PageSize-total > 0 {
		req.Data.PageIndex = total/req.Data.PageSize + 1
	}

	offset := (req.Data.PageIndex - 1) * req.Data.PageSize
	var list []model.NoticeForm
	if err := bc.DB.Model(&model.Notices{}).
		Where("send_to in (?)", []uint{0, uint(req.AdminId)}).
		Find(&list).
		Limit(int(req.Data.PageSize)).
		Offset(int(offset)).
		Order("id desc").Error; err != nil {
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	c.JSON(200, gin.H{"result": 0, "message": "successful", "data": map[string]interface{}{"total": total, "pageIndex": req.Data.PageIndex, "list": list}})
}

func (bc *BaseController) GetNewNotices(c *gin.Context) {
	req, err := BindRequest[struct{}](c)

	if err != nil {
		c.JSON(200, gin.H{"result": 400, "message": "Bad request"})
		return
	}

	var list []model.NoticeForm
	if err := bc.DB.Model(&model.Notices{}).
		Where("send_to in (?)", []uint{0, uint(req.AdminId)}).
		Find(&list).
		Limit(3).
		Order("id desc").Error; err != nil {
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	c.JSON(200, gin.H{"result": 0, "message": "successful", "data": map[string]interface{}{"list": list}})
}

func (bc *BaseController) GetSysInfo(c *gin.Context) {
	c.JSON(200,
		gin.H{"result": 0,
			"message": "successful",
			"data": map[string]interface{}{
				"name":    cache.GetConfigString("sysName", ""),
				"logo":    cache.GetConfigString("sysLogo", ""),
				"version": cache.GetConfigString("sysVersion", ""),
			}})
}

func (bc *BaseController) GetAllConfig(c *gin.Context) {
	c.JSON(200,
		gin.H{"result": 0,
			"message": "successful",
			"data": map[string]interface{}{
				"ipWhitelist":       cache.GetConfigString("ipWhitelist", ""),
				"tokenExpiration":   cache.GetConfigString("tokenExpiration", ""),
				"sysServerTimeZone": cache.GetConfigString("sysServerTimeZone", ""),
				"imageLimit":        cache.GetConfigString("imageLimit", ""),
				"sysName":           cache.GetConfigString("sysName", ""),
				"sysLogo":           cache.GetConfigString("sysLogo", ""),
				"sysVersion":        cache.GetConfigString("sysVersion", ""),
				"sysLanguage":       cache.GetConfigString("sysLanguage", ""),
				"compressImage":     cache.GetConfigString("compressImage", ""),
			}})
}

func (bc *BaseController) UpdateConfig(c *gin.Context) {
	req, err := BindRequest[map[string]interface{}](c)

	if err != nil {
		c.JSON(200, gin.H{"result": 400, "message": "Bad request"})
		return
	}

	updates := map[string]interface{}{}
	for key, value := range req.Data {
		updates[key] = value
	}

	if err := bc.DB.Model(&model.Config{}).Updates(updates).Error; err != nil {
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	c.JSON(200, gin.H{"result": 0, "message": "successful"})
}

func (bc *BaseController) GetDefaultLanguage(c *gin.Context) {
	c.JSON(200,
		gin.H{"result": 0,
			"message": "successful",
			"data": map[string]interface{}{
				"sysLanguage": cache.GetConfigString("sysLanguage", ""),
			}})
}
