"use client"

import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';

type EChartsOption = echarts.EChartsOption;

export interface PieDataModel {
    name: string,
    value: number
}

export function ChannelPie({ data }: { data: PieDataModel[] }) {

    var option: EChartsOption;
    option = {
        title: {
            text: 'User Source',
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
                name: 'Access From',
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
                data: data
            }
        ]
    };

    return (
        <ReactECharts option={option} style={{ width: "100%", height: "100%" }} />
    )
}