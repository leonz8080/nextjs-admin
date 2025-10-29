"use client"

import * as React from "react"
import { useState } from "react"
import { useFormContext, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import {
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormField
} from "@/components/ui/form"
import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command";
import { CalendarIcon } from "lucide-react"
import dayjs from "dayjs"
import { ChevronsUpDown, Check } from "lucide-react"
import { timezones } from "@/constants/timezones"
import { cn } from "@/lib/utils"

import AvatarUploader from "@/components/common/avatar-uploader"
import PhoneInput from "@/components/common/phone-input"

import { useTranslations } from 'next-intl';

interface DatePickerFieldProps {
    name: string
    label?: string
}

export function DatePickerField({ name, label }: DatePickerFieldProps) {
    const { control } = useFormContext()
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [month, setMonth] = useState<Date | undefined>(date)

    const isValidDate = (d: Date) => d instanceof Date && !isNaN(d.getTime())

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <div className="space-y-2">
                    {label && <label className="text-sm font-medium">{label}</label>}
                    <div className="relative">
                        <Input
                            id={`${name}-input`}
                            value={field.value || ""}
                            className="bg-background pr-6 h-8 text-sm"
                            onChange={(e) => {
                                const d = new Date(e.target.value)
                                if (isValidDate(d)) {
                                    setDate(d)
                                    setMonth(d)
                                }
                                field.onChange(e.target.value)
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "ArrowDown") {
                                    e.preventDefault()
                                    setOpen(true)
                                }
                            }}
                        />
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                                >
                                    <CalendarIcon className="size-3.5" />
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
                                    onSelect={(d) => {
                                        setDate(d)
                                        field.onChange(d ? dayjs(d).format("YYYY-MM-DD") : "")
                                        setOpen(false)
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    {fieldState.error && (
                        <p className="text-xs text-red-500">{fieldState.error.message}</p>
                    )}
                </div>
            )}
        />
    )
}

interface SelectFieldProps {
    name: string
    label?: string
    placeholder?: string
    options: string[] | { label: string; value: string }[]
    className?: string,
    translate?: "all" | "first"
}

export function SelectField({
    name,
    label,
    placeholder,
    options,
    className,
    translate
}: SelectFieldProps) {
    const t = useTranslations();

    const { control } = useFormContext()

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <FormItem className={className}>
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>
                        <Select
                            onValueChange={field.onChange}
                            value={field.value}
                        >
                            <SelectTrigger
                                className="w-full **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                            >
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                            <SelectContent align="end">
                                {options.map((opt, i) =>
                                    typeof opt === "string" ? (
                                        <SelectItem key={opt} value={opt}>
                                            {translate && (translate === "all" || (translate === "first" && i === 0)) ? t(opt) : opt}
                                        </SelectItem>
                                    ) : (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {translate && (translate === "all" || (translate === "first" && i === 0)) ? t(opt.label) : opt.label}
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage>
                        {fieldState.error?.message}
                    </FormMessage>
                </FormItem>
            )}
        />
    )
}

interface AvatarFieldProps {
    name: string
    label?: string
    className?: string
}

export function AvatarField({ name, label, className }: AvatarFieldProps) {
    const { control } = useFormContext()

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <FormItem className={className}>
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>
                        <AvatarUploader
                            value={field.value}
                            onChange={(url: string) => field.onChange(url)}
                        />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
            )}
        />
    )
}

interface TextFieldProps {
    name: string
    label?: string
    placeholder?: string
    type?: string
    className?: string
    tip?: string
}

export function TextField({ name, label, placeholder, type = "text", className, tip }: TextFieldProps) {
    const { control } = useFormContext()

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <FormItem className={className}>
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>
                        <Input
                            value={field.value ?? ""}
                            type={type}
                            placeholder={placeholder}
                            onChange={field.onChange}
                        />
                    </FormControl>
                    {tip && (
                        <p className="text-muted-foreground text-sm">
                            {tip}
                        </p>
                    )}
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
            )}
        />
    )
}

interface SwitchFieldProps {
    name: string
    label?: string
    trueValue?: number | boolean
    falseValue?: number | boolean
    className?: string
}

export function SwitchField({
    name,
    label,
    trueValue = 1,
    falseValue = 0,
    className,
}: SwitchFieldProps) {
    const { control } = useFormContext()

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <FormItem className={className}>
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>
                        <Switch
                            checked={field.value === trueValue}
                            onCheckedChange={(checked) =>
                                field.onChange(checked ? trueValue : falseValue)
                            }
                        />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
            )}
        />
    )
}

interface PhoneFieldProps {
    name: string
    label?: string
    className?: string
}

export function PhoneField({ name, label = "Tele", className }: PhoneFieldProps) {
    const { control } = useFormContext()

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <FormItem className={className}>
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>
                        <PhoneInput field={field} />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
            )}
        />
    )
}

interface CheckboxItem {
    id: number | string
    name: string
}

interface CheckboxItemsFieldProps {
    name: string
    label?: string
    items: CheckboxItem[]
    className?: string
}

export function CheckboxItemsField({ name, label, items, className }: CheckboxItemsFieldProps) {
    const { control } = useFormContext()

    return (
        <FormItem className={className}>
            {label && <FormLabel className="text-sm">{label}</FormLabel>}
            <FormControl>
                <div className="flex flex-col gap-2 mt-1">
                    <Controller
                        name={name}
                        control={control}
                        render={({ field, fieldState }) => (
                            <>
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3">
                                        <Checkbox
                                            checked={field.value?.includes(item.id)}
                                            onCheckedChange={(checked) => {
                                                const newValue = checked
                                                    ? [...field.value, item.id]
                                                    : field.value.filter((id: any) => id !== item.id)
                                                field.onChange(newValue)
                                            }}
                                        />
                                        <Label>{item.name}</Label>
                                    </div>
                                ))}
                                <FormMessage>{fieldState.error?.message}</FormMessage>
                            </>
                        )}
                    />
                </div>
            </FormControl>
        </FormItem>
    )
}

interface CommandProps {
    name: string;
    label?: string;
    placeholder?: string;
    className?: string;
}

export const CommandField: React.FC<CommandProps> = ({
    name,
    label,
    placeholder,
    className,
}) => {
    const { control, setValue } = useFormContext();
    const [open, setOpen] = useState(false);

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="gap-3">
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className={cn("justify-between", className)}
                                >
                                    {field.value
                                        ? timezones.find((tz) => tz.value === field.value)?.label
                                        : placeholder}
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0">
                                <Command>
                                    <CommandInput placeholder={placeholder} className="h-9" />
                                    <CommandList>
                                        <CommandEmpty>No item found.</CommandEmpty>
                                        <CommandGroup>
                                            {timezones.map((tz) => (
                                                <CommandItem
                                                    key={tz.value}
                                                    value={tz.value}
                                                    onSelect={(currentValue) => {
                                                        setValue(name, currentValue);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    {tz.label}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto",
                                                            field.value === tz.value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}


interface TextareaFieldProps {
    name: string;
    label?: string;
    placeholder?: string;
    tip?: string;
    className?: string;
    widthClass?: string;
}

export const TextareaField: React.FC<TextareaFieldProps> = ({
    name,
    label,
    placeholder,
    tip,
    className,
}) => {
    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="gap-3">
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Textarea
                            className={cn(className)}
                            placeholder={placeholder}
                            {...field}
                        />
                    </FormControl>
                    {tip && (
                        <p className="text-muted-foreground text-sm">{tip}</p>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};