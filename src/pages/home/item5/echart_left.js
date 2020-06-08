export default function (){
    let that = this;
      let Echart1 = this.$echarts.init(document.getElementById("content5_left"));
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },
        toolbox: {
          feature: {
            dataView: { show: false, readOnly: false },
            magicType: { show: false, type: ["line", "bar"] },
            restore: { show: false },
            saveAsImage: { show: false }
          }
        },
        legend: {
        //   data:['报警','正常','总量','哈哈'],
          data: this.chart1Data.legendData,
          textStyle: {
            color: "#fff"
          }
        },
        xAxis: [
          {
            type: "category",
            // data: ['22','20','30','40','50','60','70'],
            data: this.chart1Data.xAxisData,
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "",
            min: 0,
            // max:'200',
            max: that.max,
            interval: 3,
            axisLabel: {
              formatter: " ",
              textStyle: {
                color: "#fff",
                fontSize: 12
              }
            }
          },
          {
            type: "value",
            name: "",
            min: 0,
            // max:'200',
            max: that.max,
            interval: 5,
            axisLabel: {
              formatter: ""
            }
          }
        ],
        series: this.chart1Data.series
      };
      Echart1.setOption(option);
      window.addEventListener('resize',() => { Echart1.resize(); });
     
}