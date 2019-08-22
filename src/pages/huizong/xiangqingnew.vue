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
      <div class="fenxi" @click="fenxi">数据分析</div>
    </div>
    <div id="second">
      <div class="left">
        <div class="n">报警列表</div>
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
                <span @click="toMore(item.number,item.datetime,item)">查看详情</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="n">报警统计</div>
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
     <div class="cover" v-show="showFenXi">
      <div class="alert">
        <!-- <div id="duibi"></div> -->
        <el-steps :active="active"  finish-status="success" v-show="false">
          <el-step title="步骤 1"></el-step>
          <el-step title="步骤 2"></el-step>
          <el-step title="步骤 3"></el-step>
        </el-steps>
        <button @click="close">关闭</button>
        <div class="selwrap">
          
        </div>
        <div id="fenxi-echart" v-show="false">fenxi-echart</div>
        <div class="biaoge">biaoge</div>
        <div class="sub" @click="subDuiBi">开始对比</div>
      </div>
    </div>
  </div>
  </div>
</template>
<style scoped>
@import url("./xiangqingnew.css");
</style>
<script>
import GunDongList from "@/components/gundonglist";
export default {
  components: { GunDongList },
  data() {
    return {
      active:3,
      showFenXi:false,
      bigsmall: true,
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
        { id: "07", name: "区域报警", checked: true },
        { id: "08", name: "逾期报警", checked: true },
        { id: "09", name: "离套报警", checked: true }
      ],
      jigoulist: [],
      series: {
        "03": [],
        "07": [],
        "08": [],
        "09": []
      }
    };
  },
  methods: {
    subDuiBi(){
      this.getDuiBi(32,1,'03,09,07,08','2019-08-16,2019-08-22')
      
    },
    close() {
      this.showFenXi = false;
    },
    fenxi() {
      this.showFenXi = true;
      // this.initEchart();
      this.duiBiEchart()
    },
    upDown() {
      this.bigsmall = !this.bigsmall;
    },
    toMore(n, s, item) {
      let str = this.warningType
        .filter(e => e.checked)
        .map(e => e.id)
        .join();

      if (n == 0) {
        this.$message("暂无数据");
        return;
      }
      this.$router.push({
        name: "XiangQingList",
        params: {
          ...item,
          types: str,
          timeStart: this.timeStart,
          timeEnd: this.timeEnd
        }
      });

      // this.$router.push({
      //   name: "List",
      //   params: { datetime: s }
      // });
    },
    duiBiEchart(){
      let that = this;
      let box = document.getElementById("fenxi-echart");
      let Echart = this.$echarts.init(box);
      let option = {
    //   backgroundColor:'#062D87',
        title : {
                  text: '未来一周气温变化',
                  textStyle:{
                      color:"#ccc"
                  }
              },
              tooltip : {
                  trigger: 'axis'
              },
              legend: {
                  data:['最高温度','最低温度'],
                textStyle:{
                color:"#fff"
                }
              },
              grid: {
                  top: 'middle',
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  height: '80%',
                  containLabel: true
              },
              toolbox: {
                  show : true,
                  feature : {
                      mark : {show: true},
                      dataView : {show: true, readOnly: false},
                      magicType : {show: true, type: ['line', 'bar']},
                      restore : {show: true},
                      saveAsImage : {show: true}
                  }
              },
              calculable : true,
              xAxis : [
                  {
                      type : 'category',
                      boundaryGap : false,
                      data : ['2019-7-1','2019-7-2','2019-7-3','2019-7-4','2019-7-5','2019-7-6','2019-7-7'],
                    axisTick: {
                      show: true //隐藏X轴刻度
                  },
                  axisLabel: {
                      show: true,
                      textStyle: {
                          color: "#ebf8ac" //X轴文字颜色
                      }
                  },
                  }
              ],
              yAxis : [
                  {
                      type : 'value',
                      name:"℃'",
                      nameTextStyle: {
                          color: "#ebf8ac"
                        },           
                        axisLabel : {
                          formatter: '{value}℃'
                      },
                    axisLabel: {
                          show: true,
                          textStyle: {
                              color: "#ebf8ac"
                          }
                      },
                      splitLine: {
                      lineStyle: {
                          type: 'dashed',
                          color: '#DDD'
                      }
                  },
                  }
              ],
              series : [
                  {
                      name:'最高温度',
                      type:'line',
                      min:10,
                      max:40,
                      data:[32, 34, 39, 35, 38, 36, 34],
                      markPoint : {
                          data : [
                              {name : '周最高', value : 39, xAxis: 2, yAxis: 39}
                          ]
                      },
                    lineStyle: {
                          normal: {
                              width: 5,
                              color: {
                                  type: 'linear',

                                  colorStops: [{
                                          offset: 0,
                                          color: '#AAF487' // 0% 处的颜色
                                      },
                                      {
                                          offset: 0.4,
                                          color: '#47D8BE' // 100% 处的颜色
                                      }, {
                                          offset: 1,
                                          color: '#47D8BE' // 100% 处的颜色
                                      }
                                  ],
                                  globalCoord: false // 缺省为 false
                              },
                              shadowColor: 'rgba(71,216,190, 0.5)',
                              shadowBlur: 10,
                              shadowOffsetY: 7
                          }
                      },
                      itemStyle: {
                          normal: {
                              color: '#AAF487',
                              borderWidth: 10,
                              /*shadowColor: 'rgba(72,216,191, 0.3)',
                              shadowBlur: 100,*/
                              borderColor: "#AAF487"
                          }
                      },
                      smooth: true,
                      markLine : {
                          data : [
                              {type : 'average', name: '平均值'}
                          ]
                      }
                  },
              {
                  name:'最低温度',
                  type:'line',
                  min:10,
                  max:40,
                  data:[25, 22, 26, 28, 27, 26, 23],
                  markPoint : {
                      data : [
                          {name : '周最低', value : 22, xAxis: 1, yAxis: 22}
                      ]
                  },
                  lineStyle: {
                      normal: {
                          width: 5,
                          color: {
                              type: 'linear',

                              colorStops: [{
                                      offset: 0,
                                      color: '#F6D06F' // 0% 处的颜色
                                  },
                                  {
                                      offset: 0.4,
                                      color: '#F9A589' // 100% 处的颜色
                                  }, {
                                      offset: 1,
                                      color: '#F9A589' // 100% 处的颜色
                                  }
                              ],
                              globalCoord: false // 缺省为 false
                          },
                          shadowColor: 'rgba(249,165,137, 0.5)',
                          shadowBlur: 10,
                          shadowOffsetY: 7
                      }
                  },
                  itemStyle: {
                      normal: {
                          color: '#F6D06F',
                          borderWidth: 10,
                          /*shadowColor: 'rgba(72,216,191, 0.3)',
                          shadowBlur: 100,*/
                          borderColor: "#F6D06F"
                      }
                  },
                  smooth: true,
                  markLine : {
                      data : [
                          {type : 'average', name : '平均值'}
                      ]
                  }
              }
          ]
        };
        Echart.setOption(option)
    },
    getDuiBi(mid,ip_id,tid,time){
      let objs = { 
        mid,
        ip_id,
        tid,
        time
       };      
      var token = this.$gscookie.getCookie("gun");
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);
      var params = new URLSearchParams();
      params.append("sign", sign);
      params.append("token", token);
     params.append("mid", objs.mid);
     params.append("ip_id", objs.ip_id)
     params.append("tid", objs.tid)
      params.append("time", objs.time)
      this.$axios({
        url:
          "http://s.tronl.cn/weixin/project/index.php?m=Home&c=Index&a=alarm_anal",
        method: "POST",
        changeOrigin: true,
        data: params
      })
      .then((data)=>{
          console.log(data)
      })
      .catch((error)=>{
        console.log(error)
      })
    },
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
        names = "",
        ip_id = "";
      let arr1 = this.warningType.filter(e => e.checked);
      let arr2 = this.jigoulist.filter(e => e.checked);

      types = arr1.map(e => e.id).join();
      names = arr2.map(e => e.id).join();
      ip_id = arr2.map(e => e.ip_id).join();
      // console.log(timeStart, timeEnd, types, names);
      let s = [timeStart, timeEnd].join();
      console.log(s, types, names, ip_id)
      return
      this.getData(s, types, names, ip_id);
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
            fontSize: 14
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
            name: "数量",
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

      let one = {
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
        data: []
      };

      let ser = [];
      that.rightData1.forEach((item, index) => {
        one.name = item;
        one.data = that.series[index];
        ser.push({ ...one });
      });
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
            data: that.echar_date
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "数量",
            min: 0,
            // max: 100,
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
            // name: "占比",
            min: 0,
            // max: 100,
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
        series: []
      };

      option.series = ser;
      EchartNew.setOption(option, true);
    },
    getData(timeStr, typeId = "", jigouId = "", ip_id) {
      let objs = { time: timeStr };
      if (!!typeId) {
        objs = { time: timeStr, tid: typeId, mid: jigouId, ip_id: ip_id };
      }

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
        params.append("ip_id", objs.ip_id);
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
            let obj = this.$gscookie.getCookie("message_obj");
            // console.log(item);
            if (!this.jigoulist.length) {
              this.jigoulist = data.data.data.mec.map((item, index) => {
                if (index === 0) {
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
                // if (obj.mechanism_id === item.id) {
                //   return {
                //     ...item,
                //     checked: true
                //   };
                // } else {
                //   return {
                //     ...item,
                //     checked: false
                //   };
                // }
              });
              let warningType = data.data.data.types.map(e => {
                return {
                  ...e,
                  checked: true
                };
              });
              this.warningType = warningType;
            }

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

            this.series = data.data.data.series;
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
    if (JSON.stringify(obj) == "{}") {
      this.$router.push("/loginput");
      return;
    }
    this.timeStart = obj[0];
    this.timeEnd = obj[1];
    let types = "";
    let arr1 = this.warningType.filter(e => e.checked);
    types = arr1.map(e => e.id).join();
    // console.log("333", item);
    // return;
    this.getData(obj.join(), types);
  },
  mounted() {
    this.move();
    this.$store.commit('setStr',{
      str1:'报警类型',
      str2:'趋势分析'
    })
  },
  destroyed(){
    this.$store.commit('huanyuanStr')
  }
};
</script>