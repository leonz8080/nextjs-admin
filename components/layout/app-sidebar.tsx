"use client"

import * as React from "react"
import {
    GalleryVerticalEnd,
} from "lucide-react"
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

import { sidebarMenu } from "@/config/pages"
// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <GalleryVerticalEnd className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-medium">{process.env.NEXT_PUBLIC_SYS_NAME}</span>
                                    <span className="">{process.env.NEXT_PUBLIC_SYS_VERSION}</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {
                    sidebarMenu.map((group, index) => (
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