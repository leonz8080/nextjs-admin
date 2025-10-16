"use client"

import * as React from "react"
import { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { navMapStore } from "@/hooks/use-global-store"
import { NavCommand } from "@/components/common/nav-wrap";

export function AppSearchBar() {
    const [open, setOpen] = React.useState(false)
    const { navMap } = navMapStore();

    return (
        <Command className="rounded-lg border shadow-md md:min-w-[250px]">
            <CommandInput placeholder="Type a command or search..." readOnly onClick={() => setOpen(true)} />
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search..." />
                <CommandList>
                    <CommandEmpty>No results</CommandEmpty>
                    <CommandGroup heading="Recommend">
                        {
                            [...navMap].map(([key, value]) => {
                                var title = '';
                                for (const t of value.titles) {
                                    if (title !== '') {
                                        title += '->';
                                    }
                                    title += t;
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