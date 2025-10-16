"use client";

import * as React from "react"
import { useState, useEffect, useRef } from 'react';

import {
    IconCircleCheckFilled,
    IconPlus,
    IconLoader,
} from "@tabler/icons-react"
import {
    Search,
    Trash2,
    ArrowDownToLine,
    type LucideIcon,
} from "lucide-react";
import {
    ColumnDef,
} from "@tanstack/react-table"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"

import { DataTable, DataPagination, DataTableRef } from "@/components/layout/data-table"

import { number, z } from "zod";
import dayjs from "dayjs";

import { request, download } from "@/lib/client/utils"

const userLevel = ['silver', 'gold', 'diamond'];

function formatDate(date: Date | undefined) {
    if (!date) {
        return ""
    }
    return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
}

function isValidDate(date: Date | undefined) {
    if (!date) {
        return false
    }
    return !isNaN(date.getTime())
}

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
    const [totalRow, setTotalRow] = useState(0);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [list, setList] = useState([]);

    const [level, setLevel] = useState("");
    const [name, setName] = useState("");

    const tableRef = useRef<DataTableRef<User>>(null);

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

    async function update(id: number, column: string, value: number | string) {
        var res = await request('updateUsers', {
            id: id,
            column: column,
            value: value
        });

        get()

        if (res.result != 0 || !res.data) {
            toast.error(res.message)
            return
        }
        toast.success(res.message)
    }

    async function del(id: number[]) {
        var res = await request('deleteUsers', {
            id: id
        });

        if (res.result != 0 || !res.data) {
            toast.error(res.message)
            return
        }
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

    async function delSelect() {
        const selected = tableRef.current?.getSelectedRows() || [];
        console.log(selected);
        var ids: number[] = [];
        selected.map((v, i) => (
            ids.push(v.id)
        ))

        var res = await request('deleteUsers', {
            id: ids
        });

        if (res.result != 0 || !res.data) {
            toast.error(res.message)
            return
        }
        toast.success(res.message)
    }

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
                        aria-label="Select all"
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                </div>
            ),
        },
        {
            accessorKey: "user",
            header: "User",
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
            header: "Level",
            cell: ({ row }) => (
                <Select onValueChange={(value) => update(row.original.id, 'level', value)}>
                    <SelectTrigger
                        className="w-30 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                        size="sm"
                        id={`${row.original.id}-level`}
                    >
                        <SelectValue placeholder={row.original.level} />
                    </SelectTrigger>
                    <SelectContent align="end">
                        {userLevel.map((item) => {
                            return <SelectItem value={item}>{item}</SelectItem>
                        })}
                    </SelectContent>
                </Select>
            ),
        },
        {
            accessorKey: "expiration",
            header: "Expiration Date",
            cell: ({ row }) => {
                const [open, setOpen] = React.useState(false)
                const [date, setDate] = React.useState<Date | undefined>(
                    new Date(row.original.expiration)
                )
                const [month, setMonth] = React.useState<Date | undefined>(date)
                const [value, setValue] = React.useState(formatDate(date))

                return (
                    <div className="relative flex gap-2">
                        <Input
                            id="date"
                            value={value}
                            className="bg-background pr-6 h-8 text-sm w-48"
                            onChange={(e) => {
                                const date = new Date(e.target.value)
                                setValue(e.target.value)
                                if (isValidDate(date)) {
                                    setDate(date)
                                    setMonth(date)
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "ArrowDown") {
                                    e.preventDefault()
                                    setOpen(true)
                                }
                            }}
                        />
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date-picker"
                                    variant="ghost"
                                    className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                                >
                                    <CalendarIcon className="size-3.5" />
                                    <span className="sr-only">Select date</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto overflow-hidden p-0"
                                align="end"
                                alignOffset={-8}
                                sideOffset={10}
                            >
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    captionLayout="dropdown"
                                    month={month}
                                    onMonthChange={setMonth}
                                    onSelect={(date) => {
                                        setDate(date)
                                        setValue(formatDate(date))
                                        setOpen(false)
                                        date && update(row.original.id, 'expiration', dayjs(date).format("YYYY-MM-DD"))
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                )
            },
        },
        {
            accessorKey: "isValid",
            header: "Effective",
            cell: ({ row }) => (
                <Switch
                    checked={row.original.isValid === 1}
                    onCheckedChange={(checked) => update(row.original.id, 'isValid', checked ? 1 : 0)}
                />
            ),
        },
        {
            accessorKey: "remark",
            header: () => <div className="w-full text-right">Remark</div>,
            cell: ({ row }) => {
                const handleSubmit = (value: string) => {
                    if (value != row.original.remark) {
                        update(row.original.id, 'remark', value)
                    }
                }

                return (
                    <Input
                        className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-30 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
                        defaultValue={row.original.remark}
                        id={`${row.original.id}-remark`}
                        onBlur={(e) => handleSubmit(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSubmit(e.currentTarget.value)
                        }}
                    />
                )
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant="outline" className="text-muted-foreground px-1.5">
                    {row.original.status === "online" ? (
                        <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
                    ) : (
                        <IconLoader />
                    )}
                    {row.original.status}
                </Badge>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <Button variant="outline" className="ml-2" size="sm" onClick={() => del([row.original.id])}>
                    <Trash2 />
                    <span className="hidden lg:inline">Delete</span>
                </Button>
            ),
        },
    ]

    useEffect(() => {
        get()
    }, []);

    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <div className="flex px-4 lg:px-6">
                        <Select defaultValue={''} onValueChange={(s) => setLevel(s)}>
                            <SelectTrigger size="sm">
                                <SelectValue placeholder="User Level" />
                            </SelectTrigger>
                            <SelectContent>
                                {userLevel.map((item) => {
                                    return <SelectItem value={item}>{item}</SelectItem>
                                })}
                            </SelectContent>
                        </Select>
                        <Input type="text" placeholder="Name" className="w-40 ml-2 h-8 text-sm" onChange={(e) => setName(e.target.value)} />
                        <Button variant="outline" className="ml-2" size="sm" onClick={get}>
                            <Search />
                            <span className="hidden lg:inline">Query</span>
                        </Button>
                        <Button variant="outline" className="ml-2" size="sm" onClick={delSelect}>
                            <Trash2 />
                            <span className="hidden lg:inline">Delete</span>
                        </Button>
                        <Button variant="outline" className="ml-2" size="sm" onClick={downloadExcel}>
                            <ArrowDownToLine />
                            <span className="hidden lg:inline">Export Excel</span>
                        </Button>
                    </div>
                    <DataTable<User> ref={tableRef} columns={columns} datas={list} />
                    <DataPagination totalRow={totalRow} pageIndex={pageIndex} pageSize={pageSize} toPage={toPage} changePageSize={changePageSize} />
                </div>
            </div>
        </div>
    );
}