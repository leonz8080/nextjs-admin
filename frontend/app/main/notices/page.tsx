"use client";

import * as React from "react"
import { useState, useEffect, useRef, useCallback } from 'react';

import {
    Search,
} from "lucide-react";
import {
    ColumnDef,
} from "@tanstack/react-table"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { useNoticeStore } from "@/hooks/use-global-store";
import { DataTable, DataPagination, DataTableRef } from "@/components/common/data-table"
import { request } from "@/lib/client/utils"
import { NoticeModel, PageModel } from "@/lib/models"

import { useTranslations } from 'next-intl';

export default function Notices() {
    const t = useTranslations();

    const { setHasNews } = useNoticeStore();

    const [totalRow, setTotalRow] = useState(0);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [list, setList] = useState<NoticeModel[]>([]);

    const [name, setName] = useState("");

    const tableRef = useRef<DataTableRef<NoticeModel>>(null);

    async function get() {
        const res = await request<PageModel<NoticeModel>>('getNotices', {
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
        setHasNews(false)
    }

    const toPage = useCallback(async (pageIndex: number) => {
        setPageIndex(pageIndex);
        get();
    }, [get, setPageIndex]);

    const changePageSize = useCallback((pageSize: number) => {
        setPageSize(pageSize);
        setPageIndex(1);
        get();
    }, [get, setPageIndex, setPageSize]);

    const columns: ColumnDef<NoticeModel>[] = [
        {
            accessorKey: "name",
            header: t("title"),
            cell: ({ row }) => (
                <div className="flex items-center block truncate">
                    <Avatar className="rounded-full">
                        <AvatarImage src={row.original.avatar} />
                        <AvatarFallback>
                            <AvatarImage src="/unAuth.png" />
                        </AvatarFallback>
                    </Avatar>
                    <span className="ml-2">{row.original.title}</span>
                </div>
            )
        },
        {
            accessorKey: "content",
            header: t("content"),
            cell: ({ row }) => (
                <span className="block truncate">{row.original.content}</span>
            ),
            meta: { className: "w-full text-left" },
        },
        {
            accessorKey: "createAt",
            header: t("create-at"),
            cell: ({ row }) => (
                <span>{row.original.createAt}</span>
            ),
        },
    ]

    useEffect(() => {
        get()
    }, [pageIndex, pageSize]);

    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <div className="flex px-4 lg:px-6">
                        <Input type="text" placeholder={t("name")} className="w-40 h-8 text-sm" onChange={(e) => setName(e.target.value)} />
                        <Button variant="outline" className="ml-2" size="sm" onClick={get}>
                            <Search />
                            <span className="hidden lg:inline">{t("query")}</span>
                        </Button>
                    </div>
                    <DataTable<NoticeModel> ref={tableRef} columns={columns} datas={list} />
                    <DataPagination totalRow={totalRow} pageIndex={pageIndex} pageSize={pageSize} toPage={toPage} changePageSize={changePageSize} />
                </div>
            </div>
        </div>
    );
}