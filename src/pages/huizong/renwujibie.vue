<template>
  <div class="wrap">
    <div class="num-icon" id="num-icon" v-if="upShow">
      <div class="item" v-for="(item,index) in iconList" :key="index" @click="toList(item)">
        <p>{{item.name}}</p>
        <div class="num">{{item.number}}</div>
        <p>环比{{item.ratio}}%</p>
      </div>
    </div>
    <div class="echarts-wrap" v-if="dataRight&&dataRight">
      <div class="title">本单位出勤任务类型</div>
      <div class="title">枪支借出各类型占比</div>
      <div id="chart1" @click="toXiangQingChart1" ></div>
      <div id="chart2" @click="toXiangQingChart2" ></div>
    </div>
  </div>
</template>

<script>
import { setInterval, clearInterval, setTimeout, clearTimeout } from "timers";
export default {
  data() {
    return {
      upShow:false,
      loading:null,
      leftT: "",
      max: 0,
      timermove: null,
      iconList: [],
      num: [0, 0, 0, 0],
      numData: {
        area: 111,
        elec: 222,
        litao: 333,
        rutao: 444
      },
      time: "",
      timer: null,
      timer1:null,
      dataRightUp: [],
      dataRight: [],
      chart1Data: {
        legendData: ["报警", "正常", "总量"],
        // xAxisData: ["22", "20", "30", "40", "50", "60", "70"],
        series: [
          {
            name: "报警",
            type: "bar",
            color: "#5dceec"
            // data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6]
          },
          {
            name: "正常",
            type: "bar",
            color: "#ed8a39"
            // data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 135.6]
          }
          // {
          //   name: "总量",
          //   type: "line",
          //   // color: "#5dcae9",
          //   yAxisIndex: 1
          //   // data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3]
          // }
        ]
      }
    };
  },
  methods: {
    toXiangQingChart1(ev) {
      if(!this.leftT&&!this.mid)return
      this.$router.push({
        name: "Item7XQ",
        params: { tt: this.leftT, mid: this.mid, ip_id: this.ipId }
      });
    },
    toXiangQingChart2() {
      if(!this.leftT&&!this.mid)return
      
      this.$router.push({
        name: "Item8XQ",
        params: { tt: this.leftT, mid: this.mid, ip_id: this.ipId }
      });
    },
    toList(type) {
      let roleId = this.$store.state.role_id;
      if (roleId == 3) return;
      this.$router.push({
        name: "Item4Top",
        params: { ...type }
      });
      // this.$router.push({
      //   name: "Pub",
      //   params: {
      //     source: "item4",
      //     time: this.time,
      //     type: type
      //   }
      // });
    },
    makeStr(str) {
      if (str == "area") {
        return "位置报警";
      } else if (str == "elec") {
        return "电量报警";
      } else if (str == "litao") {
        return "离套报警";
      } else {
        return "入套报警";
      }
    },
    chart1() {
      let that = this;
      let Echart1 = this.$echarts.init(document.getElementById("chart1"));
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
          // data:['报警','正常','总量','哈哈']
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
      Echart1.on("click", function(ev) {
        // that.$router.push({
        //   name: "Item7XQ",
        //   params: {}
        // });
        // that.$router.push({
        //   name: "Pub",
        //   params: {
        //     source: "item7",
        //     time: ev.name
        //   }
        // });
      });
    },
    chart2() {
      let that = this;
      let Echart2 = this.$echarts.init(
        document.getElementById("chart2"),
        "macarons"
      );
      let option2 = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          x: "left",
          textStyle:{
            fontSize:"16"
          },
          // data:['一级用枪','二级用枪','三级用枪','四级用枪','五级用枪','六级用枪']
          data: this.dataRightUp
        },
        series: [
          {
            name: "型号及数量",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            color: [
              "#63deff",
              "#57c4e3",
              "#4ba2bd",
              "#3e8aa1",
              "#4176a8",
              "#335f86"
            ],
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: false,
                textStyle: {
                  fontSize: "12",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.dataRight
          }
        ]
      };

      Echart2.setOption(option2);
      Echart2.on("click", function(ev) {
        that.$router.push({
          name: "Pub",
          params: {
            source: "item8",
            gtypes: ev.data.gtypes,
            time: ""
          }
        });
      });
    },
    getData_up() {
     
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
          "/weixin/project/index.php?m=home&c=Index&a=moth_alarm",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {

          if (data.status == 200) {
            this.upShow=true
            this.iconList = data.data.data;
            this.time = data.data.time;
            this.timermove = window.setTimeout(() => {
              this.zuodonghua();
            }, 5000);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getData_under_l() {
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
          "/weixin/project/index.php?m=home&c=Index&a=task",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          
          // console.log("333", data);
          this.leftT = data.data.tt;
          this.mid = data.data.mid;
          this.ipId = data.data.ip_id;
          let obj = {};
          this.max = data.data.max;
          obj.legendData = data.data.legend.data;
          obj.xAxisData = data.data.time;
          obj.series = data.data.data.map(item => {
            return {
              ...item,
              type: "bar"
            };
          });

          this.chart1Data=Object.assign(this.chart1Data, obj);
          this.chart1();
        })
        .catch(error => {
          console.log(error);
        });
    },
    getData_under_r() {
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
          "/weixin/project/index.php?m=home&c=Index&a=lend_gun",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if(data.status==200){
            
            let list = data.data.data.map((item, index) => {
              return {
                value: item.number,
                name: item.gtype,
                gtypes: item.gtypes
              };
            });
            this.dataRight = list;
            this.dataRightUp = data.data.data.map(item => item.gtype);
            this.chart2();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    zuodonghua() {     
      let main = $(".num-icon")[0];
      if(!main)return
      let list = document.querySelectorAll("#num-icon .item");
      let num = -1;
     window.clearInterval(this.timer1);
      this.timer1 = window.setInterval(donghua, 2000);
      // console.log(this.timer1)
      function donghua() {
        if(!list.length)return
        num++;
        num %= 4;
        for (let i = 0; i < 4; i++) {
          list[i].classList.remove("active");
        }
        list[num].classList.add("active");
      }
      main.onmouseover = function() {
        for (let i = 0; i < 4; i++) {
          list[i].classList.remove("active");
        }
        // console.log(this.timer1)
          window.clearInterval(this.timer1);
          // this.timer1=null
        
      };
      // main.onmouseout = function() {
      //   this.timer1 = window.setInterval(donghua, 2000);
      // };
    }
  },
  created() {
    this.getData_up();
    this.getData_under_l();
    this.getData_under_r();
  },
  mounted() {
    
  },
  beforeDestroy() {
    window.clearTimeout(this.timermove);
    window.clearInterval(this.timer1);
  }
};
</script>
<style scoped >
@import url(./renwujiebie.css);
</style>
