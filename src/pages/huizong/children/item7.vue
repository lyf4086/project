<template>
  <div class="main">
    <div class="itemleft">
      <p>枪支出勤热力图</p>
      <div id="echar1" @click="chart1XQ"></div>
    </div>
    <div class="itemcenter" v-if="arr.length">
      <p>出勤TOP5</p>
      <div id="echar2">
        <h6>
          <span>地区</span>
          <!-- <span>出勤数量</span> -->
          <span>出勤数量</span>
        </h6>
        <div class="item" v-for="(item,index) in arr" :key="index">
          <h3>{{item.mechanism_name}}</h3>
          <!-- <h3>{{e.c}}</h3> -->
          <h3>{{item.number}}</h3>
        </div>
      </div>
    </div>
    <div class="itemright">
      <p>出入库占比情况</p>
      <div id="echar3" @click="chart3xq"></div>
    </div>
  </div>
</template>
<style scoped>
@import url(./item7.css);
</style>
<script>
export default {
  data() {
    return {
      mes: {},
      arr: [],
      leftDataArr: [
        {
          type: "bar",
          data: [1, 2, 3, 4, 3, 5, 1],
          coordinateSystem: "polar",
          name: "入套",
          stack: "a"
        },
        {
          type: "bar",
          data: [2, 4, 6, 1, 3, 2, 1],
          coordinateSystem: "polar",
          name: "离套",
          stack: "a"
        },
        {
          type: "bar",
          data: [1, 2, 3, 4, 1, 2, 5],
          coordinateSystem: "polar",
          name: "电量",
          stack: "a"
        },
        {
          type: "bar",
          data: [1, 2, 3, 4, 1, 2, 5],
          coordinateSystem: "polar",
          name: "位置",
          stack: "a"
        }
      ],
      chart3: null,
      rightData: {
        in: [320, 302, 341, 374, 390, 450, 420],
        out: [-120, -132, -101, -134, -190, -230, -290],
        time: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
      },
      chart1names: [],
      chart1data: []
    };
  },
  methods: {
    chart1XQ() {
      // this.$router.push({
      //   name: "RightBottomXQ1"
      // });
    },
    chart3xq() {
      this.$router.push({
        name: "Item14XQ",
        params: this.mes
      });
    },
    char1() {
      let that = this;
      let box1 = document.getElementById("echar1");
      let myChart = this.$echarts.init(box1);
      var ydata = that.chart1data;

      var color = [
        "#BC8DEE",
        "#8693F3",
        "#89C3F8",
        "#F2A695",
        "#FCC667",
        "#AEB7F9",
        "#748BFA"
      ];
      var xdata = that.chart1names;
      let option = {
        // backgroundColor: "rgba(255,255,255,1)",
        color: color,
        legend: {
          orient: "vartical",
          x: "left",
          top: "40%",
          left: "66%",
          bottom: "0%",
          data: xdata,
          itemWidth: 20,
          itemHeight: 14,
          itemGap: 15,
          textStyle: { color: "#fff" },
          formatter: function(name) {
            return "" + name;
          }
        },
        series: [
          {
            name: "违规次数",
            type: "pie",
            clockwise: false, //饼图的扇区是否是顺时针排布
            minAngle: 20, //最小的扇区角度（0 ~ 360）
            radius: ["30%", "58%"],
            center: ["35%", "50%"],
            avoidLabelOverlap: false,
            itemStyle: {
              //图形样式
              normal: {
                // borderColor: "rgb(35,68,97)",
                borderWidth: 1
              }
            },
            label: {
              normal: {
                show: false,
                position: "center",
                formatter: "{text|{b}}\n{value|{d}%}",
                rich: {
                  text: {
                    color: "#fff",
                    fontSize: 14,
                    align: "center",
                    verticalAlign: "middle",
                    padding: 5
                  },
                  value: {
                    color: "#fff",
                    fontSize: 14,
                    align: "center",
                    verticalAlign: "middle"
                  }
                }
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: 16
                }
              }
            },
            data: ydata
          }
        ]
      };
      myChart.setOption(option);

      setTimeout(function() {
        myChart.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: 0
        });

        myChart.on("mouseover", function(params) {
          if (params.name == ydata[0].name) {
            myChart.dispatchAction({
              type: "highlight",
              seriesIndex: 0,
              dataIndex: 0
            });
          } else {
            myChart.dispatchAction({
              type: "downplay",
              seriesIndex: 0,
              dataIndex: 0
            });
          }
        });

        myChart.on("mouseout", function(params) {
          myChart.dispatchAction({
            type: "highlight",
            seriesIndex: 0,
            dataIndex: 0
          });
        });
      }, 1000);
      myChart.setOption(option);
      // myChart.on("click", function(ev) {
      //   console.log(ev);
      //   that.$router.push({
      //     name: "RightBottomXQ1"
      //   });
      // });
    },
    char2() {
      let that = this;
      let box3 = document.getElementById("echar3");
      let Echar3 = this.$echarts.init(box3);
      let option = {
        color: ["#ec8938", "#63deff"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          textStyle: { color: "#fff" },
          data: ["入库", "出库"]
        },
        grid: {
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "value",
             axisLine: {
              lineStyle: {
                color: "#fff"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "category",
            axisLine: {
              lineStyle: {
                color: "#fff"
              }
            },
            axisTick: { show: false },
            data: this.rightData.time
          }
        ],
        series: [
          {
            name: "入库",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true
              }
            },
            data: this.rightData.in
          },
          {
            name: "出库",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "left"
              }
            },
            data: this.rightData.out
          }
        ]
      };

      Echar3.setOption(option);
    },
    getDataLeft(t_mechanism_id) {
      let objs = { t_mechanism_id };
      var token = this.$gscookie.getCookie("gun");
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);
      var params = new URLSearchParams();
      params.append("sign", sign);
      params.append("token", token);
      params.append("t_mechanism_id", objs.t_mechanism_id);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=Index&a=last_week",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          for (let item in data.data.date) {
            this.chart1names.push(data.data.date[item]);
          }
          this.chart1data = data.data.cou.map((item, index) => {
            return {
              name: data.data.date[index],
              value: item
            };
          });
          this.char1();
        })
        .catch(error => {
          console.log(error);
        });
    },
    getDataCenter() {
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
          "/weixin/project/index.php?m=home&c=Index&a=out_work",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          this.arr = data.data.data;
          // console.log('center',data)
        })
        .catch(error => {
          console.log(error);
        });
    },
    getDataRight() {
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
          "/weixin/project/index.php?m=home&c=Index&a=out_device",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.status == 200) {
              this.mes = {
                ip_id: data.data.ip_id,
                mid: data.data.mid,
                tt: data.data.tt
              };
              let input = data.data.data.map((item, index) => {
                return item.input;
              });
              let out = data.data.data.map((item, index) => {
                return item.out;
              });
              let time = data.data.data.map((item, index) => {
                return item.time;
              });
              this.rightData.in = input;
              this.rightData.out = out;
              this.rightData.time = time;
              this.char2();
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  mounted() {
    let mes = this.$gscookie.getCookie("message_obj");
    this.getDataLeft(mes.mechanism_id);
    this.getDataCenter();
    this.getDataRight();
  }
};
</script>
