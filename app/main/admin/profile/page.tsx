"use client"

import React, { useState, useEffect, useRef } from "react";

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { number, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useUserInfoStore } from "@/hooks/use-global-store";

import { ImageCropDialog } from "@/components/layout/image-crop-dialog";
import { request } from "@/lib/client/utils"

export default function Profile() {
    const { userInfo, setUserInfo } = useUserInfoStore();

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [croppedUrl, setCroppedUrl] = useState<string | null>(null);

    const schema = z.object({
        avatar: z.string(),
        name: z.string(),
        email: z.string().email({ message: "请输入有效的邮箱地址" }),
        tele: z.string(),
        address: z.string()
    });

    type FormData = z.infer<typeof schema>;

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            avatar: "",
            name: "",
            email: "",
            tele: "",
            address: ""
        },
    });

    async function getAdmin() {
        var res = await request('getAdmin', {});

        if (res.result != 0 || !res.data) {
            toast.error(res.message)
            return
        }

        form.setValue("name", res.data.name);
        form.setValue("email", res.data.email);
        form.setValue("tele", res.data.tele);
        form.setValue("avatar", res.data.avatar);
        form.setValue("address", res.data.address);

        //setImageSrc(res.data.avatar);
    }

    async function updateAdminBySelf() {
        const result = await form.trigger();
        if (!result) {
            toast.error("Fail.")
            return
        }

        try {
            var res = await request('updateAdminBySelf', form.getValues());
            if (res.result == 0 && res.data) {
                toast.success(res.message)
                setUserInfo({
                    name: form.getValues().name,
                    avatar: res.data.avatar
                })
            } else {
                toast.error(res.message)
            }
        } catch (error) {
            console.error("failed", error);
        }
    }

    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setImageSrc(reader.result as string);
                setOpen(true);
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    useEffect(() => {
        getAdmin()
    }, []);

    return (
        <>
            <div className="flex flex-col items-center space-y-4 p-6 mt-10">
                <Form {...form}>
                    <div className="grid gap-6">
                        <div className="grid gap-3">
                            <FormField
                                control={form.control}
                                name="avatar"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col items-center">
                                        <FormControl>
                                            <label htmlFor="avatar-upload" className="cursor-pointer">
                                                <Avatar className="rounded-full w-20 h-20">
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
                            <input id="avatar-upload" type="file" accept="image/*" onChange={onSelectFile} className="hidden" />
                        </div>
                        <div className="grid gap-3">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center gap-3 justify-end">
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input type="text" className="w-80 bg-gray-100 cursor-not-allowed" readOnly {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid gap-3">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center gap-3 justify-end">
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" className="w-80" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid gap-3">
                            <FormField
                                control={form.control}
                                name="tele"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center gap-3 justify-end">
                                        <FormLabel>Tele</FormLabel>
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
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center gap-3 justify-end">
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input type="text" className="w-80" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button type="button" className="w-full" onClick={updateAdminBySelf}>
                                Submit
                            </Button>
                        </div>
                    </div>
                </Form>
            </div>
            <ImageCropDialog
                open={open}
                imageSrc={imageSrc || ''}
                circularCrop={true}
                onClose={() => { setOpen(false) }}
                onCropDone={(url) => { setCroppedUrl(url); form.setValue('avatar', url); }}
            />
        </>

    )
}