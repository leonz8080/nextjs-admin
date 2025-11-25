"use client"

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ComponentType } from "react";

import * as routes from "@/config/pages"
import { LanguageKey } from '@/constants/language';

export const urlListStore = {
    urlList: new Map<string, string[]>(),
    setUrlList(key: string, value: string[]) {
        this.urlList.set(key, value)
    },
    newUrlList(map: Map<string, string[]>) {
        this.urlList = new Map(map)
    },
    getTitles(key: string) {
        return this.urlList.get(key)
    },
    clear() {
        this.urlList.clear()
    }
}

function loadNav(): Map<string, NavMapModel> {
    var map: Map<string, NavMapModel> = new Map()
    var nodes: { [key: string]: any; }[] = []
    for (const [key, value] of Object.entries(routes)) {
        if (typeof value === "object" && value !== null) {
            if (Array.isArray(value)) {
                value.map((v, i) => {
                    nodes.push({
                        url: v.url,
                        title: v.title,
                        titles: [v.title],
                        permissions: v.permissions,
                        component: v.component,
                        items: v.items
                    })
                })
            } else {
                nodes.push({
                    url: value.url,
                    title: value.title,
                    titles: [value.title],
                    permissions: value.permissions,
                    component: value.component,
                    items: value.items
                })
            }
        }
    }
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].url && nodes[i].title && nodes[i].component) {
            map.set(nodes[i].url, {
                url: nodes[i].url,
                title: nodes[i].title,
                titles: nodes[i].titles,
                permissions: nodes[i].permissions,
                component: nodes[i].component,
            })
        }
        if (nodes[i].items) {
            for (var j = 0; j < nodes[i].items.length; j++) {
                nodes.push({
                    url: nodes[i].items[j].url,
                    title: nodes[i].items[j].title,
                    titles: nodes[i].titles.concat(nodes[i].items[j].title),
                    permissions: nodes[i].items[j].permissions,
                    component: nodes[i].items[j].component,
                    items: nodes[i].items[j].items
                })
            }
        }
    }
    return map
}

export interface NavMapModel {
    url: string,
    title: string,
    titles: string[],
    permissions: string[],
    component: ComponentType
}

interface navMap {
    navMap: Map<string, NavMapModel>,
    setNavMap: (m: Map<string, NavMapModel>) => void
}

export const navMapStore = create<navMap>()(
    (set) => ({
        navMap: new Map<string, NavMapModel>(loadNav()),
        setNavMap: (m) => set({ navMap: m })
    })
);

interface BreadcrumbState {
    path: string[];
    setBreadcrumb: (p: string[]) => void;
    clear: () => void;
}

export const breadcrumbStateStore = create<BreadcrumbState>()(
    (set) => ({
        path: [],
        setBreadcrumb: (p) => set({ path: p }),
        clear: () => set({ path: [] }),
    })
);

interface Tab {
    key: string;
    title: string;
    permissions: string[],
    component: React.ReactNode;
}

interface TabsState {
    tabs: Tab[];
    activeKey: string | null;
    addTab: (tab: Tab) => void;
    setActive: (key: string) => void;
    removeTab: (key: string) => void;
    clear: () => void;
}

export const useTabsStore = create<TabsState>()(
    (set) => ({
        tabs: [],
        activeKey: null,
        addTab: (tab) =>
            set((state) => {
                const exists = state.tabs.some((t) => t.key === tab.key);
                return {
                    tabs: exists ? state.tabs : [...state.tabs, tab],
                    activeKey: tab.key,
                };
            }),
        setActive: (key) => set({ activeKey: key }),
        removeTab: (key) =>
            set((state) => {
                const newTabs = state.tabs.filter((t) => t.key !== key);
                const newActiveKey = state.activeKey === key
                    ? newTabs[newTabs.length - 1]?.key || null
                    : state.activeKey;
                return {
                    tabs: newTabs,
                    activeKey: newActiveKey,
                }
            }),
        clear: () => set({ tabs: [] }),
    })
);

interface UserInfo {
    name: string;
    avatar: string;
}

interface UserInfoState {
    userInfo: UserInfo | null;
    setUserInfo: (user: UserInfo) => void;
    clearUserInfo: () => void;
}

export const useUserInfoStore = create<UserInfoState>()(
    persist(
        (set) => ({
            userInfo: null,
            setUserInfo: (userInfo) => set({ userInfo }),
            clearUserInfo: () => set({ userInfo: null }),
        }),
        {
            name: "userInfo-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

interface UserPermissions {
    permissions: string[];
    setUserPermissions: (permissions: string[]) => void;
}

export const userPermissionsStore = create<UserPermissions>()(
    persist(
        (set) => ({
            permissions: [],
            setUserPermissions: (permissions) => set({ permissions }),
        }),
        {
            name: "userPermissions-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

interface LanguageState {
    language: LanguageKey;
    setLanguage: (language: LanguageKey) => void;
}

export const useLanguageStore = create<LanguageState>()(
    (set) => ({
        language: 'en',
        setLanguage: (lan) => set({ language: lan }),
    })
);

interface HasNewNoticeState {
    hasNews: boolean;
    setHasNews: (hasNews: boolean) => void;
}

export const useNoticeStore = create<HasNewNoticeState>()(
    (set) => ({
        hasNews: false,
        setHasNews: (hasNews) => set({ hasNews: hasNews }),
    })
);