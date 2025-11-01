"use client"

import * as React from "react"

import { forwardRef, useImperativeHandle, useState } from "react";
import {
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
} from "@tabler/icons-react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { cn } from "@/lib/client/utils"

import { useTranslations } from 'next-intl';

export type DataTableProps<T> = {
    columns: ColumnDef<T>[];
    datas: T[];
};

export interface DataTableRef<T> {
    getSelectedRows: () => T[];
    clearSelection: () => void;
}

const DataTableInner = <T,>(
    { columns, datas }: DataTableProps<T>,
    ref: React.Ref<DataTableRef<T>>
) => {
    const t = useTranslations();

    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data: React.useMemo(() => datas, [datas]),
        columns,
        state: {
            rowSelection,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
    })

    useImperativeHandle(ref, () => ({
        getSelectedRows: () => table.getSelectedRowModel().rows.map(r => r.original),
        clearSelection: () => setRowSelection({}),
    }));

    return (
        <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
            <div className="overflow-hidden rounded-lg border">
                <Table>
                    <TableHeader className="bg-muted sticky top-0 z-10">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} colSpan={header.colSpan} className={cn(header.column.columnDef.meta?.className)}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="**:data-[slot=table-cell]:first:w-8">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className={cn(cell.column.columnDef.meta?.className)}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    {t("no-results")}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export const DataTable = forwardRef(DataTableInner) as <T>(
    props: DataTableProps<T> & { ref?: React.Ref<DataTableRef<T>> }
) => React.ReactElement | null;

export function DataPagination({
    totalRow,
    pageIndex,
    pageSize,
    toPage,
    changePageSize
}: {
    totalRow: number,
    pageIndex: number,
    pageSize: number,
    toPage: (pageIndex: number) => void,
    changePageSize: (pageSize: number) => void,
}) {
    const t = useTranslations();

    let pageCount = 0
    if (totalRow > 0) {
        pageCount = Math.floor(totalRow / pageSize) + 1
    }
    return (
        <div className="flex items-center justify-between px-4 lg:px-6">
            <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                {t("total")} {totalRow} {t("rows")}.
            </div>
            <div className="flex w-full items-center gap-8 lg:w-fit">
                <div className="hidden items-center gap-2 lg:flex">
                    <Label htmlFor="rows-per-page" className="text-sm font-medium">
                        {t("page-rows")}
                    </Label>
                    <Select
                        value={pageSize.toString()}
                        onValueChange={(value) => {
                            changePageSize(Number(value))
                        }}
                    >
                        <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                            <SelectValue
                                placeholder={pageSize}
                            />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-fit items-center justify-center text-sm font-medium">
                    {t("page")} {pageIndex} {t("of")}{" "}
                    {pageCount}
                </div>
                <div className="ml-auto flex items-center gap-2 lg:ml-0">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => toPage(1)}
                        disabled={pageIndex == 1}
                    >
                        <span className="sr-only">{t("to-first-page")}</span>
                        <IconChevronsLeft />
                    </Button>
                    <Button
                        variant="outline"
                        className="size-8"
                        size="icon"
                        onClick={() => toPage(pageIndex - 1)}
                        disabled={pageIndex == 1}
                    >
                        <span className="sr-only">{t("to-previous-page")}</span>
                        <IconChevronLeft />
                    </Button>
                    <Button
                        variant="outline"
                        className="size-8"
                        size="icon"
                        onClick={() => toPage(pageIndex + 1)}
                        disabled={pageIndex == pageCount}
                    >
                        <span className="sr-only">{t("to-next-page")}</span>
                        <IconChevronRight />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden size-8 lg:flex"
                        size="icon"
                        onClick={() => toPage(pageCount)}
                        disabled={pageIndex == pageCount}
                    >
                        <span className="sr-only">{t("to-last-page")}</span>
                        <IconChevronsRight />
                    </Button>
                </div>
            </div>
        </div>
    )
}