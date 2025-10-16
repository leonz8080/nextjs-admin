"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Bell
} from "lucide-react"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { NavA } from "@/components/common/nav-wrap"
import { request } from "@/lib/client/utils"
import { useNoticeStore } from "@/hooks/use-global-store";

interface Notice {
    id: number;
    avatar: string;
    title: string;
    content: string;
}

export function Notice() {
    const { hasNews, setHasNews } = useNoticeStore();
    const [notices, setNotices] = useState<Notice[]>([]);
    const [open, setOpen] = useState(false);

    async function get() {
        var res = await request('getNewNotices', {});
        if (res.result != 0 || !res.data) {
            setNotices([])
            return
        }

        for(var i = 0; i < res.data.list.length; i++) {
            if(res.data.list[i].content.length > 20) {
                res.data.list[i].content = res.data.list[i].content.substring(0, 20) + '...'
            }
        }

        setNotices(prev => {
            if (!res.data) {
                return [];
            }

            if (res.data.list.length > 0 && prev.length > 0) {
                if (res.data.list[0].id > prev[0].id) {
                    setHasNews(true);
                    return res.data.list;
                }
            }

            if (prev.length === 0 && res.data.list.length > 0) {
                setHasNews(true);
                return res.data.list;
            }

            return prev; 
        });
    }

    useEffect(() => {
        get();
        const interval = setInterval(() => {
            get()
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Popover
            open={open}
            onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (isOpen) {
                    setHasNews(false);
                }
            }}
        >
            <PopoverTrigger asChild>
                <Button variant="ghost" className="md:size-7 rounded-full relative cursor-pointer">
                    <Bell className="md:size-5" />
                    {hasNews && <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full translate-x-1/2 -translate-y-1/2" />}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60">
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        {
                            notices.map((v, i) => {
                                return (
                                    <div key={i} className="flex items-center space-x-4">
                                        <Avatar className="rounded-full w-8 h-8">
                                            <AvatarImage src={v.avatar} />
                                            <AvatarFallback>
                                                <AvatarImage src="/unAuth.png" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="">
                                            <div className="text-sm">
                                                {v.title}
                                            </div>
                                            <div className="truncate text-xs text-muted-foreground">
                                                {v.content}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="space-y-1">
                        <Button className="w-full text-xs">
                            <NavA navKey="/notice">
                                View All Notification
                            </NavA>
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
