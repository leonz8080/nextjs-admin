"use client"

import { useEffect } from "react";

import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { usePathname, useSearchParams } from "next/navigation"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppNavbar } from "@/components/layout/app-navbar"
import { BreadcrumbExt } from "@/components/layout/breadcrumb-ext"
import { AppSearchBar } from "@/components/layout/app-searchbar"

import { useTabsStore, NavMapModel, navMapStore, breadcrumbStateStore } from "@/hooks/use-global-store"

import { Language } from "./language";
import { AdminMenu } from "./admin-menu";
import { Notice } from "./notice";

import { Button } from "@/components/ui/button"
import {
  Bell
} from "lucide-react"


import { NextIntlClientProvider } from 'next-intl';
import { useLanguageStore } from "@/hooks/use-global-store"

import { languages } from '@/config/language';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { tabs, activeKey, setActive, removeTab, addTab } = useTabsStore();
  const { setLanguage, language } = useLanguageStore();
  const { navMap } = navMapStore();

  useEffect(() => {
    if (tabs.length == 0) {
      const home = navMap.get('/dashboard/user-analysis');

      if (home) {
        var Component = home.component
        addTab({
          key: home.url,
          title: home.title,
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

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      var lang = navigator.language.toLowerCase();
      if (lang.indexOf('-') > 0) {
        lang = lang.substring(0, lang.indexOf('-'));
      }
      if (lang === 'zh' || lang === 'en' || lang === 'es' || lang === 'fr') {
        setLanguage(lang);
      } else {
        setLanguage('en');
      }
    }
  }, []);

  return (
    <NextIntlClientProvider locale={language} messages={languages[language]}>
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
              <BreadcrumbExt />
            </div>
            <div className="flex items-center gap-2 space-x-3 mr-4">
              <AppSearchBar />
              <Notice />
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
    </NextIntlClientProvider>
  )
}