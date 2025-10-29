"use client";

import * as React from "react"
import { useForm } from "react-hook-form";
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

import {
    Search,
    Trash2,
    Plus,
    Pencil,
    type LucideIcon,
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
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { DataTable, DataPagination, DataTableRef } from "@/components/common/data-table"
import { DeleteConfirmDialog } from "@/components/common/delete-confirm-dialog"
import { Permission } from "@/config/permission"

import { CheckboxItemsField, TextField, CommandField, TextareaField } from "@/components/common/form-field";
import { request } from "@/lib/client/utils"

import { useTranslations } from 'next-intl';

interface Role {
    id: number;
    name: string;
    permissions: string[];
}

export default function Roles() {
    const t = useTranslations();
    const Permissiont = Permission.map((item: { id: string; name: string }) => ({
        ...item,
        name: t(item.name)
    }));

    const [totalRow, setTotalRow] = useState(0);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [list, setList] = useState([]);

    const [name, setName] = useState("");
    const [open, setOpen] = React.useState(false);
    const [operTyp, setOperTyp] = useState("insert");
    const [delOpen, setDelOpen] = React.useState(false);
    var delId = React.useRef(0);

    const tableRef = useRef<DataTableRef<Role>>(null);

    const schema = useMemo(() => z.object({
        id: z.number(),
        name: z.string().min(1, t("name-is-required")),
        permissions: z.array(z.string()).refine((value) => value.some((item) => item), {
            message: t("select-min"),
        }),
    }), [t]);

    type FormData = z.infer<typeof schema>;

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            id: 0,
            name: "",
            permissions: []
        },
    });

    async function get() {
        var res = await request('getRoles', {
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

    function handleInsert() {
        form.setValue("id", 0);
        form.setValue("name", '');
        form.setValue("permissions", []);
        setOperTyp('insert');
        setOpen(true);
    }

    async function insert() {
        const result = await form.trigger();
        if (!result) {
            toast.error(t("form-validation"))
            return
        }

        try {
            var res = await request('insertRole', form.getValues());
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

    async function handleUpdate(role: Role) {
        form.setValue("id", role.id);
        form.setValue("name", role.name);
        var res = await request('getRolePermission', { id: role.id });
        form.setValue("permissions", res.data?.permissions || []);
        setOperTyp('update');
        setOpen(true);
    }

    async function update() {
        const result = await form.trigger();
        if (!result) {
            toast.error(t("form-validation"))
            return
        }

        try {
            var res = await request('updateRole', form.getValues());
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
        var res = await request('deleteRole', {
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
    }, [get, setDelOpen, toast]);

    function toPage(pageIndex: number): void {
        setPageIndex(pageIndex);
        get();
    }

    function changePageSize(pageSize: number): void {
        setPageSize(pageSize);
        setPageIndex(1);
        get();
    }

    const columns: ColumnDef<Role>[] = [
        {
            accessorKey: "name",
            header: t('name'),
            cell: ({ row }) => (
                <span className="block truncate">{row.original.name}</span>
            ),
            meta: { className: "w-full text-left" },
        },
        {
            id: "actions",
            header: t('actions'),
            cell: ({ row }) => (
                <>
                    <Button variant="outline" className="ml-2" size="sm" onClick={() => handleUpdate(row.original)}>
                        <Pencil />
                        <span className="hidden lg:inline">{t('update')}</span>
                    </Button>
                    <Button variant="outline" className="ml-2" size="sm" onClick={() => handleDelete(row.original.id)}>
                        <Trash2 />
                        <span className="hidden lg:inline">{t('delete')}</span>
                    </Button>
                </>
            ),
        },
    ]

    useEffect(() => {
        get()
    }, []);

    return (
        <>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <div className="flex px-4 lg:px-6">
                            <Input type="text" placeholder={t('enter-name')} className="w-40 h-8 text-sm" onChange={(e) => setName(e.target.value)} />
                            <Button variant="outline" className="ml-2" size="sm" onClick={get}>
                                <Search />
                                <span className="hidden lg:inline">{t('query')}</span>
                            </Button>
                            <Button variant="outline" className="ml-2" size="sm" onClick={handleInsert}>
                                <Plus />
                                <span className="hidden lg:inline">{t('add-new')}</span>
                            </Button>
                        </div>
                        <DataTable<Role> ref={tableRef} columns={columns} datas={list} />
                        <DataPagination totalRow={totalRow} pageIndex={pageIndex} pageSize={pageSize} toPage={toPage} changePageSize={changePageSize} />
                    </div>
                </div>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('edit-role')}</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <TextField name="name" label={t('name')} className="w-80" placeholder={t('enter-name')} />
                            </div>
                            <div className="grid gap-3">
                                <CheckboxItemsField label={t("permission-list")} name="permissions" items={Permissiont} />
                            </div>
                        </div>
                    </Form>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">{t("cancel")}</Button>
                        </DialogClose>
                        <Button type="button" onClick={operTyp === 'insert' ? insert : update}>{t("save")}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <DeleteConfirmDialog open={delOpen} onConfirm={() => { del(); }} onClose={() => { setDelOpen(false) }} />
        </>
    );
}