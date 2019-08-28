<template>
  <div class="wrap">
    <div class="left">
      <div class="up">
        <div class="title">数据汇总</div>
        <div id="left_top"></div>
      </div>
      <div class="down">
        <div class="title">各类型枪支数量</div>
        <div id="left_bottom">1</div>
      </div>
    </div>
    <div class="center">
      <div class="up">
        
      </div>
      <div class="down">
        <div class="title">枪瞄绑定数量</div>
        <div id="center_down"></div>
      </div>
    </div>
    <div class="right">
      <div class="title">各类型枪柜数量</div>
      <div id="right_up"></div>
      <div class="titlewrap">
        <span>枪柜名称</span>
        <span>枪柜编号</span>
        <span>枪柜类型</span>
      </div>
      <div class="content">
        <div class="list">
          <div class="item" v-for="item,index in dataList" :key="index">
            <span>{{item.vname}}</span>
            <span>{{item.vcode}}</span>
            <span>{{item.vtype}}</span>
          </div>
        </div>
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
      dataList: [],
      char1Num: [32, 24, 15, 12, 6],
      char1Name: ["西安市", "威阳市", "延安市", "宝鸡市", "南洛市"],
      char2Data: [30, 49, 26, 60, 26],
      char2Name: ["11", "22", "33", "44", "55"],
      char3Name: ["周一", "周二", "周三", "周四", "周五"],
      char3Data: [300, 200, 341, 374, 390],
      char4Name: ["房地产开发", "物业管理", "其他"],
      char4Data: [
        { value: 132.9, name: "房地产开发" },
        { value: 52.8, name: "物业管理" },
        { value: 10.4, name: "其他" }
      ]
    };
  },
  methods: {
    chartLeftTop() {
      let that = this;
      let box = document.getElementById("left_top");
      let Echart = this.$echarts.init(box);
      let data = that.char1Num;
      let titlename = that.char1Name;
      let valdata = data;
      let option = {
        // backgroundColor: "#081534",
        title: {
          //   text: "本省外市TOP5",
          show: true,
          textStyle: {
            color: "#ffffff",
            fontSize: 12,
            fontWeight: "500"
          }
        },
        grid: {
          top: "10%",
          left: "24%"
        },
        tooltip: {
          trigger: "axis",
          formatter: function(c) {
            let d;
            for (let i = 0; i < c.length; i++) {
              if (c[i].axisIndex === 0) {
                d = c[i].axisValue + " : " + c[i].data + "%";
              }
            }
            return d;
          }
          // axisPointer: {
          //     type: 'shadow'
          // }
        },
        xAxis: {
          show: false
        },
        yAxis: [
          {
            show: true,
            data: titlename,
            inverse: true,
            max: 4,
            axisLabel: {
              textStyle: {
                fontSize: 12,
                color: "#fff"
              }
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          },
          {
            show: true,
            inverse: true,
            data: valdata,
            max: 4,
            axisLabel: {
              textStyle: {
                fontSize: 12,
                color: "#fff"
              }
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            type: "pictorialBar",
            yAxisIndex: 0,
            barWidth: 10,
            // symbol: 'path://d="M150 130 L130 50 L170 50 Z"',
            symbol: 'path://d="M70 90 L130 100 L130 80 Z"',
            itemStyle: {
              color: "#1bb1f4",
              emphasis: {
                opacity: 1
              }
            },
            data: data
          },
          {
            symbol: "circle",
            symbolSize: 16,
            color: "#1bb1f4",
            symbolOffset: ["50%", 0],
            symbolPosition: "end",
            type: "pictorialBar",
            yAxisIndex: 1,
            data: data
          }
        ]
      };
      Echart.setOption(option);
    },
    chartLeftBottom() {
      let that = this;
      let box = document.getElementById("left_bottom");
      let Echart = this.$echarts.init(box);
      let option = {
        // backgroundColor: "#fff",
        tooltip: {},
        grid: {
          top: "5%",
          right: "3%",
          bottom: "25%"
        },
        // legend: {
        //   data: ["威胁值"],
        //   right: "10%",
        //   top: "5%",
        //   textStyle: {
        //     color: "#fff",
        //     fontSize: 12
        //   }
        // },
        xAxis: {
          data: that.char2Name, //横坐标
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0,
            rotate: 25,
            textStyle: {
              color: "#fff",
              fontSize: 12
            }
          },
          axisLine: {
            lineStyle: {
              type: "solid",
              color: "#fff",
              width: "1  " //坐标线的宽度
            }
          }
        },
        yAxis: {
          splitLine: {
            show: true,
            lineStyle: {
              color: "#40A1EA", //网格横线颜色
              width: 1,
              type: "solid"
            }
          },
          axisLabel: {
            textStyle: {
              color: "#fff",
              fontSize: 12 //坐标值得具体的颜色
            }
          },
          axisLine: {
            show: false
          }
        },
        series: [
          {
            name: "威胁值",
            type: "bar",
            barWidth: 30,
            data: that.char2Data, //数据
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#06B5D7" }, //柱图渐变色
                  { offset: 0.5, color: "#44C0C1" }, //柱图渐变色
                  { offset: 1, color: "#71C8B1" } //柱图渐变色
                ])
              },
              emphasis: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#71C8B1" }, //柱图高亮渐变色
                  { offset: 0.7, color: "#44C0C1" }, //柱图高亮渐变色
                  { offset: 1, color: "#06B5D7" } //柱图高亮渐变色
                ])
              }
            }
          }
        ]
      };
      Echart.setOption(option);
    },
    chartCenterUp() {
      
    },
    chartCenterBottom() {
      let that = this;
      let box = document.getElementById("center_down");
      let Echart = this.$echarts.init(box);
      var a = 14; //X fontSize
      var b = 12; //轴数据 fontSize
      var xAxisTextColor = "#FFFFFF"; //'#4e7199';//字体颜色
      var legendColor = "#FFFFFF"; //legend颜色

      var option = {
        // backgroundColor: "#000000",
        tooltip: {
          trigger: "axis",
          formatter: function(itme) {
            return itme[0].name + "：" + itme[0].value;
          }
        },
        grid: {
          top: "10%",
          left: "6%",
          bottom: "14%",
          right: "3%"
        },
        yAxis: [
          {
            name: "%",
            nameTextStyle: {
              color: xAxisTextColor,
              fontSize: a
            },

            type: "value",
            axisLabel: {
              interval: 0,
              color: "#d3e0fa",
              textStyle: {
                color: xAxisTextColor,
                fontSize: a
              }
            },
            splitLine: {
              show: true
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          }
        ],
        xAxis: [
          {
            type: "category",
            data: that.char3Name,
            axisLabel: {
              interval: 0,
              color: "#d3e0fa"
            },

            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            splitArea: {
              show: false
            }
          }
        ],
        series: [
          {
            name: "线损率",
            type: "pictorialBar",
            symbol: "path://M35,0L35,70L0,70z M35,0L35,70L70,70z",
            data: that.char3Data,
            barWidth: 40,
            // barGap: 1, //柱子之间间距
            symbolOffset: [0, -15],
            z: 99,
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0,
                    color: "#0788EE"
                  },
                  {
                    offset: 0.5,
                    color: "#0788EE"
                  },
                  {
                    offset: 0.5,
                    color: "#15B8F9"
                  },
                  {
                    offset: 1,
                    color: "#15B8F9"
                  }
                ]),
                opacity: 1
              }
            }
          },
          {
            // name: '年报上报率2',
            type: "pictorialBar",
            symbol: "diamond",
            barWidth: 40,
            symbolSize: ["100%", 30],
            z: 99,
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0,
                    color: "#0788EE"
                  },
                  {
                    offset: 0.5,
                    color: "#0788EE"
                  },
                  {
                    offset: 0.5,
                    color: "#15B8F9"
                  },
                  {
                    offset: 1,
                    color: "#15B8F9"
                  }
                ]),
                opacity: 1
              }
            },
            data: [1, 1, 1, 1, 1]
          }
        ]
      };
      Echart.setOption(option);
    },
    chartRight() {
      let that = this;
      let box = document.getElementById("right_up");
      let Echart = this.$echarts.init(box);
      app.title = "环形图";

      let option = {
        tooltip: {
          textStyle: {
            fontSize: "12"
          },
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "left",
          textStyle: {
            color: "#fff"
          },
          data: that.char4Name
        },
        series: [
          {
            name: "2019年万科半年报",
            type: "pie",
            radius: ["50%", "70%"],
            color: ["#FF8352", "#E271DE", "#00FFFF", "#4AEAB0"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "18",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: that.char4Data
          }
        ]
      };

      Echart.setOption(option);
    },
    getData(t_mechanism_id) {
      let objs = {
        t_mechanism_id
      };
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
          "/weixin/project/index.php?m=Home&c=Index&a=aggre",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.status == 200) {
            // console.log(data);
            let arr = data.data.da.sort((a, b) => b.value - a.value);
            this.char1Num = arr.map(e => e.value);
            this.char1Name = arr.map(e => e.name);
            this.chartLeftTop();
            this.char2Name = data.data.data.gname;
            this.char2Data = data.data.data.gcou;
            this.chartLeftBottom();
            this.char3Name = data.data.data.gname;
            this.char3Data = data.data.data.gg;
            this.chartCenterBottom();
            this.char4Name = data.data.data.vname;
            this.char4Data = data.data.data.lcou.map((e, i) => {
              return {
                name: data.data.data.vname[i],
                value: e
              };
            });
            this.chartRight();
            this.dataList = data.data.loc;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created() {},
  mounted() {
    let mes = this.$gscookie.getCookie("message_obj");
    this.t_mechanism_id = mes.mechanism_id;
    this.getData(mes.mechanism_id);

 
  }
};
</script>