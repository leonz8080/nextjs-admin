"use client";

import * as React from "react";
import { useEffect } from 'react'

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
import { useUserInfoStore, userPermissionsStore, useLanguageStore } from "@/hooks/use-global-store";
import { NextIntlClientProvider } from 'next-intl';

import { languages } from '@/constants/language';

const schema = z.object({
    name: z.string().min(1, "用户名必填").regex(/^[A-Za-z0-9]+$/, "只能包含数字和大小写字母"),
    password: z.string().min(6, "密码至少6位"),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
    const router = useRouter();
    const { setUserInfo } = useUserInfoStore();
    const { setUserPermissions } = userPermissionsStore();
    const { setLanguage } = useLanguageStore();

    function getDefaultLanguage() {
        request('getDefaultLanguage', {}).then((res) => {
            if (res.result === 0 && res.data) {
                var lang = res.data.sysLanguage;
                if (lang === 'browser') {
                    if (typeof navigator !== 'undefined') {
                        lang = navigator.language.toLowerCase();
                        if (lang.indexOf('-') > 0) {
                            lang = lang.substring(0, lang.indexOf('-'));
                        }
                    }
                    if (lang in languages) {
                        setLanguage(lang);
                    } else {
                        setLanguage('en');
                    }
                } else {
                    if (lang in languages) {
                        setLanguage(lang);
                    } else {
                        setLanguage('en');
                    }
                }
            } else {
                setLanguage('en');
            }
        })
    }

    useEffect(() => {
        getDefaultLanguage();
        /*if (typeof navigator !== 'undefined') {
            var lang = navigator.language.toLowerCase();
            if (lang.indexOf('-') > 0) {
                lang = lang.substring(0, lang.indexOf('-'));
            }
            if (lang === 'zh' || lang === 'en' || lang === 'es' || lang === 'fr') {
                setLanguage(lang);
            } else {
                setLanguage('en');
            }
        }*/
    }, []);

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "admin",
            password: "123456",
        },
    });

    const handleSubmit = async () => {
        const result = await form.trigger();
        if (!result) {
            toast.error("Fail.")
            return
        }
        var res = await request('login', form.getValues());
        if (res.result === 0 && res.data) {
            setUserInfo({ name: res.data.name, avatar: res.data.avatar })
            setUserPermissions(res.data.permissions)
            router.push("/main");
            return;
        }
        toast.error(res.message);
    };

    return (
        <NextIntlClientProvider locale={'en'} messages={languages['en']}>
            <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Login to your account</CardTitle>
                                <CardDescription>
                                    Enter your email below to login to your account
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
                                                            <FormLabel>用户名</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="输入用户名" {...field} />
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
                                                            <FormLabel>密码</FormLabel>
                                                            <FormControl>
                                                                <Input type="password" placeholder="••••••••" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <Button type="button" className="w-full" onClick={handleSubmit}>
                                                    Login
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                </Form>

                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </NextIntlClientProvider>
    );
}