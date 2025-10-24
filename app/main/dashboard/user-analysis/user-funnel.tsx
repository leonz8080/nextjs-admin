"use client"

import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';

type EChartsOption = echarts.EChartsOption;

export interface FunnelDataModel {
    name: string,
    value: number
}

export function UserFunnel({ data }: { data: FunnelDataModel[] }) {
    var legends: string[] = [];
    data.forEach(v => {
        legends.push(v.name);
    });

    var option: EChartsOption;
    option = {
        title: {
            text: 'User Funnel',
            padding: [30, 0, 0, 40],
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold',
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b} : {c}',
            textStyle: {
                fontSize: 14
            }
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: legends,
            itemGap: 15,
            padding: [60, 0, 0, 40]
        },
        series: [
            {
                name: 'Funnel',
                type: 'funnel',
                left: '35%',
                top: 30,
                bottom: 30,
                width: '55%',
                minSize: '0%',
                maxSize: '100%',
                sort: 'descending',
                gap: 2,
                label: {
                    show: false,
                    position: 'inside'
                },
                labelLine: {
                    length: 10,
                    lineStyle: {
                        width: 1,
                        type: 'solid'
                    }
                },
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 1
                },
                emphasis: {
                    label: {
                        fontSize: 14
                    }
                },
                data: data
            }
        ]
    };

    return (
        <ReactECharts option={option} style={{ width: "100%", height: "100%" }} />
    )
}