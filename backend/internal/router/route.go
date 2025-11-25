package router

import (
	"nextjs-admin-go/internal/controller"
	"nextjs-admin-go/internal/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, bc *controller.BaseController) {
	api := r.Group("/api")
	api.POST("/login", bc.Login)
	api.POST("/getDefaultLanguage", bc.GetDefaultLanguage)

	api.Use(middleware.AuthRequired(bc.DB))
	{
		api.POST("/checkToken", bc.CheckToken)
		api.POST("/logout", bc.Logout)
		api.POST("/updatePassword", bc.UpdatePassword)
		api.POST("/getAdmin", bc.GetAdmin)
		api.POST("/updateAdminBySelf", bc.UpdateAdminBySelf)
		api.POST("/getGoogleAuthQr", middleware.PermissionMiddleware([]string{"admin", ""}, bc.DB), bc.GetGoogleAuthQr)
		api.POST("/verifyGoogleAuth", bc.VerifyGoogleAuth)
		api.POST("/resetGoogleAuthQr", bc.ResetGoogleAuthQr)
		api.POST("/cancelGoogleAuth", bc.CancelGoogleAuth)

		api.POST("/upload", bc.Upload)
		api.POST("/getNotices", bc.GetNotices)
		api.POST("/getNewNotices", bc.GetNewNotices)
		api.POST("/getSysInfo", bc.GetSysInfo)
		api.POST("/getAllConfig", bc.GetAllConfig)
		api.POST("/updateConfig", bc.UpdateConfig)

		api.POST("/getUsers", bc.GetUsers)
		api.POST("/insertUser", bc.InsertUser)
		api.POST("/updateUser", bc.UpdateUser)
		api.POST("/deleteUsers", bc.DeleteUser)
		api.POST("/exportUsers", bc.ExportUsers)

		api.POST("/getRoles", bc.GetRoles)
		api.POST("/insertRole", bc.InsertRole)
		api.POST("/updateRole", bc.UpdateRole)
		api.POST("/deleteRole", bc.DeleteRole)
		api.POST("/getRolePermission", bc.GetRolePermission)
		api.POST("/getAllRoles", bc.GetAllRoles)

		api.POST("/getAdmins", bc.GetAdmins)
		api.POST("/insertAdmin", bc.InsertAdmin)
		api.POST("/updateAdmin", bc.UpdateAdmin)
		api.POST("/deleteAdmin", bc.DeleteAdmin)
		api.POST("/getAdminRole", bc.GetAdminRole)

		api.POST("/easyQuery", bc.EasyQuery)
	}
}
