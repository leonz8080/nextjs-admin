"use client";

import * as React from "react"
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useForm } from "react-hook-form";

import {
    IconCircleCheckFilled,
    IconPlus,
    IconLoader,
} from "@tabler/icons-react"
import {
    Search,
    Trash2,
    ArrowDownToLine,
    Plus,
    type LucideIcon,
} from "lucide-react";
import {
    ColumnDef,
} from "@tanstack/react-table"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"

import { DeleteConfirmDialog } from "@/components/common/delete-confirm-dialog"
import { DataTable, DataPagination, DataTableRef } from "@/components/common/data-table"

import { Form } from "@/components/ui/form";
import { number, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { DataTimeCell, SelectCell, InputCell } from "@/components/common/table-cell";
import { DatePickerField, SelectField, AvatarField, TextField, SwitchField } from "@/components/common/form-field";

import { request, download } from "@/lib/client/utils"

import { useTranslations } from 'next-intl';

interface User {
    id: number;
    avatar: string;
    name: string;
    level: string;
    expiration: string;
    isValid: number;
    remark: string;
    status: string;
}

export default function Users() {
    const t = useTranslations();

    const userLevel = ['silver', 'gold', 'diamond'];

    const [totalRow, setTotalRow] = useState(0);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [list, setList] = useState([]);

    const [level, setLevel] = useState("");
    const [name, setName] = useState("");

    const [insertOpen, setInsertOpen] = React.useState(false);

    const [delOpen, setDelOpen] = React.useState(false);
    var delIds = React.useRef<number[]>([]);

    const tableRef = useRef<DataTableRef<User>>(null);

    const schema = useMemo(() => z.object({
        id: z.number(),
        avatar: z.string(),
        name: z.string().min(1, t("name-is-required")),
        level: z.string().min(1, t("level-is-required")),
        expiration: z.string().min(1, t("expiration-is-required")),
        isValid: z.number(),
        remark: z.string(),
        status: z.string()
    }), [t]);

    type FormData = z.infer<typeof schema>;

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            id: 0,
            avatar: "",
            name: "",
            level: "silver",
            expiration: "",
            isValid: 0,
            remark: "",
            status: "offline"
        },
    });

    async function get() {
        var res = await request('getUsers', {
            level: level,
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
        form.reset({
            id: 0,
            avatar: "",
            name: "",
            level: "silver",
            expiration: dayjs().add(30, 'day').format("YYYY-MM-DD"),
            isValid: 1,
            remark: "",
            status: "offline"
        });
        setInsertOpen(true);
    }

    async function insert() {
        const result = await form.trigger();
        if (!result) {
            toast.error(t("form-validation"))
            return
        }

        try {
            var res = await request('insertUser', form.getValues());
            if (res.result == 0) {
                toast.success(t(res.message))
                setInsertOpen(false)
                get()
            } else {
                toast.error(t(res.message))
            }
        } catch (error) {
            toast.error(t("fail"));
        }
    }

    const update = useCallback( async (id: number, column: string, value: number | string) => {
        var res = await request('updateUser', {
            id: id,
            column: column,
            value: value
        });

        get()

        if (res.result != 0 || !res.data) {
            toast.error(t(res.message))
            return
        }
        toast.success(t(res.message))
    }, [get, request, toast]);

    async function handleDelete(id: number) {
        delIds.current = [id];
        setDelOpen(true);
    }

    async function handleDeletes() {
        const selected = tableRef.current?.getSelectedRows() || [];
        var ids: number[] = [];
        selected.map((v, i) => (
            ids.push(v.id)
        ))
        delIds.current = ids;
        setDelOpen(true);
    }

    const del = useCallback(async () => {
        var res = await request('deleteUsers', {
            id: delIds.current
        });

        if (res.result != 0 || !res.data) {
            setDelOpen(false);
            toast.error(t(res.message))
            return
        }
        setDelOpen(false);
        toast.success(t(res.message))
    }, [get, setDelOpen, toast]);

    const toPage = useCallback(async () => {
        setPageIndex(pageIndex);
        get();
    }, [get, setPageIndex]);

    const changePageSize = useCallback((pageSize: number) => {
        setPageSize(pageSize);
        setPageIndex(1);
        get();
    }, [get, setPageIndex, setPageSize]);

    function downloadExcel() {
        download('exportUsers', 'user.xlsx', {
            level: level,
            name: name
        })
    }

    const columns: ColumnDef<User>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && "indeterminate")
                        }
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label={t("select-all")}
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label={t("select-row")}
                    />
                </div>
            ),
        },
        {
            accessorKey: "user",
            header: t("user"),
            cell: ({ row }) => (
                <div className="flex items-center">
                    <Avatar className="rounded-full">
                        <AvatarImage src={row.original.avatar} />
                        <AvatarFallback>
                            <AvatarImage src="/unAuth.png" />
                        </AvatarFallback>
                    </Avatar>
                    <span className="ml-2">{row.original.name}</span>
                </div>
            ),
        },
        {
            accessorKey: "level",
            header: t("level"),
            cell: ({ row }) => (
                <SelectCell
                    id={row.original.id}
                    value={row.original.level}
                    options={userLevel}
                    className="w-30"
                    translate="all"
                    onUpdate={update}
                />
            ),
        },
        {
            accessorKey: "expiration",
            header: t("expiration-date"),
            cell: ({ row }) => {
                return (
                    <DataTimeCell
                        id={row.original.id}
                        value={row.original.expiration}
                        onUpdate={update}
                    />
                )
            },
        },
        {
            accessorKey: "isValid",
            header: t("effective"),
            cell: ({ row }) => (
                <Switch
                    checked={row.original.isValid === 1}
                    onCheckedChange={(checked) => update(row.original.id, 'isValid', checked ? 1 : 0)}
                />
            ),
        },
        {
            accessorKey: "remark",
            header: () => <div className="w-full text-right">{t("remark")}</div>,
            cell: ({ row }) => (
                <InputCell
                    id={row.original.id}
                    value={row.original.remark}
                    className="w-30"
                    onUpdate={update}
                />
            ),
        },
        {
            accessorKey: "status",
            header: t("status"),
            cell: ({ row }) => (
                <Badge variant="outline" className="text-muted-foreground px-1.5">
                    {row.original.status === "online" ? (
                        <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
                    ) : (
                        <IconLoader />
                    )}
                    {t(row.original.status)}
                </Badge>
            ),
        },
        {
            id: "actions",
            header: t("actions"),
            cell: ({ row }) => (
                <Button variant="outline" className="ml-2" size="sm" onClick={() => handleDelete(row.original.id)}>
                    <Trash2 />
                    <span className="hidden lg:inline">{t("delete")}</span>
                </Button>
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
                            <Select defaultValue={''} onValueChange={(s) => setLevel(s)}>
                                <SelectTrigger size="sm">
                                    <SelectValue placeholder={t("user-level")} />
                                </SelectTrigger>
                                <SelectContent>
                                    {userLevel.map((item) => {
                                        return <SelectItem value={item}>{t(item)}</SelectItem>
                                    })}
                                </SelectContent>
                            </Select>
                            <Input type="text" placeholder={t("enter-name")} className="w-40 ml-2 h-8 text-sm" onChange={(e) => setName(e.target.value)} />
                            <Button variant="outline" className="ml-2" size="sm" onClick={get}>
                                <Search />
                                <span className="hidden lg:inline">{t("query")}</span>
                            </Button>
                            <Button variant="outline" className="ml-2" size="sm" onClick={handleInsert}>
                                <Plus />
                                <span className="hidden lg:inline">{t("add-new")}</span>
                            </Button>
                            <Button variant="outline" className="ml-2" size="sm" onClick={handleDeletes}>
                                <Trash2 />
                                <span className="hidden lg:inline">{t("delete")}</span>
                            </Button>
                            <Button variant="outline" className="ml-2" size="sm" onClick={downloadExcel}>
                                <ArrowDownToLine />
                                <span className="hidden lg:inline">{t("export-excel")}</span>
                            </Button>
                        </div>
                        <DataTable<User> ref={tableRef} columns={columns} datas={list} />
                        <DataPagination totalRow={totalRow} pageIndex={pageIndex} pageSize={pageSize} toPage={toPage} changePageSize={changePageSize} />
                    </div>
                </div>
            </div>
            <Dialog open={insertOpen} onOpenChange={setInsertOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("add-user")}</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <AvatarField name="avatar" label={t("avatar")} />
                            </div>
                            <div className="grid gap-3">
                                <TextField name="name" label={t("name")} placeholder={t("enter-name")} />
                            </div>
                            <div className="grid gap-3">
                                <SelectField
                                    name="level"
                                    label={t("level")}
                                    options={userLevel}
                                    placeholder={t("select-level")}
                                    translate="all"
                                />
                            </div>
                            <div className="grid gap-3">
                                <DatePickerField name="expiration" label={t("expiration-date")} />
                            </div>
                            <div className="grid gap-3">
                                <SwitchField name="isValid" label={t("effective")} />
                            </div>
                            <div className="grid gap-3">
                                <TextField name="remark" label={t("remark")} placeholder={t("enter-remark")} />
                            </div>
                        </div>
                    </Form>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">{t("cancel")}</Button>
                        </DialogClose>
                        <Button type="button" onClick={insert}>{t("save")}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <DeleteConfirmDialog open={delOpen} onConfirm={() => { del(); }} onClose={() => { setDelOpen(false) }} />
        </>
    );
}