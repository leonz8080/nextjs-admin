package controller

import (
	"nextjs-admin-go/internal/model"

	"github.com/gin-gonic/gin"
)

func (bc *BaseController) GetRoles(c *gin.Context) {
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
	if err = bc.DB.Where(wheres).Find(&model.Roles{}).Count(&total).Error; err != nil {
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	if (req.Data.PageIndex-1)*req.Data.PageSize-total > 0 {
		req.Data.PageIndex = total/req.Data.PageSize + 1
	}

	offset := (req.Data.PageIndex - 1) * req.Data.PageSize
	var list []model.Roles
	if err := bc.DB.
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

func (bc *BaseController) InsertRole(c *gin.Context) {
	req, err := BindRequest[model.RoleForm](c)
	if err != nil {
		c.JSON(200, gin.H{"result": 400, "message": "Bad request"})
		return
	}

	var total int64
	if err = bc.DB.Where("name", req.Data.Name).Find(&model.Roles{}).Count(&total).Error; err != nil {
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	if total > 0 {
		c.JSON(200, gin.H{"result": 1, "message": "name-exists"})
	}

	tx := bc.DB.Begin()

	role := model.Roles{
		Name: req.Data.Name,
	}

	if err := bc.DB.Create(&role).Error; err != nil {
		tx.Rollback()
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	var permissions []model.RolePermission
	for _, item := range req.Data.Permissions {
		permissions = append(permissions, model.RolePermission{
			RoleId:     role.ID,
			Permission: item,
		})
	}

	if err := bc.DB.Create(&permissions).Error; err != nil {
		tx.Rollback()
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	tx.Commit()

	c.JSON(200, gin.H{"result": 0, "message": "successful"})
}

func (bc *BaseController) UpdateRole(c *gin.Context) {
	req, err := BindRequest[model.RoleForm](c)
	if err != nil {
		c.JSON(200, gin.H{"result": 400, "message": "Bad request"})
		return
	}

	var role model.Roles
	if err = bc.DB.Where("name", req.Data.Name).First(&role).Error; err != nil {
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}
	if role.ID != req.Data.Id {
		c.JSON(200, gin.H{"result": 1, "message": "name-exists"})
	}

	tx := bc.DB.Begin()

	if err := bc.DB.Model(&model.Roles{}).Where("id = ?", req.Data.Id).Update("name", req.Data.Name).Error; err != nil {
		tx.Rollback()
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	if err := bc.DB.Where("role_id = ?", req.Data.Id).Delete(&model.RolePermission{}).Error; err != nil {
		tx.Rollback()
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	var permissions []model.RolePermission
	for _, item := range req.Data.Permissions {
		permissions = append(permissions, model.RolePermission{
			RoleId:     req.Data.Id,
			Permission: item,
		})
	}

	if err := bc.DB.Create(&permissions).Error; err != nil {
		tx.Rollback()
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	tx.Commit()

	c.JSON(200, gin.H{"result": 0, "message": "successful"})
}

func (bc *BaseController) DeleteRole(c *gin.Context) {
	req, err := BindRequest[struct {
		Id uint `form:"id" binding:"required"`
	}](c)
	if err != nil {
		c.JSON(200, gin.H{"result": 400, "message": "Bad request"})
		return
	}

	tx := bc.DB.Begin()

	if err := bc.DB.Where("role_id = ?", req.Data.Id).Delete(&model.AdminRole{}).Error; err != nil {
		tx.Rollback()
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	if err := bc.DB.Where("role_id = ?", req.Data.Id).Delete(&model.RolePermission{}).Error; err != nil {
		tx.Rollback()
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	if err := bc.DB.Where("id = ?", req.Data.Id).Delete(&model.Roles{}).Error; err != nil {
		tx.Rollback()
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	tx.Commit()

	c.JSON(200, gin.H{"result": 0, "message": "successful"})
}

func (bc *BaseController) GetRolePermission(c *gin.Context) {
	req, err := BindRequest[struct {
		Id uint `form:"id" binding:"required"`
	}](c)
	if err != nil {
		c.JSON(200, gin.H{"result": 400, "message": "Bad request"})
		return
	}

	var list []model.RolePermission
	if err := bc.DB.
		Where("role_id", req.Data.Id).
		Find(&list).
		Error; err != nil {
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	var permissions []string

	for _, item := range list {
		permissions = append(permissions, item.Permission)
	}

	c.JSON(200, gin.H{"result": 0, "message": "successful", "data": map[string]interface{}{"permissions": permissions}})
}

func (bc *BaseController) GetAllRoles(c *gin.Context) {
	var list []model.Roles
	if err := bc.DB.
		Find(&list).
		Error; err != nil {
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	c.JSON(200, gin.H{"result": 0, "message": "successful", "data": map[string]interface{}{"list": list}})
}
