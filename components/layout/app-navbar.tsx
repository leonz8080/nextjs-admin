"use client"

import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

import { useTabsStore } from "@/hooks/use-global-store";

export function AppNavbar() {
    const router = useRouter();
    const { tabs, activeKey, setActive, removeTab } = useTabsStore();

    return (
        <>
            <Separator className="shadow" />
            <div className="overflow-x-auto whitespace-nowrap pb-1 pt-0.5 pl-4">
                {
                    tabs.map((tab) => {
                        if (tab.key === activeKey)
                            return (
                                <Badge
                                    key={tab.key}
                                    variant="secondary"
                                    className="bg-blue-500 text-white dark:bg-blue-600 rounded-none ml-1"
                                >
                                    <span>{tab.title}</span>
                                    {tabs.length > 1 && <span className="cursor-pointer" onClick={(e) => { e.stopPropagation(); removeTab(tab.key); }}><X size={12}/></span>}
                                </Badge>
                            )
                        else
                            return (
                                <Badge
                                    key={tab.key}
                                    variant="outline"
                                    className="rounded-none ml-1"
                                >
                                    <span className="cursor-pointer" onClick={() => { setActive(tab.key); }}>{tab.title}</span>
                                    {tabs.length > 1 && <span className="cursor-pointer" onClick={(e) => { e.stopPropagation(); removeTab(tab.key); }}><X size={12}/></span>}
                                </Badge>
                            )
                    })
                }
            </div>
            <Separator className="shadow-2xs" />
        </>
    )
}