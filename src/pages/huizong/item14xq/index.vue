<template>
  <div class="wrap">
    <div id="sel">
      <i class="jiao"></i>
      <i class="jiao"></i>
      <i class="jiao"></i>
      <i class="jiao"></i>
      <div class="items">
        <div class="title1">
          <span></span>
          查询时间
        </div>
        <div class="sel-wrap">
          查询时间：
          <input type="date" v-model="timeStart" />
          至
          <input type="date" v-model="timeEnd" />
          <div class="sub" @click="sub" v-if="false">查询</div>
        </div>
      </div>
      <div class="items">
        <div class="title1">
          <span></span>
          机构名称
        </div>
        <div class="jg-wrap">
          <div
            class="item"
            :class="{selected:item.checked}"
            v-for="item,index in mec"
            :key="index"
            @click="jigouSelect(index)"
          >
            <i></i>
            {{item.mechanism_name}}
          </div>
        </div>
      </div>
      <div class="sub-wrap">
        <div class="sub" @click="subSearch">确定</div>
      </div>
    </div>
    <div id="content">
      <div id="chart"></div>
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
      mec: [],
      ip_id: "",
      mid: "",
      tt: "",
      t_mechanism_id: "",
      timeStart: "",
      timeEnd: "",
      dataList: [],
      names: ["1街", "2街", "3街", "4街", "5街", "6街"]
    };
  },
  methods: {
    initChart() {
      let that = this;
      let box = document.getElementById("chart");
      let Echart = this.$echarts.init(box);
      let option = {
        title: {
          //   text: "自定义的折柱混合--BarLine",
          left: "center",
          y: "10",
          textStyle: {
            color: "#fff"
          }
        },
        // "backgroundColor": "#1c2e40",
        color: "#384757",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#384757"
            }
          }
        },
        legend: {
          data: [
            {
              name: "入库量",
              icon: "circle",
              textStyle: {
                color: "#fff"
              }
            },
            {
              name: "出库量",
              icon: "circle",
              textStyle: {
                color: "#fff"
              }
            },
            {
              name: "剩余归还量",
              icon: "circle",
              textStyle: {
                color: "#fff"
              }
            }
          ],
          top: "10%",
          textStyle: {
            color: "#fff"
          }
        },
        xAxis: [
          {
            type: "category",
            data: that.names,
            axisPointer: {
              type: "shadow"
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: "#fff"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            // name: "不文明现象",
            nameTextStyle: {
              color: "#7d838b"
            },
            min: 0,
            // max: 50,
            interval: 10,
            axisLabel: {
              show: true,
              textStyle: {
                color: "#fff"
              }
            },
            axisLine: {
              show: true
            },
            splitLine: {
              lineStyle: {
                color: "#fff"
              }
            }
          },
          {
            type: "value",
            name: "",
            show: true,
            axisLabel: {
              show: true,
              textStyle: {
                color: "#fff"
              }
            }
          }
        ],
        grid: {
          top: "10%",
          left: "5%",
          right: "5%",
          bottom: "10%"
        },
        series: [
          {
            name: "入库量",
            type: "bar",
            data: that.data1,
            barWidth: "auto",
            itemStyle: {
              normal: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "rgba(255,37,117,0.7)"
                    },
                    {
                      offset: 0.5,
                      color: "rgba(0,133,245,0.7)"
                    },
                    {
                      offset: 1,
                      color: "rgba(0,133,245,0.3)"
                    }
                  ],
                  globalCoord: false
                }
              }
            }
          },
          {
            name: "出库量",
            type: "bar",
            data: that.data2,
            barWidth: "auto",
            itemStyle: {
              normal: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "rgba(22,237,17,0.7)"
                    },
                    {
                      offset: 0.5,
                      color: "rgba(0,255,252,0.7)"
                    },
                    {
                      offset: 1,
                      color: "rgba(0,222,252,0.3)"
                    }
                  ],
                  globalCoord: false
                }
              }
            },
            barGap: "0"
          },
          {
            name: "剩余归还量",
            type: "line",
            yAxisIndex: 1,
            data: that.lineData,
            itemStyle: {
              normal: {
                color: "#ffaa00"
              }
            },
            smooth: true
          }
        ]
      };

      Echart.setOption(option);
    },
    subSearch() {
      let start = this.timeStart;
      let end = this.timeEnd;
      let selmec = this.mec.filter(e => e.checked);
      let mid = selmec.map(e => e.id).join();
      let ip_id = selmec.map(e => e.ip_id).join();
      let time = start + "," + end;
      let t_mechanism_id = this.t_mechanism_id;
      if (mid != "" && start != "" && end != "") {
        // console.log(t_mechanism_id, mid, ip_id, time);
        // return;
        this.getData(t_mechanism_id, mid, ip_id, time);
      } else {
        this.$message({
          type: "warning",
          message: "信息不全"
        });
      }
    },
    jigouSelect(index) {
      this.mec[index].checked = !this.mec[index].checked;
    },
    getTypes() {
      let objs = {};
      var token = this.$gscookie.getCookie("gun");
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);
      var params = new URLSearchParams();
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=Home&c=Index&a=basic",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.status == 200) {
            // console.log(data);
            this.mec = data.data.mec.map((item, index) => {
              if (index == 0) {
                return {
                  ...item,
                  checked: true
                };
              } else {
                return {
                  ...item,
                  checked: false
                };
              }
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getData(t_mechanism_id, mid, ip_id, time) {
      let objs = {
        t_mechanism_id,
        mid,
        ip_id,
        time
      };
      // console.log(objs);
      var token = this.$gscookie.getCookie("gun");
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);
      var params = new URLSearchParams();
      params.append("sign", sign);
      params.append("token", token);
      params.append("t_mechanism_id", objs.t_mechanism_id);
      params.append("mid", objs.mid);
      params.append("ip_id", objs.ip_id);
      params.append("time", objs.time);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=Home&c=Index&a=out_info",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.status == 200) {
            console.log(data);
            // this.dataList = data.data.data;
            // this.cou = data.data.cou;
            // this.date = data.data.date;
            this.names = data.data.date;
            this.lineData = data.data.hot;
            this.data1 = data.data.input;
            this.data2 = data.data.out;
            this.initChart();
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created() {
    let par = this.$route.params;
    let timearr = par.tt.split(",");
    this.mid = par.mid;
    this.timeStart = timearr[0];
    this.timeEnd = timearr[1];
    this.getTypes();
    this.getData(par.mid, par.mid, par.ip_id, par.tt);
  },
  mounted() {
    this.$store.commit("setStr", {
      str1: "出库入库",
      str2: "数据详情"
    });
  },
  destroyed() {
    this.$store.commit("huanyuanStr");
  }
};
</script>