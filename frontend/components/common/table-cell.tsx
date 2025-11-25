"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/client/utils";
import dayjs from "dayjs";

import { useTranslations } from 'next-intl';

interface DateTimeCellProps {
    id: number;
    value: string;
    className?: string;
    onUpdate: (id: number, field: string, value: string) => Promise<void>;
}

function isValidDate(date: Date | undefined) {
    if (!date) {
        return false
    }
    return !isNaN(date.getTime())
}

export function DataTimeCell({ id, value: initialValue, className, onUpdate }: DateTimeCellProps) {
    const t = useTranslations();

    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState<Date | undefined>(new Date(initialValue));
    const [month, setMonth] = React.useState<Date | undefined>(date);
    const [value, setValue] = React.useState(dayjs(date).format("YYYY-MM-DD"));

    return (
        <div className="relative flex gap-2">
            <Input
                id="date"
                value={value}
                className={cn("bg-background pr-6 h-8 text-sm", className)}
                onChange={(e) => {
                    const date = new Date(e.target.value);
                    setValue(e.target.value);
                    if (isValidDate(date)) {
                        setDate(date);
                        setMonth(date);
                    }
                }}
                onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setOpen(true);
                    }
                }}
            />
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id="date-picker"
                        variant="ghost"
                        className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                    >
                        <CalendarIcon className="size-3.5" />
                        <span className="sr-only">{t("select-date")}</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="end"
                    alignOffset={-8}
                    sideOffset={10}
                >
                    <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        month={month}
                        onMonthChange={setMonth}
                        onSelect={(date) => {
                            setDate(date);
                            setValue(dayjs(date).format("YYYY-MM-DD"));
                            setOpen(false);
                            date &&
                                onUpdate(id, "expiration", dayjs(date).format("YYYY-MM-DD"));
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}

interface SelectCellProps {
    id: number
    value: string
    options: string[]
    className?: string
    translate?: "all" | "first"
    onUpdate: (id: number, field: string, value: string) => Promise<void>
}

export function SelectCell({ id, value, options, className, translate, onUpdate }: SelectCellProps) {
    const t = useTranslations();
    return (
        <Select value={value} onValueChange={(newValue) => onUpdate(id, "level", newValue)}>
            <SelectTrigger
                className={cn("**:data-[slot=select-value]:block **:data-[slot=select-value]:truncate", className)}
                size="sm"
            >
                <SelectValue placeholder={value} />
            </SelectTrigger>
            <SelectContent align="end">
                {options.map((item, i) => (
                    <SelectItem key={item} value={item}>
                        {translate && (translate === "all" || (translate === "first" && i === 0)) ? t(item) : item}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

interface InputCellProps {
    id: number
    value: string
    className?: string
    onUpdate: (id: number, field: string, value: string) => void | Promise<void>
}

export function InputCell({ id, value, className, onUpdate }: InputCellProps) {
    const [text, setText] = React.useState(value)

    const handleSubmit = React.useCallback(
        (newValue: string) => {
            if (newValue !== value) {
                onUpdate(id, "remark", newValue)
            }
        },
        [id, value, onUpdate]
    )

    return (
        <Input
            className={cn("hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent", className)}
            defaultValue={text}
            id={`${id}-remark`}
            onBlur={(e) => handleSubmit(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit(e.currentTarget.value)
            }}
            onChange={(e) => setText(e.target.value)}
        />
    )
}