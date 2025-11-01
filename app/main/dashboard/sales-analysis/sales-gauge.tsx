"use client"

import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';

type EChartsOption = echarts.EChartsOption;

import { useTranslations } from 'next-intl';

export function SalesGauge() {
    const t = useTranslations();

    let option: EChartsOption;
    option = {
        title: {
            text: t("annual-sales-rate"),
            left: 'center',
            padding: [225, 0, 0, 0],
            textStyle: {
                fontSize: 14
            }
        },
        series: [
            {
                type: 'gauge',
                center: ['50%', '48%'],
                progress: {
                    show: true,
                    width: 9
                },
                axisLine: {
                    lineStyle: {
                        width: 9
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    length: 7,
                    distance: 6,
                    lineStyle: {
                        width: 1,
                        color: '#999'
                    }
                },
                axisLabel: {
                    distance: 12,
                    color: '#999',
                    fontSize: 12
                },
                anchor: {
                    show: true,
                    showAbove: true,
                    size: 12,
                    itemStyle: {
                        borderWidth: 5
                    }
                },
                title: {
                    show: true
                },
                detail: {
                    valueAnimation: true,
                    fontSize: 20,
                    offsetCenter: [0, '70%']
                },
                data: [
                    {
                        value: 70
                    }
                ]
            }
        ]
    };

    return (
        <ReactECharts option={option} style={{ width: "100%", height: "100%" }} />
    )
}