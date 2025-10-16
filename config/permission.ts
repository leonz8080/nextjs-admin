"use client"

interface PermissionModel {
    key: string,
    name: string
}

export const Permission: PermissionModel[] = [
    {
        key: 'admin',
        name: 'Admin'
    },
    {
        key: 'adminMng',
        name: 'Administrator'
    },
    {
        key: 'role',
        name: 'Role'
    },
    {
        key: 'dashboard',
        name: 'Dashboard'
    }
]