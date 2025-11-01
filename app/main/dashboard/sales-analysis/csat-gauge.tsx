"use client"

import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';

type EChartsOption = echarts.EChartsOption;

import { useTranslations } from 'next-intl';

export function CsatGauge({ data }: { data: number }) {
    const t = useTranslations();

    let option: EChartsOption;

    option = {
        title: {
            text: t("customer-satisfaction"),
            left: 'center',
            padding: [225, 0, 0, 0],
            textStyle: {
                fontSize: 14
            }
        },
        series: [
            {
                type: 'gauge',
                startAngle: 180,
                endAngle: 0,
                center: ['50%', '60%'],
                radius: '70%',
                min: 0,
                max: 1,
                splitNumber: 8,
                axisLine: {
                    lineStyle: {
                        width: 6,
                        color: [
                            [0.33, '#FF6E76'],
                            [0.66, '#58D9F9'],
                            [1, '#7CFFB2']
                        ]
                    }
                },
                pointer: {
                    icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                    length: '12%',
                    width: 10,
                    offsetCenter: [0, '-60%'],
                    itemStyle: {
                        color: 'auto'
                    }
                },
                axisTick: {
                    length: 6,
                    lineStyle: {
                        color: 'auto',
                        width: 1
                    }
                },
                splitLine: {
                    length: 10,
                    lineStyle: {
                        color: 'auto',
                        width: 2
                    }
                },
                axisLabel: {
                    color: '#464646',
                    fontSize: 10,
                    distance: -30,
                    rotate: 'tangential',
                    formatter: function (value) {
                        if (value === 0.875) {
                            return t("satisfied");
                        } else if (value === 0.5) {
                            return t("neutral");
                        } else if (value === 0.125) {
                            return t("dissatisfied");
                        }
                        return '';
                    }
                },
                title: {
                    offsetCenter: [0, '-10%'],
                    fontSize: 10
                },
                detail: {
                    fontSize: 15,
                    offsetCenter: [0, '-10%'],
                    valueAnimation: true,
                    formatter: function (value) {
                        return Math.round(value * 100) + '';
                    },
                    color: 'inherit'
                },
                data: [
                    {
                        value: data,
                    }
                ]
            }
        ]
    };

    return (
        <ReactECharts option={option} style={{ width: "100%", height: "100%" }} />
    )
}