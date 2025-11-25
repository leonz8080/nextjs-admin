package model

type AdminAuth struct {
	ID          uint     `json:"id"`
	Jti         string   `json:"jti"`
	TokenHash   string   `json:"tokenHash"`
	Permissions []string `json:"permissions"`
}

type Request[T any] struct {
	AdminId    uint     `json:"-"`
	Permission []string `json:"-"`
	Data       T        `json:"data" binding:"required"`
}

type Response[T any] struct {
	Code    int
	Message string
	Data    T
}

type AdminForm struct {
	Id       uint   `form:"id"`
	Name     string `form:"name" binding:"required"`
	Avatar   string `form:"avatar" binding:"required"`
	Tele     string `form:"tele" binding:"required"`
	Email    string `form:"email" binding:"required"`
	Address  string `form:"address" binding:"required"`
	Password string `form:"password"`
	Roles    []uint `form:"roles" binding:"required"`
}

type RoleForm struct {
	Id          uint     `form:"id"`
	Name        string   `form:"name" binding:"required"`
	Permissions []string `form:"permissions" binding:"required"`
}

type UserForm struct {
	Name       string `form:"name" binding:"required"`
	Avatar     string `form:"avatar" binding:"required"`
	Level      string `form:"level" binding:"required"`
	Expiration string `form:"expiration" binding:"required"`
	IsValid    uint   `form:"isValid" binding:"required"`
	Remark     string `form:"remark" binding:"required"`
	Status     string `form:"status" binding:"required"`
}

type NoticeForm struct {
	Id       int    `json:"id"`
	Avatar   string `json:"avatar"`
	Title    string `json:"title"`
	Content  string `json:"content"`
	Status   int    `json:"status"`
	CreateAt string `json:"createAtd"`
}
