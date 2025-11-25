"use client"

import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';

type EChartsOption = echarts.EChartsOption;

import { useTranslations } from 'next-intl';

export function SalesChart({ data }: { data: Record<string, string | number>[] }) {
    const t = useTranslations();

    const month: string[] = [];
    const sales: number[] = [];
    const vipSales: number[] = [];

    data.forEach(v => {
        month.push(String(v.month));
        sales.push(Number(v.sales));
        vipSales.push(Number(v.vipSales));
    });

    const rawData = [
        sales,
        vipSales
    ];
    const series: echarts.SeriesOption[] = [
        t("customers"),
        t("VIP-customers")
    ].map((name, sid) => {
        return {
            name,
            type: 'bar',
            stack: 'total',
            barWidth: '50%',
            data: rawData[sid].map((d, did) => {
                if (sid == 1)
                    return {
                        value: d,
                        itemStyle: {
                            borderRadius: [20, 20, 0, 0]
                        }
                    };
                return {
                    value: d
                };
            })
        };
    });

    const option: EChartsOption = {
        title: {
            text: t("monthly-sales"),
            left: 'center',
            padding: [20, 0, 0, 0],
            textStyle: {
                fontSize: 14
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            top: 50,
            right: 50,
            bottom: 45,
            left: 80
        },
        xAxis: {
            type: 'category',
            data: month
        },
        yAxis: {
            type: 'value'
        },
        series: series
    };

    return (
        <ReactECharts option={option} style={{ width: "100%", height: "100%" }} />
    )
}