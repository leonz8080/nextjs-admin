package controller

import (
	"fmt"
	"log"
	"nextjs-admin-go/internal/model"
	"nextjs-admin-go/internal/pkg"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/xuri/excelize/v2"
)

func (bc *BaseController) GetUsers(c *gin.Context) {
	req, err := BindRequest[struct {
		Level     string `form:"level"`
		Name      string `form:"name"`
		PageIndex int64  `form:"pageIndex" binding:"required"`
		PageSize  int64  `form:"pageSize" binding:"required"`
	}](c)
	if err != nil {
		c.JSON(200, gin.H{"result": 400, "message": "Bad request"})
		return
	}

	wheres := map[string]interface{}{}
	if req.Data.Level != "" {
		wheres["level"] = req.Data.Level
	}
	if req.Data.Name != "" {
		wheres["name"] = req.Data.Name
	}

	var total int64
	if err = bc.DB.Where(wheres).Find(&model.Users{}).Count(&total).Error; err != nil {
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	if (req.Data.PageIndex-1)*req.Data.PageSize-total > 0 {
		req.Data.PageIndex = total/req.Data.PageSize + 1
	}

	offset := (req.Data.PageIndex - 1) * req.Data.PageSize
	var list []model.Users
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

func (bc *BaseController) InsertUser(c *gin.Context) {
	req, err := BindRequest[model.UserForm](c)
	if err != nil {
		c.JSON(200, gin.H{"result": 400, "message": "Bad request"})
		return
	}

	var total int64
	if err = bc.DB.Where("name", req.Data.Name).Find(&model.Users{}).Count(&total).Error; err != nil {
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	if total > 0 {
		c.JSON(200, gin.H{"result": 1, "message": "name-exists"})
	}

	if err := bc.DB.Create(&req.Data).Error; err != nil {
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
	}

	c.JSON(200, gin.H{"result": 0, "message": "successful"})
}

func (bc *BaseController) UpdateUser(c *gin.Context) {
	req, err := BindRequest[struct {
		Id     uint   `form:"id" binding:"required"`
		Value  string `form:"value" binding:"required"`
		Column string `form:"column" binding:"required"`
	}](c)
	if err != nil {
		c.JSON(200, gin.H{"result": 400, "message": "Bad request"})
		return
	}

	if req.Data.Column == "name" {
		var user model.Users
		if err = bc.DB.Where("name", req.Data.Column).First(&user).Error; err != nil {
			c.JSON(200, gin.H{"result": 1, "message": "fail"})
			return
		}
		if user.ID != req.Data.Id {
			c.JSON(200, gin.H{"result": 1, "message": "name-exists"})
		}
	}

	bc.DB.Model(&model.Users{}).Where("id = ?", req.Data.Id).Updates(map[string]interface{}{req.Data.Column: req.Data.Value})

	c.JSON(200, gin.H{"result": 0, "message": "successful"})
}

func (bc *BaseController) DeleteUser(c *gin.Context) {
	req, err := BindRequest[struct {
		Id []uint `form:"id" binding:"required"`
	}](c)
	if err != nil {
		c.JSON(200, gin.H{"result": 400, "message": "Bad request"})
		return
	}

	bc.DB.Where("id in (?)", req.Data.Id).Delete(model.Users{})

	c.JSON(200, gin.H{"result": 0, "message": "successful"})
}

func (bc *BaseController) ExportUsers(c *gin.Context) {
	req, err := BindRequest[struct {
		Level string `form:"level"`
		Name  string `form:"name"`
	}](c)

	if err != nil {
		c.JSON(200, gin.H{"result": 400, "message": "Bad request"})
		return
	}

	wheres := map[string]interface{}{}
	if req.Data.Level != "" {
		wheres["level"] = req.Data.Level
	}
	if req.Data.Name != "" {
		wheres["name"] = req.Data.Name
	}

	var list []model.Users
	if err := bc.DB.
		Where(wheres).
		Find(&list).
		Order("id desc").Error; err != nil {
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

	f := excelize.NewFile()

	sheet := "Users"
	f.SetSheetName("Sheet1", sheet)

	f.SetCellValue(sheet, "A1", "Avatar")
	f.SetCellValue(sheet, "B1", "Name")
	f.SetCellValue(sheet, "C1", "Level")
	f.SetCellValue(sheet, "D1", "Expiration")
	f.SetCellValue(sheet, "E1", "IsValid")
	f.SetCellValue(sheet, "F1", "Remark")
	f.SetCellValue(sheet, "G1", "Status")

	for i, v := range list {
		row := i + 2

		f.SetColWidth(sheet, "A", "A", 10)
		f.SetRowHeight(sheet, row, 80)
		imagePath := filepath.Join(os.Getenv("PUBLIC_PATH"), v.Avatar)

		pngBytes, err := pkg.ConvertToPngBytes(imagePath)
		if err != nil {
			log.Println(err)
			c.JSON(200, gin.H{"result": 1, "message": "fail"})
			return
		}

		err = f.AddPictureFromBytes(
			sheet,
			fmt.Sprintf("A%d", row),
			&excelize.Picture{
				Extension: ".png",
				File:      pngBytes,
				Format: &excelize.GraphicOptions{
					AltText: "Avatar",
					AutoFit: true,
				},
			},
		)
		if err != nil {
			log.Println(err)
			c.JSON(200, gin.H{"result": 1, "message": "fail"})
			return
		}

		f.SetCellValue(sheet, fmt.Sprintf("B%d", row), v.Name)
		f.SetCellValue(sheet, fmt.Sprintf("C%d", row), v.Level)
		f.SetCellValue(sheet, fmt.Sprintf("D%d", row), v.Expiration)
		f.SetCellValue(sheet, fmt.Sprintf("E%d", row), v.IsValid)
		f.SetCellValue(sheet, fmt.Sprintf("F%d", row), v.Remark)
		f.SetCellValue(sheet, fmt.Sprintf("G%d", row), v.Status)
	}

	c.Header("Content-Type", "application/octet-stream")
	c.Header("Content-Disposition", "attachment; filename=users.xlsx")
	c.Header("Content-Transfer-Encoding", "binary")

	err = f.Write(c.Writer)
	if err != nil {
		log.Println("Write err")
		c.JSON(200, gin.H{"result": 1, "message": "fail"})
		return
	}

}
