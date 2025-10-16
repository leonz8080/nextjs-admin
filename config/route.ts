interface RouteModel {
    ts: () => Promise<any>,
    fun: string,
    permissions: string[]
}

export const routes: Map<string, RouteModel> = new Map([
    ['login', { ts: () => import("@/app/api/auth"), fun: "login", permissions: [] }],
    ["logout", { ts: () => import("@/app/api/auth"), fun: "logout", permissions: [] }],
    ["checkToken", { ts: () => import("@/app/api/auth"), fun: "checkToken", permissions: [] }],
    ["updatePassword", { ts: () => import("@/app/api/auth"), fun: "updatePassword", permissions: [] }],

    ['getUsers', { ts: () => import("@/app/api/users"), fun: "get", permissions: [] }],
    ["updateUsers", { ts: () => import("@/app/api/users"), fun: "update", permissions: [] }],
    ["deleteUsers", { ts: () => import("@/app/api/users"), fun: "del", permissions: [] }],
    ["exportUsers", { ts: () => import("@/app/api/users"), fun: "exp", permissions: [] }],

    ['getRoles', { ts: () => import("@/app/api/roles"), fun: "get", permissions: [] }],
    ["updateRole", { ts: () => import("@/app/api/roles"), fun: "update", permissions: [] }],
    ["deleteRole", { ts: () => import("@/app/api/roles"), fun: "del", permissions: [] }],
    ["insertRole", { ts: () => import("@/app/api/roles"), fun: "insert", permissions: [] }],
    ["getRolePermission", { ts: () => import("@/app/api/roles"), fun: "getRolePermission", permissions: [] }],
    ["getAllRoles", { ts: () => import("@/app/api/roles"), fun: "getAll", permissions: [] }],

    ['getAdmins', { ts: () => import("@/app/api/admin"), fun: "get", permissions: [] }],
    ["updateAdmin", { ts: () => import("@/app/api/admin"), fun: "update", permissions: [] }],
    ["deleteAdmin", { ts: () => import("@/app/api/admin"), fun: "del", permissions: [] }],
    ["insertAdmin", { ts: () => import("@/app/api/admin"), fun: "insert", permissions: [] }],
    ["getAdminRole", { ts: () => import("@/app/api/admin"), fun: "getAdminRole", permissions: [] }],
    
    ["upload", { ts: () => import("@/app/api/common"), fun: "upload", permissions: [] }],
    ["getNotices", { ts: () => import("@/app/api/common"), fun: "getNotices", permissions: [] }],
    ["getNewNotices", { ts: () => import("@/app/api/common"), fun: "getNewNotices", permissions: [] }],
]);