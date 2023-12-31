const powerCard1 ={
    type: 'line',
    height: 75,
    options: {
        chart: {
            sparkline: {
                enabled: true
            }
        },
        dataLabels: {
            enabled: false
        },
        colors: ['#ff5252'],
        stroke: {
            curve: 'smooth',
            width: 3,
        },
        yaxis: {
            min: 10,
            max: 100,
        },
        tooltip: {
            theme: 'dark',
            fixed: {
                enabled: false
            },
            x: {
                show: false,
            },
            y: {
                title: {
                    formatter: (seriesName) => 'Power'
                }
            },
            marker: {
                show: false
            }
        }
    },
    series: [{
        name: 'series1',
        data: [55, 35, 75, 50, 90, 50]
    }]
}
export default powerCard1