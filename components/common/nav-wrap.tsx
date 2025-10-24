"use client"

import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { navMapStore } from "@/hooks/use-global-store"
import { breadcrumbStateStore, useTabsStore } from "@/hooks/use-global-store";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { CommandItem } from "@/components/ui/command"

interface NavAProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    navKey: string
}

export const NavA = forwardRef<HTMLAnchorElement, NavAProps>(
    ({ navKey, className, children, ...props }, ref) => {
        const { navMap } = navMapStore();
        const nav = navMap.get(navKey);

        if (!nav) {
            return (
                <a href="#" ref={ref} className={className} {...props}>{children}</a>
            )
        }

        return (
            <a href="#" ref={ref} className={className} {...props} onClick={(e) => {
                e.preventDefault();
                const { tabs, addTab, setActive } = useTabsStore.getState();
                const exists = tabs.some((t) => t.key === nav.url);
                if (exists)
                    setActive(nav.url);
                else {
                    var Component = nav.component
                    addTab({
                        key: nav.url,
                        title: nav.title,
                        permissions: nav.permissions,
                        component: <Component />,
                    });
                }

                //const setBreadcrumb = breadcrumbStateStore.getState().setBreadcrumb;
                //setBreadcrumb(nav.titles);
            }}>
                {children}
            </a>
        )
    }
)

interface NavDropdownMenuProps extends React.ComponentPropsWithoutRef<typeof DropdownMenuItem> {
    navKey: string;
}

export const NavDropdownMenu = forwardRef<HTMLDivElement, NavDropdownMenuProps>(
    ({ navKey, className, children, ...props }, ref) => {
        const { navMap } = navMapStore();
        const nav = navMap.get(navKey);

        if (!nav) {
            return (
                <DropdownMenuItem key={navKey} ref={ref} className={className} {...props}>
                    {children}
                </DropdownMenuItem>
            )
        }

        return (
            <DropdownMenuItem key={navKey} ref={ref} className={className} {...props} onClick={(e) => {
                e.preventDefault();
                const { tabs, addTab, setActive } = useTabsStore.getState();
                const exists = tabs.some((t) => t.key === nav.url);
                if (exists)
                    setActive(nav.url);
                else {
                    var Component = nav.component
                    addTab({
                        key: nav.url,
                        title: nav.title,
                        permissions: nav.permissions,
                        component: <Component />,
                    });
                }

                //const setBreadcrumb = breadcrumbStateStore.getState().setBreadcrumb;
                //setBreadcrumb(nav.titles);
            }}>
                {children}
            </DropdownMenuItem>
        )
    }
)

interface NavCommandProps extends React.ComponentPropsWithoutRef<typeof CommandItem> {
    navKey: string;
    onClose: () => void;
}

export const NavCommand = forwardRef<HTMLDivElement, NavCommandProps>(
    ({ navKey, onClose = () => {}, className, children, ...props }, ref) => {
        const { navMap } = navMapStore();
        const nav = navMap.get(navKey);
        
        if (!nav) {
            return (
                <CommandItem>{children}</CommandItem>
            )
        }
        
        return (
            <CommandItem ref={ref} className={className} {...props} onSelect={() => {
                const { tabs, addTab, setActive } = useTabsStore.getState();
                const exists = tabs.some((t) => t.key === nav.url);
                if (exists)
                    setActive(nav.url);
                else {
                    var Component = nav.component
                    addTab({
                        key: nav.url,
                        title: nav.title,
                        permissions: nav.permissions,
                        component: <Component />,
                    });
                }
                onClose();
            }}>
                {children}
            </CommandItem>
        )
    }
)