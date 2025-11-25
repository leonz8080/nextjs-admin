package controller

import (
	"nextjs-admin-go/internal/model"

	"golang.org/x/crypto/bcrypt"

	"github.com/gin-gonic/gin"
)

func (bc *BaseController) GetAdmins(c *gin.Context) {
	req, err := BindRequest[struct {
		Name      string `form:"name"`
		PageIndex int64  `form:"pageIndex" binding:"required"`
		PageSize  int64  `form:"pageSize" binding:"required"`
	}](c)
	if err != nil {
		c.JSON(200, gin.H{"result": 400, "message": "Bad request"})
		return
	}

	wheres := map[string]interface{}{}
	if req.Data.Name != "" {
		wheres["name"] = req.Data.Name
	}

	var total int64
	if err = bc.DB.Where(wheres).Find(&model.Admin{}).Count(&total).Error; err != nil {
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	if (req.Data.PageIndex-1)*req.Data.PageSize-total > 0 {
		req.Data.PageIndex = total/req.Data.PageSize + 1
	}

	offset := (req.Data.PageIndex - 1) * req.Data.PageSize
	var list []struct {
		Id      int    `json:"id"`
		Name    string `json:"name"`
		Avatar  string `json:"avatar"`
		Tele    string `json:"tele"`
		Email   string `json:"email"`
		Address string `json:"address"`
	}
	if err := bc.DB.Model(&model.Admin{}).
		Where(wheres).
		Find(&list).
		Limit(int(req.Data.PageSize)).
		Offset(int(offset)).
		Order("id desc").Error; err != nil {
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	c.JSON(200, gin.H{"result": 0, "message": "successful", "data": map[string]interface{}{"total": total, "pageIndex": req.Data.PageIndex, "list": list}})
}

func (bc *BaseController) InsertAdmin(c *gin.Context) {
	req, err := BindRequest[model.AdminForm](c)
	if err != nil {
		c.JSON(200, gin.H{"result": 400, "message": "Bad request"})
		return
	}

	var total int64
	if err = bc.DB.Where("name", req.Data.Name).Find(&model.Admin{}).Count(&total).Error; err != nil {
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	if total > 0 {
		c.JSON(200, gin.H{"result": 1, "message": "name-exists"})
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Data.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	tx := bc.DB.Begin()

	admin := model.Admin{
		Name:     req.Data.Name,
		Avatar:   &req.Data.Avatar,
		Tele:     &req.Data.Tele,
		Email:    &req.Data.Email,
		Address:  &req.Data.Address,
		Password: string(hashed),
	}

	if err := bc.DB.Create(&admin).Error; err != nil {
		tx.Rollback()
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	var roles []model.AdminRole
	for _, item := range req.Data.Roles {
		roles = append(roles, model.AdminRole{
			AdminId: admin.ID,
			RoleId:  item,
		})
	}

	if err := bc.DB.Create(&roles).Error; err != nil {
		tx.Rollback()
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	tx.Commit()

	c.JSON(200, gin.H{"result": 0, "message": "successful"})
}

func (bc *BaseController) UpdateAdmin(c *gin.Context) {
	req, err := BindRequest[model.AdminForm](c)
	if err != nil {
		c.JSON(200, gin.H{"result": 400, "message": "Bad request"})
		return
	}

	if req.Data.Id == 1 {
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	var admin model.Admin
	if err = bc.DB.Where("name", req.Data.Name).First(&admin).Error; err != nil {
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}
	if admin.ID != req.Data.Id {
		c.JSON(200, gin.H{"result": 1, "message": "name-exists"})
	}

	adminTemp := map[string]interface{}{
		"name":    req.Data.Name,
		"avatar":  req.Data.Avatar,
		"email":   req.Data.Email,
		"tele":    req.Data.Tele,
		"address": req.Data.Address,
	}

	if req.Data.Password != "" {
		hashed, err := bcrypt.GenerateFromPassword([]byte(req.Data.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(200, gin.H{"result": 1, "message": "fail"})
			return
		}
		adminTemp["password"] = string(hashed)
	}

	tx := bc.DB.Begin()

	if err := bc.DB.Model(&model.Admin{}).Where("id = ?", req.Data.Id).Updates(adminTemp).Error; err != nil {
		tx.Rollback()
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	if err := bc.DB.Where("admin_id = ?", req.Data.Id).Delete(&model.AdminRole{}).Error; err != nil {
		tx.Rollback()
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	var roles []model.AdminRole
	for _, item := range req.Data.Roles {
		roles = append(roles, model.AdminRole{
			AdminId: admin.ID,
			RoleId:  item,
		})
	}

	if err := bc.DB.Create(&roles).Error; err != nil {
		tx.Rollback()
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	tx.Commit()

	c.JSON(200, gin.H{"result": 0, "message": "successful"})
}

func (bc *BaseController) DeleteAdmin(c *gin.Context) {
	req, err := BindRequest[struct {
		Id uint `form:"id" binding:"required"`
	}](c)
	if err != nil {
		c.JSON(200, gin.H{"result": 400, "message": "Bad request"})
		return
	}

	tx := bc.DB.Begin()

	if err := bc.DB.Where("admin_id = ?", req.Data.Id).Delete(&model.AdminRole{}).Error; err != nil {
		tx.Rollback()
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	if err := bc.DB.Where("id = ?", req.Data.Id).Delete(&model.Admin{}).Error; err != nil {
		tx.Rollback()
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	tx.Commit()

	c.JSON(200, gin.H{"result": 0, "message": "successful"})
}

func (bc *BaseController) GetAdminRole(c *gin.Context) {
	req, err := BindRequest[struct {
		Id uint `form:"id" binding:"required"`
	}](c)
	if err != nil {
		c.JSON(200, gin.H{"result": 400, "message": "Bad request"})
		return
	}

	var list []model.AdminRole
	if err := bc.DB.
		Where("admin_id", req.Data.Id).
		Find(&list).
		Error; err != nil {
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	var roles []uint

	for _, item := range list {
		roles = append(roles, item.RoleId)
	}

	c.JSON(200, gin.H{"result": 0, "message": "successful", "data": map[string]interface{}{"roles": roles}})
}
