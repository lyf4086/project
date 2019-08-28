<template>
  <div class="wrap">
    <!-- <div id="echart" ></div> -->
    <div id="sel">
      <i class="jiao"></i>
      <i class="jiao"></i>
      <i class="jiao"></i>
      <i class="jiao"></i>
      <div class="items">
        <div class="title">
          <span></span>
          查询时间
        </div>
        <div class="sel-wrap">
          查询时间：
          <input type="date" v-model="timeStart" />
          至
          <input type="date" v-model="timeEnd" />
          <div class="sub" @click="sub">查询</div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <div class="title">报警占比</div>
        <div id="chart1"></div>
      </div>
      <div class="right">
        <div class="title">数量统计</div>
        <div id="chart2"></div>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import url(./index.css);
</style>
<script>
export default {
  data() {
    return {
      timeStart: "",
      timeEnd: "",
      data1: [],
      data2: [],
      names: [],
      data3: [],
      data4: []
    };
  },
  methods: {
    sub() {
      let str = this.timeStart + "," + this.timeEnd;
      this.getData(str);
    },
    initEchart() {
      let that = this;
      let box = document.getElementById("chart1");
      let Echart = this.$echarts.init(box);
      // app.title = "嵌套环形图";
      var colors = [
        "#9b92fe",
        "#7ba5c6",
        "#1f62ea",
        "#1990e9",
        "#49ddfc",
        "#6bdafe",
        "#39f381",
        "#e9e37c"
      ];
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "1%",
          textStyle: {
            color: "#fff"
          },
          data: this.names
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            selectedMode: "single",
            radius: [0, "45%"],
            label: {
              show: false
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            color: colors,
            data: this.data1
          },
          {
            name: "名称及数量占比",
            type: "pie",
            radius: ["64%", "85%"],
            color: colors,
            labelLine: {
              normal: {
                show: false
              }
            },
            label: {
              show: false
            },
            data: this.data2
          }
        ]
      };
      Echart.setOption(option);
    },
    initEchartRight() {
      let that = this;
      let box = document.getElementById("chart2");
      let Echart = this.$echarts.init(box);
      let option = {
        tooltip: {
          trigger: "axis"
        },
        xAxis: [
          {
            type: "category",
            data: that.data3,

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
            splitNumber: 4,
            splitLine: {
              lineStyle: {
                type: "dashed",
                color: "#DDD"
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#fff"
              }
            },
            nameTextStyle: {
              color: "#999"
            },
            splitArea: {
              show: false
            }
          }
        ],
        series: [
          {
            name: "数量",
            type: "line",
            data: that.data4,
            // [23, 60, 20, 36, 23, 85],
            lineStyle: {
              normal: {
                width: 5,
                color: {
                  type: "linear",

                  colorStops: [
                    {
                      offset: 0,
                      color: "#A9F387" // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#48D8BF" // 100% 处的颜色
                    }
                  ],
                  globalCoord: false // 缺省为 false
                },
                shadowColor: "rgba(72,216,191, 0.3)",
                shadowBlur: 10,
                shadowOffsetY: 20
              }
            },
            itemStyle: {
              normal: {
                color: "#fff",
                borderWidth: 10,
                /*shadowColor: 'rgba(72,216,191, 0.3)',
                      shadowBlur: 100,*/
                borderColor: "#A9F387"
              }
            },
            smooth: true
          }
        ]
      };
      Echart.setOption(option);
    },
    getData(timeStr) {
      let objs = { time: timeStr };
      var token = this.$gscookie.getCookie("gun");
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);
      var params = new URLSearchParams();
      params.append("sign", sign);
      params.append("token", token);
      params.append("time", objs.time);
      this.$axios({
        url:
          "http://s.tronl.cn/weixin/project/index.php?m=home&c=Index&a=alarm_type_lit",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.status == 200) {
            this.data1 = data.data.data;
            this.data2 = data.data.datas;
            let arr1 = data.data.data.map(e => e.name);
            let arr2 = data.data.datas.map(e => e.name);
            this.names = [...arr1, ...arr2];
            this.initEchart();
            this.data3 = data.data.tname;
            this.data4 = data.data.tcou;
            this.initEchartRight();
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created() {
    let par = this.$route.params;
    this.timeStart = par[0];
    this.timeEnd = par[1];
    let str = par[0] + "," + par[1];
    this.getData(str);
  },
  mounted() {
    this.$store.commit("setStr", {
      str1: "报警占比",
      str2: "数据分析"
    });
  },
  destroyed() {
    this.$store.commit("huanyuanStr");
  }
};
</script>