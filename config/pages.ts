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
        title: 'examples',
        url: 'examples',
        items: [
            {
                title: 'dashboard',
                url: '/dashboard',
                icon: Gauge,
                items: [
                    {
                        title: 'user-analysis',
                        url: '/dashboard/user-analysis',
                        component: dynamic(() => import('@/app/main/dashboard/user-analysis/page')),
                        permissions: ['admin', 'userAnalysis'],
                    },
                    {
                        title: 'sales-analysis',
                        url: '/dashboard/sales-analysis',
                        component: dynamic(() => import('@/app/main/dashboard/sales-analysis/page')),
                        permissions: ['admin', 'salesAnalysis'],
                    },
                ]
            },
            {
                title: 'table',
                url: '/users',
                icon: Table,
                component: dynamic(() => import('@/app/main/users/page')),
                permissions: ['admin', 'table']
            },
        ]
    },
    {
        title: 'pages',
        url: 'pages',
        items: [
            {
                title: 'administrator',
                url: 'administrator',
                icon: UserRoundCog,
                items: [
                    {
                        title: 'list',
                        url: '/admin/list',
                        component: dynamic(() => import('@/app/main/admin/list/page')),
                        permissions: ['admin', 'adminList']
                    },
                    {
                        title: 'roles',
                        url: '/admin/roles',
                        component: dynamic(() => import('@/app/main/admin/roles/page')),
                        permissions: ['admin', 'adminRoles']
                    },
                    {
                        title: 'role-switching',
                        url: '/admin/role-switching',
                        component: dynamic(() => import('@/app/main/admin/role-switching/page')),
                        permissions: ['admin', 'adminRoleSwitching']
                    }
                ]
            },
            {
                title: 'setting',
                url: '/setting',
                icon: Settings,
                component: dynamic(() => import('@/app/main/setting/page')),
                permissions: ['admin', 'setting']
            },
            {
                title: 'error-page',
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
    title: 'notice',
    icon: Bell,
    url: '/notice',
    component: dynamic(() => import('@/app/main/notices/page')),
}

export const profile: NavModel = {
    title: 'profile',
    icon: UserRoundPen,
    url: '/profile',
    component: dynamic(() => import('@/app/main/admin/profile/page')),
}