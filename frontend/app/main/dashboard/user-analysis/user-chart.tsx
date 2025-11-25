"use client"

import * as echarts from 'echarts';
import { useEffect, useRef } from "react";
import ReactECharts from 'echarts-for-react';

type EChartsOption = echarts.EChartsOption;

import { useTranslations } from 'next-intl';

export function UserChart({ data }: { data: Record<string, string| number>[] }) {
    const t = useTranslations();

    const month: string[] = [];
    const news: number[] = [];
    const retains: number[] = [];
    const returnRate: number[] = [];

    data.forEach(v => {
        month.push(String(v.month));
        news.push(Number(v.news));
        retains.push(Number(v.retains));
        returnRate.push(Number(v.returnRate));
    });

    const option: EChartsOption = {
        grid: {
            top: 60,
            right: 80,
            bottom: 20,
            left: 80
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        toolbox: {
            feature: {
                //dataView: { show: true, readOnly: false },
                //magicType: { show: true, type: ['line', 'bar'] },
                //restore: { show: true },
                //saveAsImage: { show: true }
            }
        },
        legend: {
            data: [t("new-users"), t("retain-users"), t("returning-rate")]
        },
        xAxis: [
            {
                type: 'category',
                data: month,
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: t("new-users"),
                axisLabel: {
                    formatter: '{value} qty'
                }
            },
            {
                type: 'value',
                name: t("returning-rate"),
                axisLabel: {
                    formatter: '{value} %'
                }
            }
        ],
        series: [
            {
                name: t("new-users"),
                type: 'bar',
                tooltip: {
                    valueFormatter: function (value) {
                        return (value as number) + ' qty';
                    }
                },
                data: news
            },
            {
                name: t("retain-users"),
                type: 'bar',
                tooltip: {
                    valueFormatter: function (value) {
                        return (value as number) + ' qty';
                    }
                },
                data: retains
            },
            {
                name: t("returning-rate"),
                type: 'line',
                yAxisIndex: 1,
                tooltip: {
                    valueFormatter: function (value) {
                        return (value as number) + ' %';
                    }
                },
                data: returnRate
            }
        ]
    };
    return (
        <ReactECharts option={option} style={{ width: "100%", height: "100%" }} />
    )
}