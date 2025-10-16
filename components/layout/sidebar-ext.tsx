"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import { useTabsStore } from "@/hooks/use-global-store";

import { NavModel } from "@/config/pages"

import { NavA } from "@/components/common/nav-wrap";

export function SidebarGroupExt({ group }: { group: NavModel }) {
    let i = 0;
    return (
        <SidebarGroup>
            {group.title ? <SidebarGroupLabel>{group.title}</SidebarGroupLabel> : null}
            <SidebarMenu>
                {
                    group.items && group.items.map((item) => {
                        i++;
                        if (!item.items)
                            return <Menu key={i} item={item} />
                        return <MenuCollapsible key={i} item={item} />
                    })
                }
            </SidebarMenu>
        </SidebarGroup>
    )
}

export function Menu({
    item,
}: {
    item: NavModel
}) {
    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                tooltip={item.title}
            >
                <NavA navKey={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                </NavA>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}


export function MenuCollapsible({
    item,
}: {
    item: NavModel
}) {
    const { tabs, activeKey, addTab, setActive, removeTab } = useTabsStore();
    return (
        <Collapsible
            key={item.title}
            asChild
            className="group/collapsible"
        >
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        {<span>{item.title}</span>}
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {
                            item.items?.map((subItem) => {
                                if (!subItem.items)
                                    return (
                                        <SidebarMenuSubItem key={subItem.title}>
                                            <SidebarMenuSubButton asChild>
                                                <NavA navKey={subItem.url}>
                                                    {subItem.icon && <subItem.icon />}
                                                    <span>{subItem.title}</span>
                                                </NavA>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    )
                                else
                                    return (
                                        <MenuCollapsible key={subItem.title} item={item} />
                                    )
                            })
                        }
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    )
}
