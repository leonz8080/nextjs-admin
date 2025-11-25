"use client";

import * as React from "react"
import { useTheme } from "next-themes"

import {
    Sun,
    Moon
} from "lucide-react";
import { Button } from "@/components/ui/button"

export function Theme() {
    const { setTheme, theme } = useTheme()

    function switchTheme() {
        if(theme === "light") {
            setTheme("dark")
        } else{
            setTheme("light")
        }
    }

    return (
        <Button variant="ghost" className="md:size-7 rounded-full relative" onClick={switchTheme}>
            {theme==="light"?<Sun className="md:size-5" />:<Moon className="md:size-5" />}
        </Button>
    )
}