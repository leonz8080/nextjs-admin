"use client"

import dynamic from 'next/dynamic'
import { ComponentType } from "react";
import {
    Gauge,
    Table,
    Settings,
    UserRoundCog,
    ChartColumnIncreasing,
    Puzzle,
    File,
    Bell,
    Bug,
    UserRoundPen,
    KeyRound,
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

export const sidebarMenu: NavModel[] = [
    {
        title: 'Components',
        url: 'components',
        items: [
            {
                title: 'Dashboard',
                url: '/dashboard',
                icon: Gauge,
                component: dynamic(() => import('@/app/main/dashboard/page')),
                permissions: ['admin', 'dashboard']
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
                permissions: ['admin', 'image']
            },
            {
                title: 'File',
                url: 'file',
                icon: File,
                items: [
                    {
                        title: 'Upload',
                        url: '/file/upload',
                        permissions: ['admin', 'file-upload']
                    },
                    {
                        title: 'Preview',
                        url: '/file/preview',
                        permissions: ['admin', 'file-preview']
                    },
                    {
                        title: 'Excel',
                        url: '/file/excel',
                        permissions: ['admin', 'file-export']
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
                        permissions: ['admin', 'admin-list']
                    },
                    {
                        title: 'Roles',
                        url: '/admin/roles',
                        component: dynamic(() => import('@/app/main/admin/roles/page')),
                        permissions: ['admin', 'admin-roles']
                    },
                    {
                        title: 'Role Switching',
                        url: '/admin/role-switching',
                        permissions: ['admin', 'admin-role-switching']
                    }
                ]
            },
            {
                title: 'Notice',
                url: '/notice',
                icon: Bell,
                component: dynamic(() => import('@/app/main/notices/page')),
                permissions: ['admin', 'notice']
            },
            {
                title: 'Setting',
                url: '/setting',
                icon: Settings,
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
                        permissions: ['admin', 'error-page-403']
                    },
                    {
                        title: '404',
                        url: '/error-page/p404',
                        permissions: ['admin', 'error-page-404']
                    },
                    {
                        title: '500',
                        url: '/error-page/p500',
                        permissions: ['admin', 'error-page-500']
                    }
                ]
            }
        ]
    }
];

export const profile: NavModel = {
    title: 'Profile',
    icon: UserRoundPen,
    url: '/admin/profile',
    component: dynamic(() => import('@/app/main/admin/profile/page')),
}