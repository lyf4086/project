<template>
  <div class="wrap">
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
          <div class="sub" v-if="false">查询</div>
        </div>
      </div>
      <div class="items">
        <div class="title">
          <span></span>
          报警类型
        </div>
        <div class="type-wrap">
          <div
            class="item"
            :class="{'selected':item.checked}"
            v-for="item,index in warningType"
            :key="index"
            @click="typeChange(index)"
          >
            <i></i>
            {{item.name}}
          </div>
        </div>
      </div>
      <div class="items">
        <div class="title">
          <span></span>
          机构名称
        </div>
        <div class="jg-wrap">
          <div
            class="item"
            :class="{selected:item.checked}"
            v-for="item,index in jigoulist"
            :key="index"
            @click="jigouSelect(index)"
          >
            <i></i>
            {{item.mechanism_name}}
          </div>
        </div>
      </div>
      <div class="sub-wrap">
        <div class="sub" @click="subCheckDate">确定</div>
      </div>
    </div>
    <div id="second">
      <div class="left">
        <div class="n">报警类型</div>
        <div class="c">
          <div class="tit">
            <span>机构名称</span>
            <span>报警日期</span>
            <span>报警数量</span>
            <span>查看详情</span>
          </div>
          <div class="awrap">
            <div class="list-new" id="list-new">
              <div class="item" v-for="item,index in dataList">
                <span>{{item.mname}}</span>
                <span>{{item.datetime}}</span>
                <span>{{item.number}}</span>
                <span>查看详情</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="n">报警分析</div>
        <div class="c">
          <div id="echart-new1"></div>
        </div>
      </div>
    </div>
    <div id="three">
      <div id="echart-new2"></div>
    </div>
    <!-- <div class="left" v-if="false">
      <div class="title">
        <span>机构名称</span>
        <span>报警日期</span>
        <span>报警数量</span>
        <span>查看详情</span>
      </div>
      <div class="list">
        <div class="item" v-for="item,index in dataList" :key="index">
          <span>{{item.mname}}</span>
          <span>{{item.datetime}}</span>
          <span>{{item.number}}</span>
          <span class="more" @click="toMore(item.datetime)">查看详情</span>
        </div>
      </div>
    </div>
    <div class="right" v-if="false">
      <div id="chart-right"></div>
    </div>
    <div class="bottom" v-if="false">
      <div id="chart"></div>
    </div>-->
  </div>
