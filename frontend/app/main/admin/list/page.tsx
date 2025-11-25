"use client";

import * as React from "react"
import { useForm } from "react-hook-form";
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

import {
    Search,
    Trash2,
    Plus,
    Pencil
} from "lucide-react";
import {
    ColumnDef,
} from "@tanstack/react-table"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { DeleteConfirmDialog } from "@/components/common/delete-confirm-dialog"
import { DataTable, DataPagination, DataTableRef } from "@/components/common/data-table"

import { request } from "@/lib/client/utils"
import { AvatarField, TextField, PhoneField, CheckboxItemsField } from "@/components/common/form-field";

import { useTranslations } from 'next-intl';

import { AdminModel, RoleModel, PageModel } from "@/lib/models";

export default function AdminList() {
    const t = useTranslations();

    const [totalRow, setTotalRow] = useState(0);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [list, setList] = useState<AdminModel[]>([]);

    const [name, setName] = useState("");
    const [roles, setRoles] = useState<RoleModel[]>([]);
    const [open, setOpen] = React.useState(false);
    const [delOpen, setDelOpen] = React.useState(false);
    const delId = React.useRef(0);

    const tableRef = useRef<DataTableRef<AdminModel>>(null);

    const schema = useMemo(() => z.object({
        id: z.number(),
        avatar: z.string(),
        name: z.string().min(1, t("name-is-required")),
        email: z.string(),
        tele: z.object({
            iso: z.string(),
            code: z.string().min(1, { message: t("select-area-code") }),
            number: z.string().min(5, { message: t("enter-phone-number") })
        }),
        address: z.string(),
        password: z.string().refine((val) => {
            if (form.getValues().id === 0 && val.length < 6) {
                return false;
            }
            return true;
        }, {
            message: t("password-min-length")
        }),
        roles: z.array(z.number()).refine((value) => value.some((item) => item), {
            message: t("select-min"),
        }),
    }), [t]);

    type FormData = z.infer<typeof schema>;

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            id: 0,
            avatar: "",
            name: "",
            email: "",
            tele: {
                iso: "US",
                code: "1",
                number: ""
            },
            address: "",
            password: "",
            roles: []
        },
    });

    async function get() {
        const res = await request<PageModel<AdminModel>>('getAdmins', {
            name: name,
            pageIndex: pageIndex,
            pageSize: pageSize
        });

        if (res.result != 0 || !res.data) {
            toast.error(res.message)
            return
        }

        setTotalRow(res.data.total)
        setPageIndex(res.data.pageIndex)
        setList(res.data.list)
    }

    async function handleInsert() {
        form.setValue("id", 0);
        form.setValue("avatar", '/unAuth.png');
        form.setValue("name", '');
        form.setValue("email", '');
        form.setValue("tele", { iso: "US", code: "1", number: "" });
        form.setValue("password", '');
        form.setValue("address", '');
        form.setValue("roles", []);
        const res = await request<{ list: RoleModel[] }>('getAllRoles', {});
        setRoles(res.data?.list || []);
        form.clearErrors();
        setOpen(true);
    }

    async function insert() {
        const result = await form.trigger();
        if (!result) {
            toast.error(t("form-validation"))
            return
        }

        //if(process.env.NEXT_PUBLIC_EDITABLE==="false") return;

        try {
            const res = await request('insertAdmin', {
                avatar: form.getValues().avatar,
                name: form.getValues().name,
                email: form.getValues().email,
                tele: form.getValues().tele.iso + " " + form.getValues().tele.code + ' ' + form.getValues().tele.number,
                address: form.getValues().address,
                password: form.getValues().password,
                roles: form.getValues().roles,
            });
            if (res.result == 0) {
                toast.success(t(res.message))
                setOpen(false)
                get()
            } else {
                toast.error(t(res.message))
            }
        } catch (error) {
            toast.error(t("fail"));
        }
    }

    async function handleUpdate(admin: AdminModel) {
        form.setValue("id", admin.id);
        form.setValue("avatar", admin.avatar);
        form.setValue("name", admin.name);
        form.setValue("email", admin.email);
        if (admin.tele) {
            const teles = admin.tele.split(' ');
            if (teles.length > 2) {
                const num = teles.slice(2).join(' ');
                form.setValue("tele", { iso: teles[0], code: teles[1], number: num });
            } else {
                form.setValue("tele", { iso: "US", code: "1", number: admin.tele });
            }
        } else {
            form.setValue("tele", { iso: "US", code: "1", number: "" });
        }
        form.setValue("address", admin.address);
        form.setValue("password", '');
        const list = await request<{ list: RoleModel[] }>('getAllRoles', {});
        setRoles(list.data?.list || []);
        const roles = await request<{ roles: number[] }>('getAdminRole', { id: admin.id });
        form.setValue("roles", roles.data?.roles || []);
        form.clearErrors();
        setOpen(true);
    }

    async function update() {
        const result = await form.trigger();
        if (!result) {
            toast.error(t("form-validation"))
            return
        }
        //if(process.env.NEXT_PUBLIC_EDITABLE==="false") return;
        try {
            const res = await request('updateAdmin', {
                id: form.getValues().id,
                avatar: form.getValues().avatar,
                name: form.getValues().name,
                email: form.getValues().email,
                tele: form.getValues().tele.iso + " " + form.getValues().tele.code + ' ' + form.getValues().tele.number,
                address: form.getValues().address,
                password: form.getValues().password,
                roles: form.getValues().roles,
            });
            if (res.result == 0) {
                toast.success(t(res.message))
                setOpen(false)
                get()
            } else {
                toast.error(t(res.message))
            }
        } catch (error) {
            toast.error(t("fail"));
        }
    }

    async function handleDelete(id: number) {
        delId.current = id;
        setDelOpen(true);
    }

    const del = useCallback(async () => {
        //if(process.env.NEXT_PUBLIC_EDITABLE==="false") return;
        const res = await request('deleteAdmin', {
            id: delId.current
        });

        if (res.result != 0 || !res.data) {
            setDelOpen(false);
            toast.error(t(res.message))
            return
        }

        get();
        setDelOpen(false);
        toast.success(t(res.message))
    }, [get, setDelOpen, request, toast]);

    const toPage = useCallback(async (pageIndex: number) => {
        setPageIndex(pageIndex);
    }, [setPageIndex]);

    const changePageSize = useCallback((pageSize: number) => {
        setPageSize(pageSize);
        setPageIndex(1);
    }, [setPageIndex, setPageSize]);

    const columns: ColumnDef<AdminModel>[] = [
        {
            accessorKey: "name",
            header: t("admin"),
            cell: ({ row }) => (
                <div className="flex items-center block truncate">
                    <Avatar className="rounded-full">
                        <AvatarImage src={row.original.avatar} />
                        <AvatarFallback>
                            <AvatarImage src="/unAuth.png" />
                        </AvatarFallback>
                    </Avatar>
                    <span className="ml-2">{row.original.name}</span>
                </div>
            ),
            meta: { className: "min-w-[200px] text-left" },
        },
        {
            accessorKey: "email",
            header: t("email"),
            cell: ({ row }) => (
                <span>{row.original.email}</span>
            ),
            meta: { className: "min-w-[200px] text-left" },
        },
        {
            accessorKey: "tele",
            header: t("tele"),
            cell: ({ row }) => (
                <span>{row.original.tele.split(" ").slice(1).join(' ')}</span>
            ),
            meta: { className: "min-w-[100px] text-left" },
        },
        {
            accessorKey: "address",
            header: t("address"),
            cell: ({ row }) => (
                <span>{row.original.address}</span>
            ),
            meta: { className: "flex-1 text-left" },
        },
        {
            id: "actions",
            header: t("actions"),
            cell: ({ row }) => {
                if (row.original.id !== 1) {
                    return (
                        <>
                            <Button variant="outline" className="ml-2" size="sm" onClick={() => handleUpdate(row.original)}>
                                <Pencil />
                                <span className="hidden lg:inline">{t("update")}</span>
                            </Button>
                            <Button variant="outline" className="ml-2" size="sm" onClick={() => handleDelete(row.original.id)}>
                                <Trash2 />
                                <span className="hidden lg:inline">{t("delete")}</span>
                            </Button>
                        </>
                    )
                }
            },
            meta: { className: "min-w-[180px] text-left" },
        },
    ]

    useEffect(() => {
        get()
    }, [pageIndex, pageSize]);

    return (
        <>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <div className="flex px-4 lg:px-6">
                            <Input type="text" placeholder={t("name")} className="w-40 h-8 text-sm" onChange={(e) => setName(e.target.value)} />
                            <Button variant="outline" className="ml-2" size="sm" onClick={get}>
                                <Search />
                                <span className="hidden lg:inline">{t("query")}</span>
                            </Button>
                            <Button variant="outline" className="ml-2" size="sm" onClick={handleInsert}>
                                <Plus />
                                <span className="hidden lg:inline">{t("add-new")}</span>
                            </Button>
                        </div>
                        <DataTable<AdminModel> ref={tableRef} columns={columns} datas={list} />
                        <DataPagination totalRow={totalRow} pageIndex={pageIndex} pageSize={pageSize} toPage={toPage} changePageSize={changePageSize} />
                    </div>
                </div>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Admin</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <AvatarField name="avatar" label={t('avatar')} catalog="admin" />
                            </div>
                            <div className="grid gap-3">
                                <TextField name="name" label={t('name')} placeholder={t('enter-name')} />
                            </div>
                            <div className="grid gap-3">
                                <TextField name="email" label={t('email')} type="email" placeholder={t('enter-email')} />
                            </div>
                            <div className="grid gap-3">
                                <PhoneField name="tele" label={t('tele')} />
                            </div>
                            <div className="grid gap-3">
                                <TextField name="address" label={t('address')} placeholder={t('enter-address')} />
                            </div>
                            <div className="grid gap-3">
                                <TextField name="password" label={t('password')} placeholder={form.getValues().id !== 0 ? t('no-modify') : ''} />
                            </div>
                            <div className="grid gap-3">
                                <CheckboxItemsField name="roles" label={t("role-list")} items={roles} />
                            </div>
                        </div>
                    </Form>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">{t('cancel')}</Button>
                        </DialogClose>
                        <Button type="button" onClick={form.getValues().id === 0 ? insert : update}>{t('save')}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <DeleteConfirmDialog open={delOpen} onConfirm={() => { del(); }} onClose={() => { setDelOpen(false) }} />
        </>
    );
}