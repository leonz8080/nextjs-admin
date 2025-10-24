"use client"

interface PermissionModel {
    key: string,
    name: string
}

export const Permission: PermissionModel[] = [
    {
        key: 'admin',
        name: 'Super Administrator'
    },
    {
        key: 'userAnalysis',
        name: 'User Analysis'
    },
    {
        key: 'salesAnalysis',
        name: 'Sales Analysis'
    },
    {
        key: 'table',
        name: 'Table'
    },
    {
        key: 'images',
        name: 'Images'
    },
    {
        key: 'fileUpload',
        name: 'File Upload'
    },
    {
        key: 'filePreview',
        name: 'File Preview'
    },
    {
        key: 'excel',
        name: 'Excel'
    },
    {
        key: 'adminList',
        name: 'Admin List'
    },
    {
        key: 'adminRoles',
        name: 'Admin Roles'
    },
    {
        key: 'adminRoleSwitching',
        name: 'Admin Role Switching'
    },
    {
        key: 'setting',
        name: 'Setting'
    }
]