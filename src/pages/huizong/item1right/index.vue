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
          <div class="sub">查询</div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <div id="chart1"></div>
      </div>
      <div class="right">
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
      timeEnd: ""
    };
  },
  methods: {
    initEchart() {
      let that = this;
      let box = document.getElementById("chart1");
      let Echart = this.$echarts.init(box);
      // app.title = "嵌套环形图";

      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "left",
          y: "bottom",
          data: [
            // "直达",
            // "营销广告"
            // "搜索引擎",
            // "邮件营销",
            // "联盟广告",
            // "视频广告"
            // "百度",
            // "谷歌",
            // "必应",
            // "其他"
          ]
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            selectedMode: "single",
            radius: [0, "30%"],

            label: {
              normal: {
                position: "inner"
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: 335, name: "直达", selected: true },
              { value: 679, name: "营销广告" },
              { value: 1548, name: "搜索引擎" },
              { value: 666, name: "必应" }
            ]
          },
          {
            name: "访问来源",
            type: "pie",
            radius: ["40%", "55%"],
            label: {
              normal: {
                formatter: "{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ",
                backgroundColor: "#eee",
                borderColor: "#aaa",
                borderWidth: 1,
                borderRadius: 4,
                // shadowBlur: 3,
                // shadowOffsetX: 2,
                // shadowOffsetY: 2,
                // shadowColor: "#999",
                // padding: [0, 7],
                rich: {
                  a: {
                    color: "#666",
                    lineHeight: 22,
                    align: "center"
                  },
                  // abg: {
                  //   backgroundColor: "#333",
                  //   width: "100%",
                  //   align: "right",
                  //   height: 22,
                  //   borderRadius: [4, 4, 0, 0]
                  // },
                  hr: {
                    borderColor: "#ccc",
                    width: "100%",
                    borderWidth: 0.5,
                    height: 0
                  },
                  b: {
                    fontSize: 16,
                    lineHeight: 33
                  },
                  per: {
                    color: "#eee",
                    backgroundColor: "#334455",
                    padding: [2, 4],
                    borderRadius: 2
                  }
                }
              }
            },
            data: [
              { value: 335, name: "哈哈哈哈", selected: true },
              { value: 310, name: "邮件营销" },
              { value: 234, name: "联盟广告" },
              { value: 135, name: "视频广告" }
            ]
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
            data: [
              "2019-01",
              "2019-02",
              "2019-03",
              "2019-04",
              "2019-05",
              "2019-06"
            ],
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
            name: "课时",
            type: "line",
            data: [23, 60, 20, 36, 23, 85],
            lineStyle: {
              normal: {
                width: 8,
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
    }
  },
  created() {},
  mounted() {
    this.initEchart();
    this.initEchartRight();
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