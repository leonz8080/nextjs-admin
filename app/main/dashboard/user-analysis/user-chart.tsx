"use client"

import * as echarts from 'echarts';
import { useEffect, useRef } from "react";
import ReactECharts from 'echarts-for-react';

type EChartsOption = echarts.EChartsOption;

export interface ChartDataModel {
    month: string,
    news: number,
    retains: number,
    returnRate: number
}

export function UserChart({ data }: { data: ChartDataModel[] }) {
    var month: string[] = [];
    var news: number[] = [];
    var retains: number[] = [];
    var returnRate: number[] = [];

    data.forEach(v => {
        month.push(v.month);
        news.push(v.news);
        retains.push(v.retains);
        returnRate.push(v.returnRate);
    });

    var option: EChartsOption;

    option = {
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
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        legend: {
            data: ['New Users', 'Retain Users', 'Returning Rate']
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
                name: 'New Users',
                axisLabel: {
                    formatter: '{value} qty'
                }
            },
            {
                type: 'value',
                name: 'Returning Rate',
                axisLabel: {
                    formatter: '{value} %'
                }
            }
        ],
        series: [
            {
                name: 'New Users',
                type: 'bar',
                tooltip: {
                    valueFormatter: function (value) {
                        return (value as number) + ' qty';
                    }
                },
                data: news
            },
            {
                name: 'Retain Users',
                type: 'bar',
                tooltip: {
                    valueFormatter: function (value) {
                        return (value as number) + ' qty';
                    }
                },
                data: retains
            },
            {
                name: 'Returning Rate',
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