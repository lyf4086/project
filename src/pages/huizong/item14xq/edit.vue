<template>
  <div id="home-child">
    <div class="top-sels">
      <div class="c-title">
        <div class="c-txt">出库入库数据分析</div>
      </div>
      <div class="c-content c-content-2">
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
        
        <div class="label">机构名称</div>
        <div class="txt-list">
          <div class="sel2" 
            :class="{checked:item.checked}"
            v-for="(item,index) in mec"
            :key="index"
             @click="jigouSelect(index)"
          >
            <div class="icon"></div>{{item.mechanism_name}}
          </div>
        </div>
      </div>
      <div class="btn-wrap"  @click="subSearch">
          确定
      </div>
    </div>
    
    <div class="bottom-chart-only">
        <div id="item14_echart_only" ></div>
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
       mec: [],
      ip_id: "",
      mid: "",
      tt: "",
      t_mechanism_id: "",
      timeStart: "",
      timeEnd: "",
      dataList: [],
      names: [],
      loading:null
    };
  },
   methods: {
    initChart() {
      let that = this;
      let box = document.getElementById("item14_echart_only");
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
          top: "2%",
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
        if(this.datePicker.length==0){
            this.$message.error('请选择时间')
            return
        }
      let start = this.datePicker[0];
      let end = this.datePicker[1];
      let selmec = this.mec.filter(e => e.checked);
      let mid = selmec.map(e => e.id).join();
      let ip_id = selmec.map(e => e.ip_id).join();
      let time = start + "," + end;
      let t_mechanism_id = this.t_mechanism_id;
      if (mid != "" && start != "" && end != "") {
        this.loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
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
           
            this.names = data.data.date;
            this.lineData = data.data.hot;
            this.data1 = data.data.input;
            this.data2 = data.data.out;
            this.initChart();
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
    if(JSON.stringify(par)=="{}"){
      this.$router.go(-1)
      return
    }
    let timearr = par.tt.length?par.tt.split(","):null;
    this.mid = par.mid;
    this.timeStart = timearr[0];
    this.timeEnd = timearr[1];
    this.getTypes();
    this.datePicker=timearr
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
    this.loading?this.loading.close():null
  }
};
</script>
<style lang="less" scoped>
.bottom-chart-only{
    box-sizing: border-box;
    padding-top: 2vh;
    #echart_only{
        width: 100%;
        height: 100%;
        background:rgba(177, 133, 133,.3);
    }
}
 
</style>