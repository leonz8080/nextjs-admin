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
import { useLocale } from 'next-intl';

import { useLanguageStore } from '@/hooks/use-global-store';

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
                <DropdownMenuItem key='en' onClick={() => {
                    setLanguage('en');
                }} >
                    <span>English</span>
                </DropdownMenuItem>
                <DropdownMenuItem key='zh' onClick={() => {
                    setLanguage('zh');
                }} >
                    <span>中文</span>
                </DropdownMenuItem>
                <DropdownMenuItem key='es' onClick={() => {
                    setLanguage('es');
                }} >
                    <span>Español</span>
                </DropdownMenuItem>
                <DropdownMenuItem key='fr' onClick={() => {
                    setLanguage('fr');
                }} >
                    <span>Français</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
