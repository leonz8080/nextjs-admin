"use client"

interface PermissionModel {
    id: string,
    name: string
}

export const Permission: PermissionModel[] = [
    {
        id: 'admin',
        name: 'super-admin'
    },
    {
        id: 'userAnalysis',
        name: 'user-analysis'
    },
    {
        id: 'salesAnalysis',
        name: 'sales-analysis'
    },
    {
        id: 'table',
        name: 'table'
    },
    {
        id: 'adminList',
        name: 'admin-list'
    },
    {
        id: 'adminRoles',
        name: 'admin-roles'
    },
    {
        id: 'adminRoleSwitching',
        name: 'role-switching'
    },
    {
        id: 'setting',
        name: 'setting'
    }
]