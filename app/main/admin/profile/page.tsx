"use client"

import React, { useState, useEffect, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner"
import { Form } from "@/components/ui/form";
import { iso, number, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useUserInfoStore } from "@/hooks/use-global-store";

import { TextField, PhoneField } from "@/components/common/form-field";
import { AvatarCropUploader } from "@/components/common/avatar-crop-uploader";
import { request } from "@/lib/client/utils"
import { ProfileModel } from "@/lib/models";

import { useTranslations } from 'next-intl';

export default function Profile() {
    const t = useTranslations();
    const { userInfo, setUserInfo } = useUserInfoStore();

    const schema = useMemo(() => z.object({
        avatar: z.string(),
        name: z.string(),
        email: z.string().email({ message: t("verify-email") }),
        tele: z.object({
            iso: z.string(),
            code: z.string().min(1, { message: t("select-area-code") }),
            number: z.string().min(5, { message: t("enter-phone-number") })
        }),
        address: z.string()
    }), [t]);

    type FormData = z.infer<typeof schema>;

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            avatar: "",
            name: "",
            email: "",
            tele: {
                iso: "US",
                code: "1",
                number: ""
            },
            address: ""
        },
    });

    async function getAdmin() {
        const res = await request<ProfileModel>('getAdmin', {});

        if (res.result != 0 || !res.data) {
            toast.error(res.message)
            return
        }

        form.setValue("name", res.data.name);
        form.setValue("email", res.data.email);
        if (res.data.tele) {
            const teles = res.data.tele.split(' ');
            if (teles.length > 2) {
                const num = teles.slice(2).join(' ');
                form.setValue("tele", { iso: teles[0], code: teles[1], number: num });
            } else {
                form.setValue("tele", { iso: "US", code: "1", number: res.data.tele });
            }
        } else {
            form.setValue("tele", { iso: "US", code: "1", number: "" });
        }
        form.setValue("avatar", res.data.avatar);
        form.setValue("address", res.data.address);
    }

    async function updateAdminBySelf() {
        const result = await form.trigger();
        if (!result) {
            toast.error(t("form-validation"))
            return
        }
        if(process.env.NEXT_PUBLIC_EDITABLE==="false") return;
        
        try {
            const res = await request<{ avatar: string }>('updateAdminBySelf', {
                avatar: form.getValues().avatar,
                email: form.getValues().email,
                tele: form.getValues().tele.iso + " " + form.getValues().tele.code + ' ' + form.getValues().tele.number,
                address: form.getValues().address
            });
            if (res.result == 0 && res.data) {
                toast.success(t(res.message))
                setUserInfo({
                    name: form.getValues().name,
                    avatar: res.data.avatar
                })
            } else {
                toast.error(t(res.message))
            }
        } catch (error) {
            toast.error(t("fail"));
        }
    }

    useEffect(() => {
        getAdmin()
    }, []);

    return (
        <>
            <div className="flex flex-col items-center space-y-4 p-6 mt-10">
                <Form {...form}>
                    <div className="grid gap-6">
                        <div className="grid gap-3">
                            <AvatarCropUploader name="avatar" className="rounded-full w-20 h-20" circularCrop={true} />
                        </div>
                        <div className="grid gap-3">
                            <TextField name="name" label={t('name')} className="w-80" placeholder={t('enter-name')} />
                        </div>
                        <div className="grid gap-3">
                            <TextField name="email" label={t('email')} type="email" className="w-80" placeholder={t('enter-email')} />
                        </div>
                        <div className="grid gap-3">
                            <PhoneField name="tele" label={t('tele')} className="w-80" />
                        </div>
                        <div className="grid gap-3">
                            <TextField name="address" label={t('address')} className="w-80" placeholder={t('enter-address')} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button type="button" className="w-full" onClick={updateAdminBySelf}>
                                {t('submit')}
                            </Button>
                        </div>
                    </div>
                </Form>
            </div>
        </>

    )
}