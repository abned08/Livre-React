import React from 'react';
import Chart from "react-apexcharts";
import i18next from "i18next";

const SupportChart2 = (props) => {
    const ap = {
        type: 'area',
        height: 100,
        style: {
            direction: i18next.languages[0] === 'ar' ? 'rtl' : 'ltr'
        },
        options: {
            chart: {
                sparkline: {
                    enabled: true
                }
            },
            dataLabels: {
                enabled: false
            },
            colors: ['#9ccc65'],
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            tooltip: {
                fixed: {
                    enabled: false
                },
                x: {
                    show: true
                },
                y: {
                    // title: {
                    //     formatter: (seriesName) => 'Ticket '
                    // }
                },
                marker: {
                    show: false
                }
            },
            markers: {
                size: 4,
                colors: ["#9ccc65"],
                strokeColors: "#fff",
                strokeWidth: 2,
                hover: {
                    size: 6,
                }
            },
            xaxis: props.xaxis,

        },
        series: props.series
    }
    return (
        <Chart {...ap}/>
    )
}
export default SupportChart2