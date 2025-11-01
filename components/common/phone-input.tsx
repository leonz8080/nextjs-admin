"use client";

import * as React from "react";
import { useState, useMemo, useRef } from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import ReactCountryFlag from "react-country-flag";

import { cn } from "@/lib/utils";
import { countryCodes } from "@/constants/country-codes";

import { useTranslations } from 'next-intl';

interface PhoneInputProps {
    field: ControllerRenderProps<FieldValues, string>;
    className?: string;
}

export default function PhoneInput({ field, className }: PhoneInputProps) {
    const t = useTranslations();

    const [open, setOpen] = useState(false);

    const value = field.value || { iso: "US", code: "1", number: "" };

    const countryItems = useMemo(() => {
        return countryCodes.map((countryCode) => (
            <CommandItem
                key={countryCode.iso}
                value={countryCode.iso}
                onSelect={() => {
                    field.onChange({ ...field.value, iso: countryCode.iso, code: countryCode.code });
                    console.log(field.value)
                    setOpen(false);
                }}
            >
                <ReactCountryFlag
                    countryCode={countryCode.iso}
                    svg
                    style={{ width: "1.5em", height: "1.5em" }}
                />
                <span className="ml-2">
                    {countryCode.country} ({countryCode.code})
                </span>
                <Check
                    className={cn(
                        "ml-auto",
                        field.value.iso === countryCode.iso ? "opacity-100" : "opacity-0"
                    )}
                />
            </CommandItem>
        ));
    }, [field.value]);

    return (
        <div className={cn("flex gap-2", className)}>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild className="w-24">
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-24 justify-between"
                    >
                        {value
                            ? countryCodes.find((item) => item.iso === value.iso)?.code
                            : "1"}
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent forceMount className="w-100 p-0">
                    <Command>
                        <CommandInput placeholder={t("search-country-code")} className="h-9" />
                        <CommandList>
                            <CommandEmpty>{t("no-country")}</CommandEmpty>
                            <CommandGroup>{countryItems}</CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            <Input
                type="tel"
                placeholder={t("enter-tele")}
                className="flex-1"
                value={value.number}
                onChange={(e) => field.onChange({ ...value, number: e.target.value })}
            />
        </div>
    );
}