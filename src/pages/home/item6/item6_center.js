export default function (){
    let that = this;
      let box2 = document.getElementById("item6_center");
      let Echart2 = this.$echarts.init(box2, true);
      let ser = [
        {
          name: "入套报警",
          type: "radar",
          symbol: "circle",
          symbolSize: 10,
          areaStyle: {
            normal: {
              color: "rgba(245, 166, 35, 0.4)"
            }
          },

          itemStyle: {
            color: "rgba(245, 166, 35, 1)",
            borderColor: "rgba(245, 166, 35, 0.3)",
            borderWidth: 10
          },
          lineStyle: {
            normal: {
              type: "dashed",

              color: "rgba(245, 166, 35, 1)",
              width: 2
            }
          },
          data: [that.chart2Data[0]]
        },
        {
          name: "离套报警",
          type: "radar",
          symbol: "circle",
          symbolSize: 10,
          itemStyle: {
            normal: {
              color: "rgba(19, 173, 255, 1)",
              borderColor: "rgba(19, 173, 255, 0.4)",
              borderWidth: 10
            }
          },
          areaStyle: {
            normal: {
              color: "rgba(19, 173, 255, 0.5)"
            }
          },
          lineStyle: {
            normal: {
              color: "rgba(19, 173, 255, 1)",
              width: 2,
              type: "dashed"
            }
          },
          data: [that.chart2Data[1]]
        },
        {
          name: "区域报警",
          type: "radar",
          symbol: "circle",
          symbolSize: 10,
          itemStyle: {
            normal: {
              color: "rgba(192, 173, 255, 1)",
              borderColor: "rgba(192, 173, 255, 0.4)",
              borderWidth: 10
            }
          },
          areaStyle: {
            normal: {
              color: "rgba(192, 173, 255, 0.5)"
            }
          },
          lineStyle: {
            normal: {
              color: "rgba(192, 173, 255, 1)",
              width: 2,
              type: "dashed"
            }
          },
          data: [that.chart2Data[2]]
        },
        {
          name: "逾期报警",
          type: "radar",
          symbol: "circle",
          symbolSize: 10,
          itemStyle: {
            normal: {
              color: "rgba(19, 233, 255, 1)",
              borderColor: "rgba(19, 233, 255, 0.4)",
              borderWidth: 10
            }
          },
          areaStyle: {
            normal: {
              color: "rgba(19, 233, 255, 0.5)"
            }
          },
          lineStyle: {
            normal: {
              color: "rgba(19, 233, 255, 1)",
              width: 2,
              type: "dashed"
            }
          },
          data: [that.chart2Data[3]]
        }
      ];
      let option = {
        // backgroundColor:'black',
        normal: {
          top: 200,
          left: 300,
          width: 500,
          height: 400,
          zIndex: 6,
          backgroundColor: ""
        },
        color: ["rgba(245, 166, 35, 1)", "rgba(19, 173, 255, 1)"],
        title: {
          show: true,
          // text: "数据展示图",
          left: "40%",
          top: "1%",
          textStyle: {
            fontSize: 18,
            color: "#fff",
            fontStyle: "normal",
            fontWeight: "normal"
          }
        },
        tooltip: {
          show: true,
          trigger: "item"
        },
        legend: {
          show: true,
          icon: "circle",
          left: "0%",
          top: "93%",
          orient: "horizontal",
          textStyle: {
            fontSize: 14,
            color: "#fff"
          },
          data: ["入套报警", "离套报警", "区域报警", "逾期报警"]
        },
        radar: {
          center: ["50%", "50%"],
          radius: "70%",
          startAngle: 90,
          splitNumber: 4,
          shape: "circle",
          splitArea: {
            areaStyle: {
              color: ["transparent"]
            }
          },
          axisLabel: {
            show: false,
            fontSize: 18,
            color: "#fff",
            fontStyle: "normal",
            fontWeight: "normal"
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#fff" //
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#fff" //
            }
          },
          indicator: that.chart2Day
        },
        series: ser
      };

      Echart2.setOption(option);
      window.addEventListener('resize',() => { Echart2.resize(); });
}