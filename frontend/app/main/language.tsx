"use client";

import React from "react";

import {
    Globe,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button"

import { useLanguageStore } from '@/hooks/use-global-store';
import { languageNames } from '@/constants/language';

export function Language() {
    const { setLanguage, language } = useLanguageStore();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="md:size-7 rounded-full relative">
                    <Globe className="md:size-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-56 space-y-1 rounded-lg" side="bottom" align="end" sideOffset={4}>
                {languageNames.filter(lang => lang.value !== 'browser').map((lang) => (
                    <DropdownMenuItem key={lang.value} onClick={() => {
                        setLanguage(lang.value);
                    }} >
                        <span>{lang.label}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
