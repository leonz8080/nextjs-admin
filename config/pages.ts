"use client"

import dynamic from 'next/dynamic'
import { ComponentType } from "react";
import {
    Gauge,
    Table,
    Settings,
    UserRoundCog,
    File,
    Bell,
    Bug,
    UserRoundPen,
    Image,
    type LucideIcon,
} from "lucide-react";

export interface NavModel {
    url: string,
    icon?: LucideIcon | string,
    title: string,
    permissions?: string[],
    hidden?: boolean,
    component?: ComponentType,
    items?: NavModel[],
}

export const firstPageUrl = "/dashboard/user-analysis";

export const sidebarMenu: NavModel[] = [
    {
        title: 'Components',
        url: 'components',
        items: [
            {
                title: 'Dashboard',
                url: '/dashboard',
                icon: Gauge,
                items: [
                    {
                        title: 'User Analysis',
                        url: '/dashboard/user-analysis',
                        component: dynamic(() => import('@/app/main/dashboard/user-analysis/page')),
                        permissions: ['admin', 'userAnalysis'],
                    },
                    {
                        title: 'Sales Analysis',
                        url: '/dashboard/sales-analysis',
                        component: dynamic(() => import('@/app/main/dashboard/sales-analysis/page')),
                        permissions: ['admin', 'salesAnalysis'],
                    },
                ]
            },
            {
                title: 'Table',
                url: '/users',
                icon: Table,
                component: dynamic(() => import('@/app/main/users/page')),
                permissions: ['admin', 'table']
            },
            {
                title: 'Images',
                url: '/images',
                icon: Image,
                component: dynamic(() => import('@/app/main/images/page')),
                permissions: ['admin', 'images']
            },
            {
                title: 'File',
                url: '/file',
                icon: File,
                items: [
                    {
                        title: 'Upload',
                        url: '/file/upload',
                        component: dynamic(() => import('@/app/main/file/upload/page')),
                        permissions: ['admin', 'fileUpload']
                    },
                    {
                        title: 'Preview',
                        url: '/file/preview',
                        component: dynamic(() => import('@/app/main/file/preview/page')),
                        permissions: ['admin', 'filePreview']
                    },
                    {
                        title: 'Excel',
                        url: '/file/excel',
                        component: dynamic(() => import('@/app/main/file/excel/page')),
                        permissions: ['admin', 'excel']
                    }
                ]
            }
        ]
    },
    {
        title: 'Pages',
        url: 'pages',
        items: [
            {
                title: 'Administrator',
                url: 'administrator',
                icon: UserRoundCog,
                items: [
                    {
                        title: 'List',
                        url: '/admin/list',
                        component: dynamic(() => import('@/app/main/admin/list/page')),
                        permissions: ['admin', 'adminList']
                    },
                    {
                        title: 'Roles',
                        url: '/admin/roles',
                        component: dynamic(() => import('@/app/main/admin/roles/page')),
                        permissions: ['admin', 'adminRoles']
                    },
                    {
                        title: 'Role Switching',
                        url: '/admin/role-switching',
                        component: dynamic(() => import('@/app/main/admin/role-switching/page')),
                        permissions: ['admin', 'adminRoleSwitching']
                    }
                ]
            },
            {
                title: 'Setting',
                url: '/setting',
                icon: Settings,
                component: dynamic(() => import('@/app/main/setting/page')),
                permissions: ['admin', 'setting']
            },
            {
                title: 'Error Page',
                url: 'errorPage',
                icon: Bug,
                items: [
                    {
                        title: '403',
                        url: '/error-page/p403',
                        component: dynamic(() => import('@/app/main/error-page/p403/page')),
                        permissions: ['admin', 'errorPage403']
                    },
                    {
                        title: '404',
                        url: '/error-page/p404',
                        component: dynamic(() => import('@/app/main/error-page/p404/page')),
                        permissions: ['admin', 'errorPage404']
                    }
                ]
            }
        ]
    }
];

export const notice: NavModel = {
    title: 'Notice',
    icon: Bell,
    url: '/notice',
    component: dynamic(() => import('@/app/main/admin/profile/page')),
}

export const profile: NavModel = {
    title: 'Profile',
    icon: UserRoundPen,
    url: '/profile',
    component: dynamic(() => import('@/app/main/admin/profile/page')),
}