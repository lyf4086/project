export default function rightChart(nameList,dataList){
    let box1 = document.getElementById("chart-right");
    let myChart = this.$echarts.init(box1);
    let option = {
        title: {
            text: '',
            textStyle: {
                fontSize: 14,
                color: '#808492',
                fontWeight: 500,
            }
        },
        color: ['#3b9ffc'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '30',
            right: '30',
            bottom: '20',
            containLabel: true
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
        },
        calculable: true,
        xAxis: {
            show:true,//是否显示X轴
            // boundaryGap: false, //x轴从0开始到结束显示
            // onZero: true,
            splitLine: {
                show: false
            }, //去除网格线
            splitArea: {
                show: false
            }, //保留网格区域
            axisLine: {
                show: true,
                lineStyle: { //轴上的线样式
                    color: '#808492',
                    width: 0.6, //这里是为了突出显示加上的
                },
            },
            axisTick: {
                show: true
            },
            axisLabel: { //轴上的数据样式
                color: '#808492',
            },
            data: nameList
            // ['1月', '2月', '3月', '4月', '5月','6月', '77月','8月', '9月', '10月', '11月', '12月'],
        },
        yAxis: {
            show: false,//是否显示y轴
            type: 'value',
            axisTick: {
                show: false
            },
            axisLine: {
                show: false,
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
                    color: 'rgba(33,148,246,0.2)'
                }
            },
            axisLabel: {
                textStyle: {
                    fontSize: 12,
                    color: '#808492'
                }
            }
        },
        series: [{
                type: 'bar',
                barWidth: 10, // 柱形的宽度
                barGap: 0,
                data: dataList
                // [320, 332, 301, 334, 390,320, 332, 201, 334, 390,100,200],
            }
            // {
            //     type: 'line',
            //     smooth: true,//平滑曲线
            //     data: [320, 332, 201, 334, 390,320, 332, 101, 334, 390,400,20],
            //     symbol: 'none',
            //     symbolSize: '5',
            //     name: '总计',
            //     lineStyle: {
            //         //折线样式
            //         color: "#ffc83b"
            //     },
            // }
        ]
    };
    myChart.setOption(option)
}