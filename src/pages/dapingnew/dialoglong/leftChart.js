export default function leftChart(dataList=[10,20,30,40,50,60,70,80,90,100]){
    let box1 = document.getElementById("chart-left");
    let myChart = this.$echarts.init(box1);
    let option = {
        color: ['#0086d0'],
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function (objs, index) {
                let obj = objs[0];
                return `${obj.name}<br/>${obj.marker}${obj.seriesName} : ${obj.value}%`;
            },
        },
        grid: {
            top: '10%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,

        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            data: [10, 20, 40, 60, 80, 100],
            interval: 20,
            min: 0,
            max: 100,
            splitLine: {
                show: false,
                lineStyle: {
                    type: 'dashed'
                }
            },
            axisLine: {
                show: false,
                lineStyle: {
                    color: '#909396',

                }
            },
            axisLabel: {
                formatter: function (value, index) {
                    return value + '%';
                },
                color: '#fff'
            },
            axisTick: {
                show: false,
            }
        },
        yAxis: {
            type: 'category',
            boundaryGap: true,
            splitArea: {
                areaStyle: {
                    opacity: 0
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#fff',

                }
            },
            data: [
                '10',
                '9',
                '8',
                '7',
                '6',
                '5',
                '4',
                '3',
                '2',
                '1'
            ]
        },
        series: [
            {
                name: '数量占比',
                barMaxWidth: 10,
                type: 'bar',
                data: [
                    {
                        value: dataList[0]||0,
                        itemStyle: {
                            color: '#0086d0',
                        }
                    },
                    {
                        value: dataList[1]||0,
                        itemStyle: {
                            color: '#6fccff',
                        }
                    },
                    {
                        value: dataList[2]||0,
                        itemStyle: {
                            color: '#0086d0',
                        }
                    },
                    {
                        value: dataList[3]||0,
                        itemStyle: {
                            color: '#6fccff',
                        }
                    },
                    {
                        value: dataList[4]||0,
                        itemStyle: {
                            color: '#0086d0',
                        }
                    },
                    {
                        value: dataList[5]||0,
                        itemStyle: {
                            color: '#6fccff',
                        }
                    },
                    {
                        value: dataList[6]||0,
                        itemStyle: {
                            color: '#0086d0',
                        }
                    },
                    {
                        value: dataList[7]||0,
                        itemStyle: {
                            color: '#6fccff',
                        }
                    },
                    {
                        value: dataList[8]||0,
                        itemStyle: {
                            color: '#6fccff',
                        }
                    },
                    {
                        value: dataList[9]||0,
                        itemStyle: {
                            color: '#6fccff',
                        }
                    },
                ]
            },

        ]
    };
    myChart.setOption(option)
}