</template>
<style scoped>
@import url("./xiangqingnew.css");
</style>
<script>
export default {
  data() {
    return {
      echar1_names: [],
      echar_date: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      echar_num: [820, 932, 901, 934, 1290, 1330, 1320],
      list: [],
      selected: [],
      dataList: [],
      obj: null,
      rightData1: [],
      rightData2: [],
      timeStart: "",
      timeEnd: "",
      warningType: [
        { id: "03", name: "入套报警", checked: true },
        { id: "09", name: "离套报警", checked: true },
        { id: "07", name: "区域报警", checked: true },
        { id: "08", name: "逾期报警", checked: true }
      ],
      jigoulist: [],
      series: {
        "03": [0, 2, 0, 4, 0, 0, 0],
        "07": [0, 5, 0, 0, 0, 6, 0],
        "08": [0, 0, 0, 8, 0, 0, 0],
        "09": [9, 0, 0, 7, 0, 3, 0]
      }
    };
  },
  methods: {
    typeChange(index) {
      let { checked } = this.warningType[index];
      this.warningType[index].checked = !checked;
    },
    jigouSelect(index) {
      let { checked } = this.jigoulist[index];
      this.jigoulist[index].checked = !checked;
    },
    subCheckDate() {
      let { timeStart, timeEnd } = this;
      let types = "",
        names = "";
      let arr1 = this.warningType.filter(e => e.checked);
      let arr2 = this.jigoulist.filter(e => e.checked);
      types = arr1.map(e => e.id).join();
      names = arr2.map(e => e.id).join();
      console.log(timeStart, timeEnd, types, names);
      let s = [timeStart, timeEnd].join();
      this.getData(s, types, names);
    },
    move() {
      var $uList = $("#list-new");
      var timer = null;
      //触摸清空定时器
      $uList
        .hover(
          function() {
            clearInterval(timer);
          },
          function() {
            //离开启动定时器
            timer = setInterval(function() {
              scrollList($uList);
            }, 2000);
          }
        )
        .trigger("mouseleave"); //自动触发触摸事件
      //滚动动画
      function scrollList(obj) {
        //获得当前<li>的高度
        var scrollHeight = $("#list-new .item:first").height();
        //滚动出一个<li>的高度
        $uList.stop().animate(
          {
            marginTop: -scrollHeight
          },
          700,
          function() {
            //动画结束后，将当前<ul>marginTop置为初始值0状态，再将第一个<li>拼接到末尾。
            $uList
              .css({
                marginTop: 0
              })
              .find(".item:first")
              .appendTo($uList);
          }
        );
      }
    },

    chartNew1() {
      let that = this;
      let box = document.getElementById("echart-new1");
      let EchartNew = this.$echarts.init(box);
      let option = {
        // backgroundColor: "#000",
        tooltip: {},
        grid: {
          top: "5%"
        },
        legend: {
          data: ["威胁值"],
          right: "10%",
          top: "5%",
          textStyle: {
            color: "#fff",
            fontSize: 24
          }
        },
        xAxis: {
          // data: [
          //   "swc-sdhgq",
          //   "swc-sdh1q",
          //   "swc-sdh2gq",
          //   "swc-sdhg3",
          //   "swc-sdhg4"
          // ], //横坐标

          data: that.rightData1,
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
              color: "#3a6785", //网格横线颜色
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
            name: "--",
            type: "bar",
            barWidth: 30,
            // data: [30, 49, 16, 60, 26], //数据
            data: that.rightData2,
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
      EchartNew.setOption(option);
    },
    chartNew2() {
      let that = this;
      let box = document.getElementById("echart-new2");
      let EchartNew = this.$echarts.init(box);

      var fontColor = "#30eee9";
      let option = {
        title: {
          text: "各类型报警占比",
          top: "3%",
          left: "center",
          textStyle: {
            color: "#FFF",
            align: "center"
          }
        },
        // backgroundColor: "#11183c",
        grid: {
          left: "2%",
          right: "2%",
          top: "20%",
          bottom: "5%",
          containLabel: true
        },
        tooltip: {
          show: true,
          trigger: "item"
        },
        legend: {
          show: true,
          x: "center",
          top: "12%",
          y: "35",
          icon: "stack",
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: "#1bb4f6"
          },
          // data: ["入套报警", "离套报警"]
          data: that.rightData1
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisLabel: {
              color: fontColor
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#397cbc"
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: "#3a6785"
              }
            },
            data: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月"
            ]
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "数量",
            min: 0,
            max: 100,
            axisLabel: {
              formatter: "{value}",
              textStyle: {
                color: "#2ad1d2"
              }
            },
            axisLine: {
              lineStyle: {
                color: "#27b4c2"
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#11366e"
              }
            }
          },
          {
            type: "value",
            name: "占比",
            min: 0,
            max: 100,
            axisLabel: {
              formatter: "{value} %",
              textStyle: {
                color: "#186afe"
              }
            },
            axisLine: {
              lineStyle: {
                color: "#186afe"
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#3a6785"
              }
            }
          }
        ],
        series: [
          {
            name: "入套报警",
            type: "line",
            stack: "总量",
            symbol: "circle",
            symbolSize: 8,
            itemStyle: {
              normal: {
                color: "#0092f6",
                lineStyle: {
                  color: "#0092f6",
                  width: 1
                },
                areaStyle: {
                  //color: '#94C9EC'
                  color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: "rgba(7,44,90,0.3)"
                    },
                    {
                      offset: 1,
                      color: "rgba(0,146,246,0.9)"
                    }
                  ])
                }
              }
            },
            markPoint: {
              itemStyle: {
                normal: {
                  color: "red"
                }
              }
            },
            // data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 260, 280]
            data: that.series["03"]
          },
          {
            name: "离套报警",
            type: "line",
            stack: "总量",
            symbol: "circle",
            symbolSize: 8,

            itemStyle: {
              normal: {
                color: "#00d4c7",
                lineStyle: {
                  color: "#00d4c7",
                  width: 1
                },
                areaStyle: {
                  //color: '#94C9EC'
                  color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: "rgba(7,44,90,0.3)"
                    },
                    {
                      offset: 1,
                      color: "rgba(0,212,199,0.9)"
                    }
                  ])
                }
              }
            },
            // data: [220, 182, 191, 210, 230, 270, 270, 201, 154, 140, 240, 250]
            data: that.series["07"]
          },
          {
            name: "区域报警",
            type: "line",
            stack: "总量",
            symbol: "circle",
            symbolSize: 8,

            itemStyle: {
              normal: {
                color: "#00d4c7",
                lineStyle: {
                  color: "#00d4c7",
                  width: 1
                },
                areaStyle: {
                  //color: '#94C9EC'
                  color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: "rgba(7,44,90,0.3)"
                    },
                    {
                      offset: 1,
                      color: "rgba(0,212,199,0.9)"
                    }
                  ])
                }
              }
            },
            // data: [220, 182, 191, 210, 230, 270, 270, 201, 154, 140, 240, 250]
            data: that.series["08"]
          },
          {
            name: "逾期报警",
            type: "line",
            stack: "总量",
            symbol: "circle",
            symbolSize: 8,

            itemStyle: {
              normal: {
                color: "#00d4c7",
                lineStyle: {
                  color: "#00d4c7",
                  width: 1
                },
                areaStyle: {
                  //color: '#94C9EC'
                  color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: "rgba(7,44,90,0.3)"
                    },
                    {
                      offset: 1,
                      color: "rgba(0,212,199,0.9)"
                    }
                  ])
                }
              }
            },
            // data: [220, 182, 191, 210, 230, 270, 270, 201, 154, 140, 240, 250]
            data: that.series["09"]
          }
        ]
      };
      EchartNew.setOption(option);
    },
    getData(timeStr, typeId = "", jigouId = "") {
      let objs = { time: timeStr };
      if (!!typeId) {
        objs = { time: timeStr, tid: typeId, mid: jigouId };
      }
      console.log(objs);
      var token = this.$gscookie.getCookie("gun");
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);
      var params = new URLSearchParams();
      params.append("sign", sign);
      params.append("token", token);
      params.append("time", objs.time);
      if (!!typeId) {
        params.append("tid", objs.tid);
        params.append("mid", objs.mid);
      }
      this.$axios({
        url:
          "http://s.tronl.cn/weixin/project/index.php?m=home&c=Index&a=alarm_info",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.status == 200) {
            this.jigoulist = data.data.data.mec.map(item => {
              return {
                ...item,
                checked: true
              };
            });
            this.echar_date = data.data.data.days;
            this.echar_num = data.data.data.value;
            this.echar1_names = data.data.data.mname;
            this.list = data.data.data.series;
            this.selected = data.data.data.selected;
            this.dataList = data.data.list;
            let o = {};
            data.data.data.mname.forEach((e, i) => {
              if (i == 0) {
                o[e] = true;
              } else {
                o[e] = false;
              }
            });
            this.selected = o;
            this.rightData1 = data.data.data.type;
            this.rightData2 = data.data.data.cou;

            this.chartNew1();
            this.series["03"] = data.data.data.series["03"];
            this.series["07"] = data.data.data.series["07"];
            this.series["08"] = data.data.data.series["08"];
            this.series["09"] = data.data.data.series["09"];
            this.chartNew2();
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created() {
    let str = this.$gscookie.getCookie("gun");
    if (JSON.stringify(str) == "{}") {
      this.$router.push("/loginput");
    }
    let item = this.$gscookie.getCookie("message_obj");
    if (item.role_id == 3) {
      this.$router.push({
        name: "HuiZong"
      });
    }
    let obj = this.$route.params;
    this.obj = obj;
    // console.log(obj);
    this.timeStart = obj[0];
    this.timeEnd = obj[1];
    this.getData(obj.join());
  },
  mounted() {
    this.move();
  }
};
</script>