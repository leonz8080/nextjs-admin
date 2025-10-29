"use client";

import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { useTranslations } from 'next-intl';

export interface CardDataModel {
    title: string,
    amount: string,
    unit: string,
    margin: number
}

export function UserCard({ data }: { data: CardDataModel }) {
    const t = useTranslations();
    
    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>{data.title}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {data.amount}
                </CardTitle>
                <CardAction>
                    <Badge variant="outline">
                        <IconTrendingDown />
                        {data.margin}%
                    </Badge>
                </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                    {data.margin < 0 ? t("down") + ' ' + (data.margin * -1) : t("up") + ' ' + data.margin}% {t("this")} {data.unit} {data.margin < 0 ? <IconTrendingDown className="size-4" /> : <IconTrendingUp className="size-4" />}
                </div>
                {/*<div className="text-muted-foreground">
                    Acquisition needs attention
                </div>*/}
            </CardFooter>
        </Card>
    )
}