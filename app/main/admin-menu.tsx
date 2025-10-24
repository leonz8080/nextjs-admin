"use client";

import React from "react";
import { useForm } from "react-hook-form";

import {
    UserRoundPen,
    KeyRound,
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
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useUserInfoStore } from '@/hooks/use-global-store';

import { NavDropdownMenu } from "@/components/common/nav-wrap";

import { request } from "@/lib/client/utils";

export function AdminMenu() {
    const { userInfo } = useUserInfoStore();
    const router = useRouter();

    const [open, setOpen] = React.useState(false);

    async function logout() {
        try {
            var res = await request('logout', {});
            if (res.result !== 0) {
                toast.error(res.message);
                return;
            }
            router.push("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    }

    const pwdSchema = z.object({
        password: z.string().min(6, "密码至少6位"),
        password1: z.string().min(6, "密码至少6位"),
        password2: z.string().min(6, "密码至少6位"),
    }).refine((data) => data.password1 === data.password2, {
        message: "两次密码输入不一致",
        path: ["password2"], // 指定错误显示在 confirmPassword 字段
    });

    type FormData = z.infer<typeof pwdSchema>;

    const pwdForm = useForm<FormData>({
        resolver: zodResolver(pwdSchema),
        defaultValues: {
            password: "",
            password1: "",
            password2: "",
        },
    });

    async function updatePassword() {
        const result = await pwdForm.trigger();
        if (!result) {
            toast.error("Fail.")
            return
        }
        try {
            var res = await request('updatePassword', pwdForm.getValues());
            if(res.result == 0) {
                toast.success(res.message)
                setOpen(false)
            } else{
                toast.error(res.message)
            }
        } catch (error) {
            console.error("Logout failed", error);
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
                        <span>Profile</span>
                    </NavDropdownMenu>
                    <DropdownMenuItem key='password' onClick={() => setOpen(true)}>
                        <KeyRound />
                        <span>Password</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem key='logout' onClick={logout}>
                        <LogOut />
                        <span>Logout</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Password</DialogTitle>
                    </DialogHeader>
                    <Form {...pwdForm}>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <FormField
                                    control={pwdForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
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
                                    control={pwdForm.control}
                                    name="password1"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
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
                                    control={pwdForm.control}
                                    name="password2"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Re-enter New Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="••••••••" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </Form>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="button" onClick={updatePassword}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
