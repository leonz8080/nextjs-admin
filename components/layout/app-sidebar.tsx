"use client"

import * as React from "react"
import { useEffect, useState } from 'react'
import { SidebarGroupExt } from "@/components/layout/sidebar-ext"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton
} from "@/components/ui/sidebar"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import Link from "next/link";

import { userPermissionsStore } from "@/hooks/use-global-store"
import { NavModel, sidebarMenu } from "@/config/pages"
import { request } from "@/lib/client/utils"
// This is sample data.

interface SysInfoModel {
    name: string;
    logo: string;
    version: string;
}

function filterPermissions(navs: NavModel[], permissions: string[]): NavModel[] {
    var res: NavModel[] = [];

    for (var i = 0; i < navs.length; i++) {
        if (!navs[i].permissions || navs[i].permissions?.some(item => permissions.includes(item))) {
            res.push({
                url: navs[i].url,
                title: navs[i].title,
                icon: navs[i].icon,
                permissions: navs[i].permissions,
                hidden: navs[i].hidden,
                component: navs[i].component,
                items: filterPermissions(navs[i].items ?? [], permissions),
            });
        }
    }

    return res;
}

function filterNull(navs: NavModel[]): NavModel[] {
    var res: NavModel[] = [];

    for (var i = 0; i < navs.length; i++) {
        if (navs[i].component) {
            res.push({
                url: navs[i].url,
                icon: navs[i].icon,
                title: navs[i].title,
                permissions: navs[i].permissions,
                hidden: navs[i].hidden,
                component: navs[i].component
            });
        }
        if ((navs[i].items?.length ?? 0) > 0) {
            var items = filterNull(navs[i].items ?? []);
            if (items.length > 0) {
                res.push({
                    url: navs[i].url,
                    icon: navs[i].icon,
                    title: navs[i].title,
                    permissions: navs[i].permissions,
                    hidden: navs[i].hidden,
                    component: navs[i].component,
                    items: items,
                });
            }
        }
    }

    return res;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { permissions } = userPermissionsStore();
    const [sysInfo, setSysInfo] = useState<SysInfoModel>({ name: "", logo: "", version: "" });
    const [menu, setMenu] = useState<NavModel[]>([]);

    async function getSysInfo() {
        var res = await request('getSysInfo', {});
        if (res.result === 0 && res.data) {
            setSysInfo({
                name: res.data.name,
                logo: res.data.logo,
                version: res.data.version
            });
        }
        console.log(sysInfo)
    }

    useEffect(() => {
        var temp = filterPermissions(sidebarMenu, permissions);
        temp = filterNull(temp);
        setMenu(temp)
    }, [permissions]);

    useEffect(() => {
        getSysInfo();
    }, []);

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <Avatar className="rounded-full">
                                        <AvatarImage src={sysInfo.logo} />
                                        <AvatarFallback>
                                            NA
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-medium">{sysInfo.name}</span>
                                    <span className="mt-1">{sysInfo.version}</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {
                    menu.map((group, index) => (
                        <SidebarGroupExt key={index} group={group} />
                    ))
                }
            </SidebarContent>
            <SidebarFooter>
                {/*<NavUser user={data.user} />*/}
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}