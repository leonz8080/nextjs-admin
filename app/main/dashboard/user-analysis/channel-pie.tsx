"use client"

import { useMemo } from 'react';

import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';

type EChartsOption = echarts.EChartsOption;

import { useTranslations, useLocale } from 'next-intl';

export function ChannelPie({ data }: { data: Record<string, string | number>[] }) {
    const t = useTranslations();
    const locale = useLocale();

    const translatedData = useMemo(() => (
        data.map(item => ({
            ...item,
            name: t(String(item.name))
        }))
    ), [data, t, locale]);

    let option: EChartsOption;
    option = {
        title: {
            text: t("user-source"),
            left: 'left',
            padding: [30, 0, 0, 40],
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
            itemGap: 12,
            padding: [60, 0, 0, 40]
        },
        series: [
            {
                name: t("access-from"),
                type: 'pie',
                center: ['65%', '50%'],
                radius: ['0%', '80%'],
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
                data: translatedData
            }
        ]
    };

    return (
        <ReactECharts option={option} style={{ width: "100%", height: "100%" }} />
    )
}