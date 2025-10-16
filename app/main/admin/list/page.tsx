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
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { number, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { DataTable, DataPagination, DataTableRef } from "@/components/layout/data-table"
import AvatarUploader from "@/components/layout/avatar-uploader";
import { request } from "@/lib/client/utils"

interface Admin {
    id: number;
    avatar: string;
    name: string;
    password: string;
    roles: string[];
}

interface Role {
    id: number;
    name: string;
}

export default function AdminList() {
    const [totalRow, setTotalRow] = useState(0);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [list, setList] = useState([]);

    const [name, setName] = useState("");
    const [roles, setRoles] = useState<Role[]>([]);
    const [open, setOpen] = React.useState(false);
    const [operTyp, setOperTyp] = useState("insert");

    const tableRef = useRef<DataTableRef<Admin>>(null);

    const schema = z.object({
        id: z.number(),
        avatar: z.string(),
        name: z.string().min(1, "名称必填"),
        password: z.string().refine((val) => {
            if (operTyp === "insert" && val.length < 6) {
                return false;
            }
            return true;
        }, {
            message: "新建用户密码不能小于6位"
        }),
        roles: z.array(z.number()).refine((value) => value.some((item) => item), {
            message: "You have to select at least one item.",
        }),
    });

    type FormData = z.infer<typeof schema>;

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            id: 0,
            avatar: "",
            name: "",
            password: "",
            roles: []
        },
    });

    async function get() {
        var res = await request('getAdmins', {
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
        form.setValue("password", '');
        form.setValue("roles", []);
        var res = await request('getAllRoles', {});
        setRoles(res.data?.list || []);
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
            var res = await request('insertAdmin', form.getValues());
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

    async function handleUpdate(admin: Admin) {
        form.setValue("id", admin.id);
        form.setValue("name", admin.name);
        form.setValue("password", '');
        var res = await request('getAllRoles', {});
        setRoles(res.data?.list || []);
        var res = await request('getAdminRole', { id: admin.id });
        form.setValue("roles", res.data?.roles || []);
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
            var res = await request('updateAdmin', form.getValues());
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

    async function del(id: number) {
        var res = await request('deleteAdmin', {
            id: id
        });

        if (res.result != 0 || !res.data) {
            toast.error(res.message)
            return
        }

        get();
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

    const columns: ColumnDef<Admin>[] = [
        {
            accessorKey: "name",
            header: "Admin",
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
                    <Button variant="outline" className="ml-2" size="sm" onClick={() => del(row.original.id)}>
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
                        <DataTable<Admin> ref={tableRef} columns={columns} datas={list} />
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
                                <FormField
                                    control={form.control}
                                    name="avatar"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <AvatarUploader
                                                    value={field.value}
                                                    onChange={(url: string) => field.onChange(url)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
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
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} placeholder={operTyp === 'update' ? 'No need to modify' : ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid gap-3">
                                <div>
                                    <FormLabel className="text-sm">Role List</FormLabel>
                                </div>
                                {roles.map((item) => (
                                    <FormField
                                        key={item.id}
                                        control={form.control}
                                        name="roles"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="flex items-center gap-3">
                                                        <Checkbox
                                                            checked={field.value?.includes(item.id)}
                                                            onCheckedChange={(checked) => {
                                                                return checked
                                                                    ? field.onChange([...field.value, item.id])
                                                                    : field.onChange(
                                                                        field.value?.filter(
                                                                            (value) => value !== item.id
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
        </>
    );
}