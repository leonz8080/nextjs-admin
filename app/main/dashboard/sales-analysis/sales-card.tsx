"use client";

import {
    ArrowUp,
    ArrowDown,
    type LucideIcon,
} from "lucide-react";
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import type { TablerIcon } from "@tabler/icons-react";
import { useTranslations } from 'next-intl';

export interface CardDataModel {
    title: string,
    amount: string,
    mtm: number,
    yty: number
}

export function SalesCard({ data }: { data: CardDataModel }) {
    const t = useTranslations();

    var IconMtm: LucideIcon = ArrowUp;
    var colorMtm = 'text-green-600';
    if (data.mtm < 0) {
        IconMtm = ArrowDown;
        colorMtm = 'text-red-600';
    }

    var IconYty: LucideIcon = ArrowUp;
    var colorYty = 'text-green-600';
    if (data.yty < 0) {
        IconYty = ArrowDown;
        colorYty = 'text-red-600';
    }

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>{data.title}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {data.amount}
                </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                    <IconMtm className={`size-4 ${colorMtm}`} />
                    <span className={colorMtm}>{data.mtm}%</span>
                    Month-on-month
                </div>
                <div className="line-clamp-1 flex gap-2 font-medium">
                    <IconYty className={`size-4 ${colorYty}`} />
                    <span className={colorYty}>{data.yty}%</span>
                    Year-on-year
                </div>
                {/*<div className="text-muted-foreground">
                    Acquisition needs attention
                </div>*/}
            </CardFooter>
        </Card>
    )
}