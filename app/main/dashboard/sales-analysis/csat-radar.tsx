"use client"

import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';

type EChartsOption = echarts.EChartsOption;

export function CsatRadar({data} : {data: number[]}) {

    var option: EChartsOption;
    option = {
        title: {
            text: 'CSAT analysis',
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
                { name: 'Product quality', max: 100 },
                { name: 'Serve', max: 100 },
                { name: 'Logistics', max: 100 },
                { name: 'After-sales', max: 100 },
                { name: 'Recommend', max: 100 }
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
                name: 'CSAT analysis',
                type: 'radar',
                data: [
                    {
                        value: [90, 75, 73, 66, 85],
                        name: 'Score'
                    }
                ]
            }
        ]
    };

    return (
        <ReactECharts option={option} style={{ width: "100%", height: "100%" }} />
    )
}