"use client"

import * as React from "react"
import { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { navMapStore } from "@/hooks/use-global-store"
import { NavCommand } from "@/components/common/nav-wrap";

import { useTranslations } from 'next-intl';

export function AppSearchBar() {
    const t = useTranslations();

    const [open, setOpen] = React.useState(false)
    const { navMap } = navMapStore();

    return (
        <Command className="rounded-lg border shadow-md md:min-w-[250px]">
            <CommandInput placeholder={t("command-search")} readOnly onClick={() => setOpen(true)} />
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder={t("search")} />
                <CommandList>
                    <CommandEmpty>{t("no-results")}</CommandEmpty>
                    <CommandGroup heading={t("recommend")}>
                        {
                            [...navMap].map(([key, value]) => {
                                var title = '';
                                for (const tit of value.titles) {
                                    if (title !== '') {
                                        title += '->';
                                    }
                                    title += t(tit);
                                }
                                return <NavCommand key={key} navKey={key} onClose={() => setOpen(false)}>{title}</NavCommand>
                            })
                        }
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </Command>
    )
}