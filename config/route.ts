interface RouteModel {
    ts: () => Promise<any>,
    fun: string,
    permissions?: string[]
}

export const routes: Map<string, RouteModel> = new Map([
    ['login', { ts: () => import("@/app/api/auth"), fun: "login" }],
    ["logout", { ts: () => import("@/app/api/auth"), fun: "logout" }],
    ["checkToken", { ts: () => import("@/app/api/auth"), fun: "checkToken" }],
    ["updatePassword", { ts: () => import("@/app/api/auth"), fun: "updatePassword" }],
    ["getAdmin", { ts: () => import("@/app/api/auth"), fun: "getAdmin" }],
    ["updateAdminBySelf", { ts: () => import("@/app/api/auth"), fun: "updateAdminBySelf" }],
    ["getGoogleAuthQr", { ts: () => import("@/app/api/auth"), fun: "getGoogleAuthQr" }],
    ["verifyGoogleAuth", { ts: () => import("@/app/api/auth"), fun: "verifyGoogleAuth" }],
    ["resetGoogleAuthQr", { ts: () => import("@/app/api/auth"), fun: "resetGoogleAuthQr" }],
    ["cancelGoogleAuth", { ts: () => import("@/app/api/auth"), fun: "cancelGoogleAuth" }],

    ['getUsers', { ts: () => import("@/app/api/users"), fun: "get", permissions: ['admin', 'table'] }],
    ["insertUser", { ts: () => import("@/app/api/users"), fun: "insert", permissions: ['admin', 'table'] }],
    ["updateUser", { ts: () => import("@/app/api/users"), fun: "update", permissions: ['admin', 'table'] }],
    ["deleteUsers", { ts: () => import("@/app/api/users"), fun: "del", permissions: ['admin', 'table'] }],
    ["exportUsers", { ts: () => import("@/app/api/users"), fun: "exp", permissions: ['admin', 'table'] }],

    ['getRoles', { ts: () => import("@/app/api/roles"), fun: "get", permissions: ['admin', 'adminRoles'] }],
    ["updateRole", { ts: () => import("@/app/api/roles"), fun: "update", permissions: ['admin', 'adminRoles'] }],
    ["deleteRole", { ts: () => import("@/app/api/roles"), fun: "del", permissions: ['admin', 'adminRoles'] }],
    ["insertRole", { ts: () => import("@/app/api/roles"), fun: "insert", permissions: ['admin', 'adminRoles'] }],
    ["getRolePermission", { ts: () => import("@/app/api/roles"), fun: "getRolePermission", permissions: ['admin', 'adminRoles'] }],
    ["getAllRoles", { ts: () => import("@/app/api/roles"), fun: "getAll", permissions: ['admin', 'adminRoles', 'adminList'] }],

    ['getAdmins', { ts: () => import("@/app/api/admin"), fun: "get", permissions: ['admin', 'adminList'] }],
    ["updateAdmin", { ts: () => import("@/app/api/admin"), fun: "update", permissions: ['admin', 'adminList'] }],
    ["deleteAdmin", { ts: () => import("@/app/api/admin"), fun: "del", permissions: ['admin', 'adminList'] }],
    ["insertAdmin", { ts: () => import("@/app/api/admin"), fun: "insert", permissions: ['admin', 'adminList'] }],
    ["getAdminRole", { ts: () => import("@/app/api/admin"), fun: "getAdminRole", permissions: ['admin', 'adminList'] }],

    ["upload", { ts: () => import("@/app/api/common"), fun: "upload" }],
    ["getNotices", { ts: () => import("@/app/api/common"), fun: "getNotices" }],
    ["getNewNotices", { ts: () => import("@/app/api/common"), fun: "getNewNotices" }],
    ["getSysInfo", { ts: () => import("@/app/api/common"), fun: "getSysInfo" }],
    ["getAllConfig", { ts: () => import("@/app/api/common"), fun: "getAllConfig" }],
    ["updateConfig", { ts: () => import("@/app/api/common"), fun: "updateConfig" }],
    ["getDefaultLanguage", { ts: () => import("@/app/api/common"), fun: "getDefaultLanguage" }],

    ["easyQuery", { ts: () => import("@/app/api/easy-query"), fun: "query" }],
]);