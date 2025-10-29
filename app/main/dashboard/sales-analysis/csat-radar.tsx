"use client"

import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';

type EChartsOption = echarts.EChartsOption;

import { useTranslations } from 'next-intl';

export function CsatRadar({data} : {data: number[]}) {
    const t = useTranslations();

    var option: EChartsOption;
    option = {
        title: {
            text: t("customer-satisfaction-analysis"),
            left: 'center',
            padding: [225, 0, 0, 0],
            textStyle: {
                fontSize: 14
            }
        },
        radar: {
            // shape: 'circle',
            radius: '65%',
            center: ['45%', '50%'],
            indicator: [
                { name: t("product-quality"), max: 100 },
                { name: t("serve"), max: 100 },
                { name: t("logistics"), max: 100 },
                { name: t("after-sales"), max: 100 },
                { name: t("recommend"), max: 100 }
            ]
        },
        name: {
            show: true,
            color: '#464646',
            fontSize: 14,
            fontWeight: 'bold',
            borderRadius: 3,
            padding: [3, 3]
        },
        series: [
            {
                name: t("customer-satisfaction-analysis"),
                type: 'radar',
                data: [
                    {
                        value: data,
                        name: t("score")
                    }
                ]
            }
        ]
    };

    return (
        <ReactECharts option={option} style={{ width: "100%", height: "100%" }} />
    )
}