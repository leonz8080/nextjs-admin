"use client";

import React, { useState, useEffect, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

import {
    Card,
} from "@/components/ui/card"
import { Form } from "@/components/ui/form";
import { useForm, UseFormReturn } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { request } from "@/lib/client/utils"

import { languages, languageNames } from "@/constants/language";

import { SelectField, TextField, CommandField, TextareaField, SwitchField } from "@/components/common/form-field";
import { AvatarCropUploader } from "@/components/common/avatar-crop-uploader";

import { useTranslations } from 'next-intl';

export default function Setting() {
    const t = useTranslations();

    function getConfig() {
        request<Record<string, string>>("getAllConfig", {}).then((res) => {
            if (res.result === 0 && res.data) {
                sysForm.setValue("sysName", res.data.sysName || "");
                sysForm.setValue("sysLogo", res.data.sysLogo || "");
                sysForm.setValue("sysVersion", res.data.sysVersion || "");
                safeForm.setValue("tokenExpiration", parseInt(res.data.tokenExpiration) || 0);
                safeForm.setValue("ipWhitelist", res.data.ipWhitelist || "");
                otherForm.setValue("sysLanguage", res.data.sysLanguage || "");
                otherForm.setValue("sysServerTimeZone", res.data.sysServerTimeZone || "");
                otherForm.setValue("imageLimit", parseInt(res.data.imageLimit) || 0);
                otherForm.setValue("compressImage", parseInt(res.data.compressImage) || 0);
            } else {
                toast.error(t(res.message));
            }
        });
    }

    async function updateConfig<T extends Record<string, string | number>>(form: UseFormReturn<T>) {
        const result = await form.trigger();
        if (!result) {
            toast.error(t("form-validation"))
            return
        }

        try {
            const res = await request('updateConfig', form.getValues());
            if (res.result == 0 && res.data) {
                toast.success(t(res.message))
            } else {
                toast.error(t(res.message))
            }
        } catch (error) {
            toast.error(t("fail"));
        }
    }

    const sysInfoSchema = useMemo(() => z.object({
        sysName: z.string().min(1, { message: t("system-name-is-required") }),
        sysLogo: z.string().min(1, { message: t("logo-is-required") }),
        sysVersion: z.string().min(1, { message: t("version-is-required") })
    }), [t]);

    type SysFormData = z.infer<typeof sysInfoSchema>;

    const sysForm = useForm<SysFormData>({
        resolver: zodResolver(sysInfoSchema),
        defaultValues: {
            sysName: "",
            sysLogo: "",
            sysVersion: ""
        },
    });

    const safeSchema = useMemo(() => z.object({
        tokenExpiration: z.number(),
        ipWhitelist: z.string()
    }), [t]);

    type SafeData = z.infer<typeof safeSchema>;

    const safeForm = useForm<SafeData>({
        resolver: zodResolver(safeSchema),
        defaultValues: {
            tokenExpiration: 0,
            ipWhitelist: ""
        },
    });

    const otherSchema = useMemo(() => z.object({
        sysLanguage: z.string().min(1, { message: t("language-is-required") }),
        sysServerTimeZone: z.string().min(1, { message: t("server-timeZone-is-required") }),
        imageLimit: z.number().min(0, { message: t("image-min-size") }),
        compressImage: z.number()
    }), [t]);

    type OtherData = z.infer<typeof otherSchema>;

    const otherForm = useForm<OtherData>({
        resolver: zodResolver(otherSchema),
        defaultValues: {
            sysLanguage: "",
            sysServerTimeZone: "",
            imageLimit: 0,
        },
    });

    useEffect(() => {
        getConfig()
    }, []);

    return (
        <div className="flex flex-col p-6 gap-4">
            <Card className="pl-4">
                <h2 className="text-xl font-bold">{t("sys-set")}</h2>
                <Form {...sysForm}>
                    <div className="grid gap-6">
                        <div className="w-20 h-20">
                            <AvatarCropUploader name="sysLogo" className="rounded-none w-20 h-20" circularCrop={true} />
                        </div>
                        <div className="grid gap-3">
                            <TextField name="sysName" label={t("name")} className="w-75" placeholder={t("enter-name")} />
                        </div>
                        <div className="grid gap-3">
                            <TextField name="sysVersion" label={t("version")} className="w-75" placeholder={t("enter-version")} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button type="button" className="w-30" onClick={() => updateConfig(sysForm)}>
                                {t("submit")}
                            </Button>
                        </div>
                    </div>
                </Form>
            </Card>
            <Card className="pl-4">
                <h2 className="text-xl font-bold">{t("general-settings")}</h2>
                <Form {...otherForm}>
                    <div className="grid gap-6">
                        <div className="grid gap-3">
                            <SelectField
                                name="sysLanguage"
                                label={t("default-language")}
                                options={languageNames}
                                className="w-75"
                                placeholder={t("select-default-language")}
                                translate="first"
                            />
                        </div>
                        <div className="grid gap-3">
                            <CommandField
                                name="sysServerTimeZone"
                                label={t("server-time-zone")}
                                className="w-75"
                                placeholder={t("select-time-zone")}
                            />
                        </div>
                        <div className="grid gap-3">
                            <TextField
                                name="imageLimit"
                                label={t("images-max-size")}
                                className="w-75"
                                placeholder={t("enter-images-max-size")}
                            />
                        </div>
                        <div className="grid gap-3">
                            <SwitchField
                                name="compressImage"
                                label={t("compress-image")}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button type="button" className="w-30" onClick={() => updateConfig(otherForm)}>
                                {t("submit")}
                            </Button>
                        </div>
                    </div>
                </Form>
            </Card>
            <Card className="pl-4">
                <h2 className="text-xl font-bold">{t("security-settings")}</h2>
                <Form {...safeForm}>
                    <div className="grid gap-6">
                        <div className="grid gap-3">
                            <TextField
                                name="tokenExpiration"
                                label={t("token-expiration")}
                                className="w-75"
                                placeholder={t("enter-token-expiration")}
                                tip={t("token-expiration-tip")}
                            />
                        </div>
                        <div className="grid gap-3">
                            <TextareaField
                                name="ipWhitelist"
                                label={t("IP-whitelist")}
                                className="w-75"
                                placeholder={t("enter-IP-whitelist")}
                                tip={t("IP-whitelist-tip")}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button type="button" className="w-30" onClick={() => updateConfig(safeForm)}>
                                {t("submit")}
                            </Button>
                        </div>
                    </div>
                </Form>
            </Card>
        </div>
    )

}