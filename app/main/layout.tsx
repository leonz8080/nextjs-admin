"use client"

import { useEffect } from "react";

import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { AppSidebar } from "@/components/app/app-sidebar"
import { AppNavbar } from "@/components/app/app-navbar"
import { BreadcrumbExt } from "@/components/app/breadcrumb-ext"
import { AppSearchBar } from "@/components/app/app-searchbar"

import { useIsMobile } from "@/hooks/use-mobile"
import { useTabsStore, navMapStore, breadcrumbStateStore } from "@/hooks/use-global-store"
import { firstPageUrl } from "@/config/pages"

import { Language } from "./language";
import { AdminMenu } from "./admin-menu";
import { Notice } from "./notice";
import { Theme } from "./theme";

import { useTranslations } from 'next-intl';

export default function Layout({ children }: { children: React.ReactNode }) {
  const t = useTranslations();

  const { tabs, activeKey, setActive, removeTab, addTab } = useTabsStore();
  const { navMap } = navMapStore();

  useEffect(() => {
    if (tabs.length == 0) {
      const firstPage = navMap.get(firstPageUrl);

      if (firstPage) {
        const Component = firstPage.component
        addTab({
          key: firstPage.url,
          title: firstPage.title,
          permissions: firstPage.permissions,
          component: <Component />,
        });

        //const setBreadcrumb = breadcrumbStateStore.getState().setBreadcrumb;
        //setBreadcrumb(home.titles);
      }
    }

    if (activeKey) {
      const titles = navMap.get(activeKey)?.titles
      const setBreadcrumb = breadcrumbStateStore.getState().setBreadcrumb;
      if (titles)
        setBreadcrumb(titles);
    }
  }, [activeKey]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <div className="hidden lg:block">
              {useIsMobile() ? null : <BreadcrumbExt />}
            </div>
          </div>
          <div className="flex items-center gap-2 space-x-3 mr-4">
            {useIsMobile() ? null : <AppSearchBar />}
            <Notice />
            <Theme />
            <Language />
            <AdminMenu />
          </div>
          <div className="absolute right-4 top-0 flex h-16 items-center">
            {/* Placeholder to keep the header height */}
          </div>
        </header>
        <AppNavbar />
        <main>
          {tabs.map((tab) => (
            <div
              key={tab.key}
              className={`${activeKey === tab.key ? "block" : "hidden"}`}
            >
              {tab.component}
            </div>
          ))}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}