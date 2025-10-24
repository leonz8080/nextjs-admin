"use client";

import React, { useState, useEffect, useRef } from "react";

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
import { Separator } from "@/components/ui/separator"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useForm, UseFormReturn } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { request } from "@/lib/client/utils"

import { ImageCropDialog } from "@/components/layout/image-crop-dialog";
import { LanguageKey } from "@/hooks/use-global-store";
import { languages } from "@/constants/language";
import { timezones } from "@/constants/timezones";

export default function Setting() {

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [croppedUrl, setCroppedUrl] = useState<string | null>(null);

    const [openTimezones, setOpenTimezones] = React.useState(false)

    function getConfig() {
        request("getAllConfig", {}).then((res) => {
            console.log(res);
            if (res.result === 0 && res.data) {
                sysForm.setValue("sysName", res.data.sysName || "");
                sysForm.setValue("sysLogo", res.data.sysLogo || "");
                sysForm.setValue("sysVersion", res.data.sysVersion || "");
                safeForm.setValue("tokenExpiration", parseInt(res.data.tokenExpiration) || 0);
                safeForm.setValue("ipWhitelist", res.data.ipWhitelist || "");
                otherForm.setValue("sysLanguage", res.data.sysLanguage || "");
                otherForm.setValue("sysServerTimeZone", res.data.sysServerTimeZone || "");
                otherForm.setValue("imageLimit", parseInt(res.data.imageLimit) || 0);
            } else {
                toast.error(res.message);
            }
        });
    }

    async function updateConfig<T extends Record<string, any>>(form: UseFormReturn<T>) {
        const result = await form.trigger();
        if (!result) {
            toast.error("Fail.")
            return
        }

        try {
            var res = await request('updateConfig', form.getValues());
            if (res.result == 0 && res.data) {
                toast.success(res.message)
            } else {
                toast.error(res.message)
            }
        } catch (error) {
            console.error("failed", error);
        }
    }

    const sysInfoSchema = z.object({
        sysName: z.string().min(1, { message: "系统名称不能为空" }),
        sysLogo: z.string().min(1, { message: "系统Logo不能为空" }),
        sysVersion: z.string().min(1, { message: "系统版本不能为空" })
    });

    type SysFormData = z.infer<typeof sysInfoSchema>;

    const sysForm = useForm<SysFormData>({
        resolver: zodResolver(sysInfoSchema),
        defaultValues: {
            sysName: "",
            sysLogo: "",
            sysVersion: ""
        },
    });

    const safeSchema = z.object({
        tokenExpiration: z.number(),
        ipWhitelist: z.string()
    });

    type SafeData = z.infer<typeof safeSchema>;

    const safeForm = useForm<SafeData>({
        resolver: zodResolver(safeSchema),
        defaultValues: {
            tokenExpiration: 0,
            ipWhitelist: ""
        },
    });

    const otherSchema = z.object({
        sysLanguage: z.string().min(1, { message: "系统语言不能为空" }),
        sysServerTimeZone: z.string().min(1, { message: "服务器时区不能为空" }),
        imageLimit: z.number().min(0, { message: "图片大小限制不能小于0" }),
    });

    type OtherData = z.infer<typeof otherSchema>;

    const otherForm = useForm<OtherData>({
        resolver: zodResolver(otherSchema),
        defaultValues: {
            sysLanguage: "",
            sysServerTimeZone: "",
            imageLimit: 0,
        },
    });

    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setImageSrc(reader.result as string);
                setOpen(true);
            });
            reader.readAsDataURL(e.target.files[0]);
        }

        e.target.value = ""
    };

    useEffect(() => {
        getConfig()
    }, []);

    return (
        <div className="flex flex-col p-6 gap-4">
            <div className="flex flex-col gap-6">
                <h2 className="text-xl font-bold">System Information Settings</h2>
                <Form {...sysForm}>
                    <div className="grid gap-6">
                        <div>
                            <FormField
                                control={sysForm.control}
                                name="sysLogo"
                                render={({ field }) => (
                                    <FormItem className="gap-3 flex flex-col">
                                        <FormControl>
                                            <label htmlFor="logo-upload" className="cursor-pointer">
                                                <Avatar className="rounded-none w-20 h-20">
                                                    <AvatarImage src={field.value} />
                                                    <AvatarFallback>
                                                        <AvatarImage src="/unAuth.png" />
                                                    </AvatarFallback>
                                                </Avatar>
                                            </label>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <input id="logo-upload" type="file" accept="image/*" onChange={onSelectFile} className="hidden" />
                        </div>
                        <div className="grid gap-3">
                            <FormField
                                control={sysForm.control}
                                name="sysName"
                                render={({ field }) => (
                                    <FormItem className="gap-3">
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input type="text" className="w-80" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid gap-3">
                            <FormField
                                control={sysForm.control}
                                name="sysVersion"
                                render={({ field }) => (
                                    <FormItem className="gap-3">
                                        <FormLabel>Version</FormLabel>
                                        <FormControl>
                                            <Input type="text" className="w-80" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button type="button" className="w-30" onClick={() => updateConfig(sysForm)}>
                                Submit
                            </Button>
                        </div>
                    </div>
                </Form>
                <ImageCropDialog
                    open={open}
                    imageSrc={imageSrc || ''}
                    circularCrop={false}
                    onClose={() => { setOpen(false) }}
                    onCropDone={(url) => { setCroppedUrl(url); sysForm.setValue('sysLogo', url); }}
                />
            </div>
            <Separator />
            <div className="flex flex-col gap-6">
                <h2 className="text-xl font-bold">General Settings</h2>
                <Form {...otherForm}>
                    <div className="grid gap-6">
                        <div className="grid gap-3">
                            <FormField
                                control={otherForm.control}
                                name="sysLanguage"
                                render={({ field }) => (
                                    <FormItem className="gap-3">
                                        <FormLabel>Default language</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger
                                                    className="w-80 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                                                >
                                                    <SelectValue placeholder="Select default language" />
                                                </SelectTrigger>
                                                <SelectContent align="end">
                                                    <SelectItem value="browser">User's browser default</SelectItem>
                                                    {
                                                        languages && Object.keys(languages).map((item) => {
                                                            return <SelectItem key={item} value={item}>{item}</SelectItem>
                                                        })
                                                    }
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <input id="logo-upload" type="file" accept="image/*" onChange={onSelectFile} className="hidden" />
                        </div>
                        <div className="grid gap-3">
                            <FormField
                                control={otherForm.control}
                                name="sysServerTimeZone"
                                render={({ field }) => (
                                    <FormItem className="gap-3">
                                        <FormLabel>Server time zone</FormLabel>
                                        <FormControl>
                                            <Popover open={openTimezones} onOpenChange={setOpenTimezones}>
                                                <PopoverTrigger asChild className="w-80">
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={openTimezones}
                                                        className="w-80 justify-between"
                                                    >
                                                        {field.value
                                                            ? timezones.find((timezones) => timezones.value === field.value)?.label
                                                            : "Select timezone..."}
                                                        <ChevronsUpDown className="opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-80 p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search timezone..." className="h-9" />
                                                        <CommandList>
                                                            <CommandEmpty>No timezone found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {timezones.map((timezone) => (
                                                                    <CommandItem
                                                                        key={timezone.value}
                                                                        value={timezone.value}
                                                                        onSelect={(currentValue) => {
                                                                            field.value = currentValue
                                                                            setOpenTimezones(false)
                                                                        }}
                                                                    >
                                                                        {timezone.label}
                                                                        <Check
                                                                            className={cn(
                                                                                "ml-auto",
                                                                                field.value === timezone.value ? "opacity-100" : "opacity-0"
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
                        </div>
                        <div className="grid gap-3">
                            <FormField
                                control={otherForm.control}
                                name="imageLimit"
                                render={({ field }) => (
                                    <FormItem className="gap-3">
                                        <FormLabel>Maximum size of uploaded images (kb)</FormLabel>
                                        <FormControl>
                                            <Input type="number" className="w-80" {...field} onChange={(e) => field.onChange(Number(e.target.value))}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button type="button" className="w-30" onClick={() => updateConfig(otherForm)}>
                                Submit
                            </Button>
                        </div>
                    </div>
                </Form>
            </div>
            <Separator />
            <div className="flex flex-col gap-6">
                <h2 className="text-xl font-bold">Security Settings</h2>
                <Form {...safeForm}>
                    <div className="grid gap-6">
                        <div className="grid gap-3">
                            <FormField
                                control={safeForm.control}
                                name="tokenExpiration"
                                render={({ field }) => (
                                    <FormItem className="gap-3">
                                        <FormLabel>Token Expiration Time (minute)</FormLabel>
                                        <FormControl>
                                            <Input type="text" className="w-80" {...field} onChange={(e) => field.onChange(Number(e.target.value))}/>
                                        </FormControl>
                                        <p className="text-muted-foreground text-sm">
                                            If it never expires, fill in 0
                                        </p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <input id="logo-upload" type="file" accept="image/*" onChange={onSelectFile} className="hidden" />
                        </div>
                        <div className="grid gap-3">
                            <FormField
                                control={safeForm.control}
                                name="ipWhitelist"
                                render={({ field }) => (
                                    <FormItem className="gap-3">
                                        <FormLabel>IP Whitelist</FormLabel>
                                        <FormControl>
                                            <Textarea className="w-80" {...field} />
                                        </FormControl>
                                        <p className="text-muted-foreground text-sm">
                                            Separate IP addresses with commas.
                                        </p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button type="button" className="w-30" onClick={() => updateConfig(safeForm)}>
                                Submit
                            </Button>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    )

}