package model

type Admin struct {
	ID           uint    `gorm:"primaryKey" json:"id"`
	Name         string  `json:"name"`
	Password     string  `json:"pasword"`
	Avatar       *string `json:"avatar"`
	Email        *string `json:"email"`
	Tele         *string `json:"tele"`
	Address      *string `json:"address"`
	Jti          *string `json:"jti"`
	TokenHash    *string `json:"tokenHash"`
	GoogleSecret *string `json:"googleSecret"`
	IsBindGoogle uint    `gorm:"default:0" json:"isBindGoogle"`
}

type Roles struct {
	ID   uint   `gorm:"primaryKey" json:"id"`
	Name string `json:"name"`
}

type AdminRole struct {
	ID      uint `gorm:"primaryKey" json:"id"`
	AdminId uint `json:"name"`
	RoleId  uint `json:"pasword"`
}

type RolePermission struct {
	ID         uint   `gorm:"primaryKey" json:"id"`
	RoleId     uint   `json:"roleId"`
	Permission string `json:"permission"`
}

type Users struct {
	ID         uint    `gorm:"primaryKey" json:"id"`
	Name       string  `json:"name"`
	Avatar     string  `json:"avatar"`
	Level      string  `json:"level"`
	Expiration string  `json:"expiration"`
	IsValid    uint    `json:"isValid"`
	Remark     *string `json:"remark"`
	Status     *string `json:"status"`
}

type Notices struct {
	ID       uint   `gorm:"primaryKey" json:"id"`
	SendTo   uint   `json:"sendTo"`
	Avatar   string `json:"avatar"`
	Title    string `json:"title"`
	Content  string `json:"content"`
	Status   uint   `json:"status"`
	CreateAt string `json:"createAt"`
}

type Config struct {
	ID    uint   `gorm:"primaryKey" json:"id"`
	Name  string `json:"name"`
	Value string `json:"value"`
}

type MonthAddUp struct {
	ID         uint   `gorm:"primaryKey" json:"id"`
	Month      string `json:"month"`
	NewUser    uint   `json:"newUser"`
	RetainUser uint   `json:"retainUser"`
	ReturnRate uint   `json:"returnRate"`
	Sales      uint   `json:"sales"`
	VipSales   uint   `json:"vipSales"`
}

type ChannelAddUp struct {
	ID      uint   `gorm:"primaryKey" json:"id"`
	Month   string `json:"month"`
	Channel uint   `json:"channel"`
	NewUser uint   `json:"newUser"`
}
