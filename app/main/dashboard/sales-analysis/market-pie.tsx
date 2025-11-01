"use client"

import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';

type EChartsOption = echarts.EChartsOption;

import { useTranslations } from 'next-intl';

export interface PieDataModel {
    name: string,
    value: number
}

export function MarketPie({data}: {data: PieDataModel[]}) {
    const t = useTranslations();

    const option: EChartsOption = {
        title: {
            text: t("market-share"),
            left: 'center',
            padding: [225, 0, 0, 0],
            textStyle: {
                fontSize: 16, 
                fontWeight: 'bold',
            }
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            itemGap: 15,
            padding: [70, 0, 0, 25]
        },
        series: [
            {
                name: t("market-share"),
                type: 'pie',
                radius: ['40%', '65%'],
                center: ['65%', '50%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 20,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: data
            }
        ]
    };

    return (
        <ReactECharts option={option} style={{ width: "100%", height: "100%" }} />
    )
}