"use client";

import { SalesGauge } from "./sales-gauge";
import { SalesChart, ChartDataModel } from "./sales-chart";
import { SalesCard, CardDataModel } from "./sales-card";
import { CsatGauge } from "./csat-gauge";
import { CsatRadar } from "./csat-radar";
import { MarketPie, PieDataModel } from "./market-pie";

import {
    Card,
} from "@/components/ui/card"

export default function SalesAnalysis() {

    const salesTotal: CardDataModel = {
        title: 'Sales Revenue',
        amount: '$116,952.13',
        mtm: 2.3,
        yty: 5.6
    }

    const orderTotal: CardDataModel = {
        title: 'Order Count',
        amount: '1,276',
        mtm: -3.4,
        yty: -6
    }

    const userTotal: CardDataModel = {
        title: 'Customer Count',
        amount: '1,130',
        mtm: 5.6,
        yty: 9
    }

    const aov: CardDataModel = {
        title: 'AOV',
        amount: '91.66',
        mtm: 6.7,
        yty: 8.3
    }

    const salesChart: ChartDataModel[] = [
        { month: '2024.9', sales: 101543, vipSales: 50346 },
        { month: '2024.10', sales: 126364, vipSales: 62985 },
        { month: '2024.11', sales: 100453, vipSales: 40378 },
        { month: '2024.12', sales: 125679, vipSales: 41293 },
        { month: '2025.1', sales: 142560, vipSales: 40211 },
        { month: '2025.2', sales: 98432, vipSales: 37624 },
        { month: '2025.3', sales: 124589, vipSales: 52748 },
        { month: '2025.4', sales: 110386, vipSales: 50122 },
        { month: '2025.5', sales: 132807, vipSales: 61809 },
        { month: '2025.6', sales: 104789, vipSales: 46097 },
        { month: '2025.7', sales: 96236, vipSales: 42110 },
        { month: '2025.8', sales: 94790, vipSales: 40159 },
        { month: '2025.9', sales: 104673, vipSales: 50981 },
        { month: '2025.10', sales: 106832, vipSales: 49123 },
    ]

    const csatGauge: number = 0.8;
    const csatRadar: number[] = [90, 75, 73, 60, 85];

    const pieData: PieDataModel[] = [
        { value: 39, name: 'Competitor A' },
        { value: 32, name: 'Competitor B' },
        { value: 21, name: 'Competitor C' },
        { value: 18, name: 'Own' }
    ]


    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2 py-6 px-6">
                <div className="grid auto-rows-min gap-4 grid-cols-3 ">
                    <SalesCard data={salesTotal} />
                    <SalesCard data={orderTotal} />
                    <SalesCard data={userTotal} />
                </div>
                <div className="flex auto-rows-min gap-4 mt-4">
                    <Card className="@container/card w-66 h-66 py-0 px-0">
                        <SalesGauge />
                    </Card>
                    <Card className="@container/card flex-1 py-0 px-0">
                        <SalesChart data={salesChart} />
                    </Card>
                </div>
                <div className="flex auto-rows-min gap-4 mt-4">
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
    )
}