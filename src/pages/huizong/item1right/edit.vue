<template>
  <div id="home-child">
    <div class="top-sels top-sels-2">
      <div class="c-title">
        <div class="c-txt">报警数据分析</div>
      </div>
      <div class="c-content">
        <div class="label">查询时间</div>
        <div class="txt">
          <el-date-picker
            v-model="datePicker"
            type="daterange"
            align="right"
            id="time-picker"
            unlink-panels
            value-format="yyyy-MM-dd"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </div>
       
      </div>
      <div class="btn-wrap" @click="sub">
          查询
      </div>
    </div>
    <div class="bottom-chart-two-wrap bottom-chart-two-wrap-height">
        <div class="c_title">
            报警占比
            <div class="icon"></div>
            <div class="right-line"></div>
            <div class="bottom-line"></div>
        </div>
        <div class="c_title">
            数量统计
            <div class="icon"></div>
            <div class="right-line"></div>
            <div class="bottom-line"></div>
        </div>
        <div id="item1_echart_left"></div>
        <div id="item1_echart_right"></div>
    </div>
   
  </div>
</template>
<script>
export default {
  data() {
    return {
      datePicker: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      timeStart: "",
      timeEnd: "",
      data1: [],
      data2: [],
      names: [],
      data3: [],
      data4: [],
      loading:null
    };
  },
   methods: {
    sub() {
        
        if(!this.datePicker){
            this.$message.error('请选择时间！')
            return
        }
      let start=this.datePicker[0]
      let end=this.datePicker[1]

      let str = start + "," + end;
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.getData(str);
    },
    initEchart() {
      let that = this;
      let box = document.getElementById("item1_echart_left");
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
            name: "报警类型",
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
            name: "机构名称",
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
      let box = document.getElementById("item1_echart_right");
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
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=Index&a=alarm_type_lit",
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
            this.loading.close()
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created() {
    this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    let par = this.$route.params;
    this.timeStart = par[0];
    this.timeEnd = par[1];
    let str = par[0] + "," + par[1];
    this.datePicker=par
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
    this.loading?this.loading.close():null
  }
};
</script>
<style lang="less" scoped>
@vw:38.4vw;
@vh:21.6vh;


</style>