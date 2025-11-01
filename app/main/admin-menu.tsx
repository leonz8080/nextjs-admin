"use client";

import React from "react";
import { useState, useMemo } from 'react';
import { useForm } from "react-hook-form";

import {
    UserRoundPen,
    KeyRound,
    Lock,
    LogOut
} from "lucide-react";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useUserInfoStore } from '@/hooks/use-global-store';

import { NavDropdownMenu } from "@/components/common/nav-wrap";
import { TextField } from "@/components/common/form-field";

import { request } from "@/lib/client/utils";

import { useTranslations } from 'next-intl';

export function AdminMenu() {
    const t = useTranslations();

    const { userInfo } = useUserInfoStore();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [googleOpen, setGoogleOpen] = useState(false);
    const [googleState, setGoogleState] = useState({
        binded: 0,
        url: ''
    });

    async function logout() {
        try {
            const res = await request('logout', {});
            if (res.result !== 0) {
                toast.error(t(res.message));
                return;
            }
            router.push("/login");
        } catch (error) {
            toast.error(t("fail"));
        }
    }

    const pwdSchema = useMemo(() => z.object({
        password: z.string().min(6, t("password-min-length")),
        password1: z.string().min(6, t("password-min-length")),
        password2: z.string().min(6, t("password-min-length")),
    }).refine((data) => data.password1 === data.password2, {
        message: t("passwords-confirm"),
        path: ["password2"],
    }), [t]);

    type FormData = z.infer<typeof pwdSchema>;

    const pwdForm = useForm<FormData>({
        resolver: zodResolver(pwdSchema),
        defaultValues: {
            password: "",
            password1: "",
            password2: "",
        },
    });

    const googleSchema = useMemo(() => z.object({
        code: z.string().regex(/^\d{6}$/, t("google-code-format")),
    }), [t]);

    type googleFormData = z.infer<typeof googleSchema>;

    const googleForm = useForm<googleFormData>({
        resolver: zodResolver(googleSchema),
        defaultValues: {
            code: "",
        },
    });

    async function updatePassword() {
        const result = await pwdForm.trigger();
        if (!result) {
            toast.error(t("form-validation"))
            return
        }
        if(process.env.NEXT_PUBLIC_EDITABLE==="false") return;
        try {
            const res = await request('updatePassword', pwdForm.getValues());
            if (res.result == 0) {
                toast.success(t(res.message))
                setOpen(false)
            } else {
                toast.error(t(res.message))
            }
        } catch (error) {
            toast.error(t("fail"));
        }
    }

    async function handleGoogleAuth() {
        try {
            const res = await request<{ binded: number, url: string }>('getGoogleAuthQr', {});
            if (res.result == 0 && res.data) {
                setGoogleState({
                    binded: res.data.binded,
                    url: res.data.url,
                });
                setGoogleOpen(true)
            } else {
                toast.error(t(res.message))
            }
        } catch (error) {
            toast.error(t("fail"));
        }
    }

    async function verifyGoogleAuth() {
        const result = await googleForm.trigger();
        if (!result) {
            toast.error(t("form-validation"))
            return
        }
        if(process.env.NEXT_PUBLIC_EDITABLE==="false") return;
        try {
            const res = await request('verifyGoogleAuth', googleForm.getValues());
            if (res.result == 0 && res.data) {
                setGoogleState({
                    binded: 1,
                    url: '',
                });
                toast.success(t(res.message))
                setGoogleOpen(false)
            } else {
                toast.error(t(res.message))
            }
        } catch (error) {
            toast.error(t("fail"));
        }
    }

    async function resetGoogleAuthQr() {
        if(process.env.NEXT_PUBLIC_EDITABLE==="false") return;
        try {
            const res = await request<{ binded: number, url: string }>('resetGoogleAuthQr', {});
            if (res.result == 0 && res.data) {
                setGoogleState({
                    binded: res.data.binded,
                    url: res.data.url,
                });
                toast.success(t(res.message))
            } else {
                toast.error(t(res.message))
            }
        } catch (error) {
            toast.error(t("fail"));
        }
    }

    async function cancelGoogleAuth() {
        if(process.env.NEXT_PUBLIC_EDITABLE==="false") return;
        try {
            const res = await request('cancelGoogleAuth', {});
            if (res.result == 0 && res.data) {
                setGoogleState({
                    binded: 0,
                    url: '',
                });
                toast.success(t(res.message))
                setGoogleOpen(false)
            } else {
                toast.error(t(res.message))
            }
        } catch (error) {
            toast.error(t("fail"));
        }
    }
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className="rounded-full w-7 h-7 cursor-pointer">
                        <AvatarImage src={userInfo?.avatar} />
                        <AvatarFallback>
                            <AvatarImage src="/unAuth.png" />
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-56 space-y-1 rounded-lg" side="bottom" align="end" sideOffset={4}>
                    <DropdownMenuItem key='name'>
                        <span>{userInfo?.name || 'Uncertified'}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <NavDropdownMenu navKey='/profile'>
                        <UserRoundPen />
                        <span>{t("profile")}</span>
                    </NavDropdownMenu>
                    <DropdownMenuItem key='password' onClick={() => setOpen(true)}>
                        <Lock />
                        <span>{t("password")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem key='googleAuth' onClick={() => handleGoogleAuth()}>
                        <KeyRound />
                        <span>{t("google-auth")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem key='logout' onClick={logout}>
                        <LogOut />
                        <span>{t("logout")}</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("update-password")}</DialogTitle>
                    </DialogHeader>
                    <Form {...pwdForm}>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <TextField name="password" label={t("password")} type="password" placeholder="••••••••" />
                            </div>
                            <div className="grid gap-3">
                                <TextField name="password1" label={t("new-password")} type="password" placeholder="••••••••" />
                            </div>
                            <div className="grid gap-3">
                                <TextField name="password2" label={t("re-enter-new-password")} type="password" placeholder="••••••••" />
                            </div>
                        </div>
                    </Form>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">{t("cancel")}</Button>
                        </DialogClose>
                        <Button type="button" onClick={updatePassword}>{t("save")}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={googleOpen} onOpenChange={setGoogleOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("google-auth")}</DialogTitle>
                    </DialogHeader>
                    {googleState.binded === 0 && (
                        <div className="w-full flex flex-col gap-4">
                            {googleState.url && <div className="w-full flex justify-center"><img src={googleState.url} className="w-40 h-40" /></div>}
                            <Form {...googleForm}>
                                <div className="grid gap-4">
                                    <div className="grid gap-3">
                                        <TextField name="code" label={t("verification-code")} placeholder="" />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Button type="button" className="w-full" onClick={verifyGoogleAuth}>
                                            {t("submit")}
                                        </Button>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    )}
                    {googleState.binded === 1 && (
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                {t("google-auth-bounded")}
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button type="button" className="w-full" onClick={resetGoogleAuthQr}>
                                    {t("rebinding")}
                                </Button>
                                <Button type="button" variant="outline" className="w-full" onClick={cancelGoogleAuth}>
                                    {t("cancel-google-auth")}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
