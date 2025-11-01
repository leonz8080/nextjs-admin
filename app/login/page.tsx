"use client";

import * as React from "react";
import { useEffect, useMemo } from 'react'

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner"
import { useRouter } from "next/navigation";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { request } from "@/lib/client/utils";
import { useUserInfoStore, userPermissionsStore } from "@/hooks/use-global-store";
import { useTranslations } from 'next-intl';

export default function Login() {
    const t = useTranslations();

    const router = useRouter();
    const { setUserInfo } = useUserInfoStore();
    const { setUserPermissions } = userPermissionsStore();

    const schema = useMemo(() => z.object({
        name: z.string().min(1, t("username-is-required")).regex(/^[A-Za-z0-9]+$/, t("username-format")),
        password: z.string().min(6, t("password-min-length")),
        googleCAPTCHA: z.string()
    }), [t]);

    type FormData = z.infer<typeof schema>;

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "admin",
            password: "123456",
            googleCAPTCHA: ""
        },
    });

    const handleSubmit = async () => {
        const result = await form.trigger();
        if (!result) {
            toast.error(t("form-validation"))
            return
        }
        const res = await request<{ name: string, avatar: string, permissions: string[] }>('login', form.getValues());
        if (res.result === 0 && res.data) {
            setUserInfo({ name: res.data.name, avatar: res.data.avatar })
            setUserPermissions(res.data.permissions)
            router.push("/main");
            return;
        }
        toast.error(t(res.message));
    };

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("login-title")}</CardTitle>
                            <CardDescription>
                                {t("login-subtitle")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form>
                                    <div className="flex flex-col gap-6">
                                        <div className="grid gap-3">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t("username")}</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder={t("username-enter")} {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <FormField
                                                control={form.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t("password")}</FormLabel>
                                                        <FormControl>
                                                            <Input type="password" placeholder="••••••••" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <FormField
                                                control={form.control}
                                                name="googleCAPTCHA"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t("google-CAPTCHA")}</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder={t("google-CAPTCHA-enter")} {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <Button type="button" className="w-full" onClick={handleSubmit}>
                                                {t("login")}
                                            </Button>
                                            <div className="text-center">
                                                username: admin,    password: 123456
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </Form>

                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}