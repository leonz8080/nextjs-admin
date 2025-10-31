"use client";

import { useState, useEffect, useRef } from 'react';

import { SalesGauge } from "./sales-gauge";
import { SalesChart, ChartDataModel } from "./sales-chart";
import { SalesCard, CardDataModel } from "./sales-card";
import { CsatGauge } from "./csat-gauge";
import { CsatRadar } from "./csat-radar";
import { MarketPie, PieDataModel } from "./market-pie";

import {
    Card,
} from "@/components/ui/card"

import { request } from "@/lib/client/utils"

import { useTranslations } from 'next-intl';

export default function SalesAnalysis() {
    const t = useTranslations();

    const [salesChart, setSalesChart] = useState<ChartDataModel[]>([]);

    const salesTotal: CardDataModel = {
        title: t("sales-revenue"),
        amount: '$116,952.13',
        mtm: 2.3,
        yty: 5.6
    }

    const orderTotal: CardDataModel = {
        title: t("order-count"),
        amount: '1,276',
        mtm: -3.4,
        yty: -6
    }

    const userTotal: CardDataModel = {
        title: t("customer-count"),
        amount: '1,130',
        mtm: 5.6,
        yty: 9
    }

    const aov: CardDataModel = {
        title: t("average-order-value"),
        amount: '91.66',
        mtm: 6.7,
        yty: 8.3
    }

    const csatGauge: number = 0.8;
    const csatRadar: number[] = [90, 75, 73, 60, 85];

    const pieData: PieDataModel[] = [
        { value: 39, name: t("competitor") + ' A' },
        { value: 32, name: t("competitor") + ' B' },
        { value: 21, name: t("competitor") + ' C' },
        { value: 18, name: t("own") }
    ]

    async function get() {
        var res = await request('easyQuery', {
            querys: [
                {
                    name: 'getMonthSaleAddUp',
                    params: {
                        start: '2024.08',
                    }
                }
            ]
        });

        if (res.result != 0 || !res.data) {
            return
        }

        if (res.data.getMonthSaleAddUp.result !== 1) {
            setSalesChart(res.data.getMonthSaleAddUp.data);
        }
    }

    useEffect(() => {
        get();
    }, []);

    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-1 @4xl/main:grid-cols-3">
                        <SalesCard data={salesTotal} />
                        <SalesCard data={orderTotal} />
                        <SalesCard data={userTotal} />
                    </div>
                    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-1 @4xl/main:flex">
                        <Card className="@container/card w-66 h-66 py-0 px-0">
                            <SalesGauge />
                        </Card>
                        <Card className="@container/card flex-1 h-66 py-0 px-0">
                            <SalesChart data={salesChart} />
                        </Card>
                    </div>
                    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-1 @4xl/main:flex">
                        <Card className="@container/card w-66 h-66 py-0 px-0">
                            <CsatGauge data={csatGauge} />
                        </Card>
                        <Card className="@container/card w-80 h-66 py-0 px-0">
                            <CsatRadar data={csatRadar} />
                        </Card>
                        <Card className="@container/card flex-1 h-66 py-0 px-0">
                            <MarketPie data={pieData} />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}