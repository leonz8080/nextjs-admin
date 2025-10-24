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

import { useTabsStore, useLanguageStore, navMapStore, breadcrumbStateStore, userPermissionsStore } from "@/hooks/use-global-store"
import { firstPageUrl } from "@/config/pages"

import { Language } from "./language";
import { AdminMenu } from "./admin-menu";
import { Notice } from "./notice";

import { NextIntlClientProvider } from 'next-intl';

import { languages } from '@/constants/language';
import { request } from "@/lib/client/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { tabs, activeKey, setActive, removeTab, addTab } = useTabsStore();
  const { setLanguage, language } = useLanguageStore();
  const { navMap } = navMapStore();
  const { permissions } = userPermissionsStore();

  useEffect(() => {
    if (tabs.length == 0) {
      const firstPage = navMap.get(firstPageUrl);

      if (firstPage) {
        var Component = firstPage.component
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

  function getDefaultLanguage() {
    request('getDefaultLanguage', {}).then((res) => {
      if (res.result === 0 && res.data) {
        var lang = res.data.sysLanguage;
        if (lang === 'browser') {
          if (typeof navigator !== 'undefined') {
            lang = navigator.language.toLowerCase();
            if (lang.indexOf('-') > 0) {
              lang = lang.substring(0, lang.indexOf('-'));
            }
          }
          if (lang in languages) {
            setLanguage(lang);
          } else {
            setLanguage('en');
          }
        } else {
          if (lang in languages) {
            setLanguage(lang);
          } else {
            setLanguage('en');
          }
        }
      } else {
        setLanguage('en');
      }
    })
  }

  useEffect(() => {
    getDefaultLanguage();
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