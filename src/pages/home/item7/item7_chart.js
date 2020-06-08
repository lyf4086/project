export default function (){
    let box1 = document.getElementById("item7_right");
      let Echart = this.$echarts.init(box1);
    let option = {
        backgroundColor: 'transparent',
        title: {
            text: '',
            textStyle: {
                color: 'white', //坐标的字体颜色
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['出库', '入库'],
            textStyle: {
                color: 'white', //坐标的字体颜色
            },
        },
        toolbox: {
            show: true,
            feature: {
                dataView: {
                    show: true,
                    readOnly: false
                },
                magicType: {
                    show: true,
                    type: ['bar']
                },
                restore: {
                    show: true
                },
                saveAsImage: {
                    show: true
                }
            }
        },
        calculable: true,
        xAxis: [{
            axisLine: {
                lineStyle: {
                    color: 'white', //坐标轴的颜色
                },
            },
            type: 'category',
            data: this.times
        }],
        yAxis: [
    
            {
                type: 'value',
                name: '数量',
                // min: 0,
                // max: 100,
                // interval: 10,
                axisLabel: {
                    textStyle: {
                        color: 'white', //坐标的字体颜色
                    },
                    formatter: '{value} '
                },
                axisLine: {
                    lineStyle: {
                        color: 'white', //坐标轴的颜色
                    },
                },
    
            }
        ],
        color: ['#6449f7', '#7cb17b'],
        series: [{
                name: '出库',
                type: 'bar',
                data: this.outData,
            },
            {
                name: '入库',
                type: 'bar',
                data: this.inputData,
            }
        ]
    };
    Echart.setOption(option);
    window.addEventListener('resize',() => { Echart.resize(); });
}