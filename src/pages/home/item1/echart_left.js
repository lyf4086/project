// export default function () {
//     let box1 = document.getElementById("content_left");
//       let Echart = this.$echarts.init(box1);
//     var legendData = [];
//     var xAxisData = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
//     // yAxisData = xAxisData;
//     var seriesData1 = ["5.31", "4.92", "5.92", "7.61", "7.23", "6.19", "6.03", "7.95", "2.56", "17.50", "8.97", "8.98"];
//     var seriesData2 = ["3.49", "4.25", "9.45", "7.16", "19.78", "", "", "", "", "", "", ""];
//     var seriesName1 = "去年";
//     var seriesName2 = "今年";

//     let option = {
//         tooltip: {
//             trigger: 'axis',
//             formatter: '{b}<br />{a0}: {c0}%<br />{a1}: {c1}%',
//         },
//         legend: {
//             top: '0%',
//             right: 10,
//             itemGap: 16,
//             itemWidth: 18,
//             itemHeight: 10,
//             data: name,
//             textStyle: {
//                 color: '#4c647c',
//                 fontStyle: 'normal',
//                 fontFamily: '微软雅黑',
//                 fontSize: 12,
//             }
//         },
//         grid: {
//             top: '14%',
//             bottom: '8%',
//             left: '6%',
//             right: '4%',
//         },
//         calculable: true,
//         xAxis: [
//             {
//                 type: 'category',
//                 data: xAxisData,
//                 axisLabel: { //坐标轴刻度标签的相关设置。
//                     interval: 0,//设置为 1，表示『隔一个标签显示一个标签』
//                     margin: 15,
//                     textStyle: {
//                         color: '#4c647c',
//                         fontStyle: 'normal',
//                         fontFamily: '微软雅黑',
//                         fontSize: 12,
//                     }
//                 },
//                 axisTick: {//坐标轴刻度相关设置。
//                     show: false,
//                 },
//                 axisLine: {//坐标轴轴线相关设置
//                     lineStyle: {
//                         color: '#fff',
//                         opacity: 0.2
//                     }
//                 },
//                 splitLine: { //坐标轴在 grid 区域中的分隔线。
//                     show: false,
//                 }
//             }
//         ],
//         yAxis: [
//             {
//                 type: 'value',
//                 splitNumber: 5,
//                 axisLabel: {
//                     formatter: "{value}%",
//                     textStyle: {
//                         color: '#fff',
//                         fontStyle: 'normal',
//                         fontFamily: '微软雅黑',
//                         fontSize: 12,
//                     }
//                 },
//                 axisLine: {
//                     show: false
//                 },
//                 axisTick: {
//                     show: false
//                 },
//                 splitLine: {
//                     show: true,
//                     lineStyle: {
//                         color: ['#000'],
//                         opacity: 0.06
//                     }
//                 }

//             }
//         ],
//         series: [
//             {
//                 name: seriesName1,
//                 type: 'line',
//                 smooth: true,
//                 symbol: 'circle',
//                 symbolSize: 5,
//                 showSymbol: false,
//                 lineStyle: {
//                     normal: {
//                         width: 1
//                     }
//                 },
//                 areaStyle: {
//                     normal: {
//                         color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
//                             offset: 0,
//                             color: 'rgba(254, 115, 113, 0.9)'
//                         }, {
//                             offset: 0.8,
//                             color: 'rgba(254, 115, 113, 0)'
//                         }], false),
//                         shadowColor: 'rgba(0, 0, 0, 0.2)',
//                         shadowBlur: 10
//                     }
//                 },
//                 itemStyle: {
//                     normal: {
//                         color: 'rgb(254, 115, 113)',
//                         borderColor: 'rgba(254, 115, 2,0.27)',
//                         borderWidth: 12

//                     }
//                 },
//                 data: seriesData1
//             }, {
//                 name: seriesName2,
//                 type: 'line',
//                 smooth: true,
//                 symbol: 'circle',
//                 symbolSize: 5,
//                 showSymbol: false,
//                 lineStyle: {
//                     normal: {
//                         width: 1
//                     }
//                 },
//                 areaStyle: {
//                     normal: {
//                         color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
//                             offset: 0,
//                             color: 'rgba(105, 163, 231, 0.9)'
//                         }, {
//                             offset: 0.8,
//                             color: 'rgba(105, 163, 231, 0)'
//                         }], false),
//                         shadowColor: 'rgba(0, 0, 0, 0.2)',
//                         shadowBlur: 10
//                     }
//                 },
//                 itemStyle: {
//                     normal: {
//                         color: 'rgb(105, 163, 231)',
//                         borderColor: 'rgba(105, 163, 116,0.2)',
//                         borderWidth: 12

//                     }
//                 },
//                 data: seriesData2
//             }
//         ]
//     };
//     Echart.setOption(option);
//     window.addEventListener('resize',() => { Echart.resize(); });
// }

export default function () {
    let box1 = document.getElementById("content_left");
      let Echart = this.$echarts.init(box1);
      let option = {
        title: {
          // text: "报警取视图"
        },
        tooltip: {
          position: ['150%', '0%'],
          align: "right",
          trigger: "item",
          textStyle: {
            align: "left"
          },
          
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        // legend: {
        //   data: this.echar1_names,
        //   selected: this.selected
        // },
        toolbox: {
          // feature: {
          //   saveAsImage: {}
          // }
        },
        grid: {
          left: "4%",
          right: "10%",
          bottom: "10%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: this.echar1_date,
            axisLine: {
              lineStyle: {
                color: "#fff"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            minInterval: 1,
            axisLine: {
              lineStyle: {
                color: "#fff"
              }
            }
          }
        ],
        series: this.list
      };

      Echart.setOption(option);
      window.addEventListener('resize',() => { Echart.resize(); });
}