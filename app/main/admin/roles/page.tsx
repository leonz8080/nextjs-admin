"use client";

import * as React from "react"
import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from 'react';

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
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { DataTable, DataPagination, DataTableRef } from "@/components/layout/data-table"
import { DeleteConfirmDialog } from "@/components/common/delete-confirm-dialog"
import { Permission } from "@/config/permission"

import { request } from "@/lib/client/utils"

interface Role {
    id: number;
    name: string;
    permissions: string[];
}

export default function Roles() {
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

    const schema = z.object({
        id: z.number(),
        name: z.string().min(1, "名称必填"),
        permissions: z.array(z.string()).refine((value) => value.some((item) => item), {
            message: "You have to select at least one item.",
        }),
    });

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
            toast.error("Fail.")
            return
        }

        try {
            var res = await request('insertRole', form.getValues());
            if (res.result == 0) {
                toast.success(res.message)
                setOpen(false)
                get()
            } else {
                toast.error(res.message)
            }
        } catch (error) {
            console.error("failed", error);
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
            toast.error("Fail.")
            return
        }

        try {
            var res = await request('updateRole', form.getValues());
            if (res.result == 0) {
                toast.success(res.message)
                setOpen(false)
                get()
            } else {
                toast.error(res.message)
            }
        } catch (error) {
            console.error("failed", error);
        }
    }

    async function handleDelete(id: number) {
        delId.current = id;
        setDelOpen(true);
    }

    async function del() {
        var res = await request('deleteRole', {
            id: delId.current
        });
        
        if (res.result != 0 || !res.data) {
            setDelOpen(false);
            toast.error(res.message)
            return
        }

        get();
        setDelOpen(false);
        toast.success(res.message)
    }

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
            header: "Name",
            cell: ({ row }) => (
                <span className="block truncate">{row.original.name}</span>
            ),
            meta: { className: "w-full text-left" },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <>
                    <Button variant="outline" className="ml-2" size="sm" onClick={() => handleUpdate(row.original)}>
                        <Pencil />
                        <span className="hidden lg:inline">Update</span>
                    </Button>
                    <Button variant="outline" className="ml-2" size="sm" onClick={() => handleDelete(row.original.id)}>
                        <Trash2 />
                        <span className="hidden lg:inline">Delete</span>
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
                            <Input type="text" placeholder="Name" className="w-40 h-8 text-sm" onChange={(e) => setName(e.target.value)} />
                            <Button variant="outline" className="ml-2" size="sm" onClick={get}>
                                <Search />
                                <span className="hidden lg:inline">Query</span>
                            </Button>
                            <Button variant="outline" className="ml-2" size="sm" onClick={handleInsert}>
                                <Plus />
                                <span className="hidden lg:inline">Add New</span>
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
                        <DialogTitle>Edit Role</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input type="text" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid gap-3">
                                <div>
                                    <FormLabel className="text-sm">Permission List</FormLabel>
                                </div>
                                {Permission.map((item) => (
                                    <FormField
                                        key={item.key}
                                        control={form.control}
                                        name="permissions"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="flex items-center gap-3">
                                                        <Checkbox
                                                            checked={field.value?.includes(item.key)}
                                                            onCheckedChange={(checked) => {
                                                                return checked
                                                                    ? field.onChange([...field.value, item.key])
                                                                    : field.onChange(
                                                                        field.value?.filter(
                                                                            (value) => value !== item.key
                                                                        )
                                                                    )
                                                            }}
                                                        />
                                                        <Label>{item.name}</Label>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    </Form>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="button" onClick={operTyp === 'insert' ? insert : update}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <DeleteConfirmDialog open={delOpen} onConfirm={() => {del();}} onClose={() => { setDelOpen(false) }} />
        </>
    );
}