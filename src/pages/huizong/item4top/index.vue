<template>
  <div class="wrap">
    <div id="sel">
      <i class="jiao"></i>
      <i class="jiao"></i>
      <i class="jiao"></i>
      <i class="jiao"></i>
      <div class="items">
        &nbsp;
        &nbsp;
      </div>
      <div class="items" v-if="false">
        <div class="title">
          <span></span>
          查询时间
        </div>
        <div class="sel-wrap">
          查询时间：
          <input type="date" />
          至
          <input type="date" />
          <div class="sub" v-if="false">查询</div>
        </div>
      </div>
      <div class="items" v-if="false">
        <div class="title">
          <span></span>
          报警类型
        </div>
        <div class="type-wrap">
          <div
            class="item"
            :class="{'selected':item.checked}"
            v-for="item,index in types"
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
            :class="{'selected':item.checked}"
            v-for="item,index in mec"
            :key="index"
            @click="changeMec(index)"
          >
            <i></i>
            {{item.mechanism_name}}
          </div>
        </div>
      </div>
      <div class="sub-wrap">
        <div class="sub" @click="sub">确定</div>
      </div>
      <div class="fenxiduibi" @click="fenxi">对比分析</div>
    </div>
    <div id="second">
      <div class="left">
        <div class="n">报警对比</div>
        <div class="c">
          <div id="chart1"></div>
        </div>
      </div>
      <div class="right">
        <div class="n">同比增长率</div>
        <div class="c">
          <div id="chart2"></div>
        </div>
      </div>
    </div>
    <div class="cover" v-show="showFenXi">
      <div class="alert" v-show="steap===1">
        <button @click="close">X</button>
        <!-- <div id="duibi"></div> -->
        <div class="buzou"></div>
        <div class="title">
          <i></i>查询时间
        </div>
        <div class="selwrap">
          查询时间
          <input type="date" v-model="dbtimestart" />
          至
          <input type="date" v-model="dbtimeend" />
          <!-- <div class="sub" >查询</div> -->
        </div>
        <div class="next" @click="next1">下一步</div>
      </div>
      <div class="alert2" v-show="steap===2">
        <button @click="close">X</button>
        <!-- <div id="duibi"></div> -->
        <div class="buzou"></div>
        <div class="title">
          <i></i>报警类型
        </div>
        <div class="typewrap">
          <div
            class="item"
            @click="dbchecktype(index)"
            :class="{selected:item.checked}"
            v-for="item,index in dbwarningtype"
            :key="index"
          >
            <i></i>
            {{item.name}}
          </div>
        </div>
        <div class="next" @click="next2">下一步</div>
      </div>
      <div class="alert3" v-show="steap===3">
        <button @click="close">X</button>
        <!-- <div id="duibi"></div> -->
        <div class="buzou"></div>

        <div class="title">
          <i></i>机构名称
        </div>
        <div class="typewrap">
          <div
            class="item"
            @click="dbjigoucheck(index)"
            :class="{selected:item.checked}"
            v-for="item,index in dbjigoulist"
            :key="index"
          >
            <i></i>
            {{item.mechanism_name}}
          </div>
        </div>
        <div class="titlenew">
          <i></i>查询时间
        </div>
        <div class="selwrap">
          查询时间
          <input type="date" v-model="dbtimechaxun" />
        </div>

        <div class="next" @click="next3">下一步</div>
      </div>
      <div class="alert4" v-show="steap===4">
        <button @click="close">X</button>
        <div id="dbchart"></div>
        <p></p>
        <div class="text">{{dbtext}}</div>
        <div class="next" @click="next4">关闭</div>
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
      warningType: [
        { id: "03", name: "入套报警", checked: true },
        { id: "07", name: "区域报警", checked: true },
        { id: "08", name: "逾期报警", checked: true },
        { id: "09", name: "离套报警", checked: true }
      ],
      showFenXi: false,
      steap: 1,
      dbtimestart: "",
      dbtimeend: "",
      dbtimechaxun: "",
      dbwarningtype: [
        { id: "03", name: "入套报警", checked: false },
        { id: "07", name: "区域报警", checked: false },
        { id: "08", name: "逾期报警", checked: false },
        { id: "09", name: "离套报警", checked: false }
      ],
      selectedType: "",
      dbjigoulist: [],
      dbselectedjigou: "",
      dbtext: "",
      dbnames: ["111", "222"],
      dbx: ["06:00", "07:00", "23:55"],
      dblist: [],
      ip_id: "",
      mechanism_id: "",
      types: [],
      mec: [],
      dataArr: [20, 12, 31, 34, 31, 20, 12, 31, 34],
      dataArr2: [10, 20, 5, 9, 3, 10, 20, 5, 9, 3],
      legendData: ["本月报警", "上月报警"],
      xdata: [],
      rightData1: ["14", "15", "16", "17", "18", "19", "20", "21", "22", "23"],
      rightData2: [393, 438, 485, 631, 689, 824, 987, 1000, 1100, 1200],
      dbdate: [],
      dbDataList: [],
      dbDatax: [],
      dbDataName: []
    };
  },
  methods: {
    sub() {
      let arr = this.mec.filter(e => e.checked).map(e => e.id);
      let ip_id = this.mec.filter(e => e.checked).map(e => e.ip_id);
      if (!arr.length) {
        this.$message({
          type: "warning",
          message: "必须选择至少一个机构"
        });
        return;
      }
      this.getData(this.t_mechanism_id, arr.join(), ip_id.join());
    },

    dbjigoucheck(index) {
      this.dbjigoulist.forEach(e => (e.checked = false));
      this.dbjigoulist[index].checked = !this.dbjigoulist[index].checked;
    },
    typeChange(index) {
      this.types[index].checked = !this.types[index].checked;
    },
    changeMec(index) {
      this.mec[index].checked = !this.mec[index].checked;
    },
    dbchecktype(n) {
      this.dbwarningtype[n].checked = !this.dbwarningtype[n].checked;
      //   this.dbwarningtype.forEach((e, i) => {
      //     if (i === n) {
      //       e.checked = true;
      //     } else {
      //       e.checked = false;
      //     }
      //   });
    },
    next1() {
      if (this.dbtimestart && this.dbtimeend) {
        this.steap = 2;
      } else {
        this.$message({
          type: "warning",
          message: "请选择起止时间"
        });
      }
    },
    next2() {
      let obj = this.dbwarningtype.find(e => e.checked);
      if (obj) {
        this.selectedType = obj.id; //选择的报警类型
        this.steap = 3;
      } else {
        this.$message({
          type: "warning",
          message: "请选择类型"
        });
      }
    },
    next3() {
      let ls = this.dbjigoulist.filter(e => e.checked);
      if (ls.length > 0 && this.dbtimechaxun != "") {
        this.steap = 4;
        let ip_id = ls[0].ip_id;
        let jigoustr = ls.map(e => e.id).join();
        let t_mechanism_id = this.t_mechanism_id;
        let dbtimechaxun = this.dbtimechaxun;
        let jigouid = this.dbjigoulist.find(e => e.checked).id;
        let time = this.dbtimestart + "," + this.dbtimeend;
        let typestr = this.dbwarningtype
          .filter(e => e.checked)
          .map(e => e.id)
          .join();

        this.getDuiBi(
          t_mechanism_id,
          jigouid,
          ip_id,
          typestr,
          time,
          dbtimechaxun
        );
      } else {
        this.$message({
          type: "warning",
          message: "请选择机构或时间"
        });
      }
    },
    next4() {
      this.dbtimestart = "";
      this.dbtimeend = "";
      this.dbtimechaxun = "";
      this.dbwarningtype.forEach(e => (e.checked = false));
      this.dbjigoulist.forEach(e => (e.checked = false));

      this.steap = 1;
      this.showFenXi = false;
    },
    subDuiBi() {
      this.getDuiBi(32, 1, "03,09,07,08", "2019-08-16,2019-08-22");
    },
    close() {
      this.steap = 1;
      this.showFenXi = false;
      this.next4();
    },
    fenxi() {
      this.showFenXi = true;
      // this.initEchart();
      // this.duiBiEchart()
    },
    chartLeft() {
      let that = this;
      let box = document.getElementById("chart1");
      let Echart = this.$echarts.init(box, true);
      var xdata = this.xdata;
      //   [
      //     "A3",
      //     "C2",
      //     "C1",
      //     "A1",
      //     "A4",
      //     "A11",
      //     "C9",
      //     "C3",
      //     "C11",
      //     "A2"
      //   ];
      var legendData = this.legendData;

      var dataArr = this.dataArr;
      var dataArr2 = this.dataArr2;
      var colorSet = new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: "#00CAE0"
        },
        {
          offset: 1,
          color: "#006EFB"
        }
      ]);
      var colorSet2 = new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: "#E37552"
        },
        {
          offset: 1,
          color: "#9E5431"
        }
      ]);
      let option = {
        // backgroundColor: "#000",
        title: {
          // text: '2016年12月长宁区合规成本分析'
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          // show:true,
          data: legendData,
          align: "right",
          right: 10,
          textStyle: {
            color: "#fff"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            axisLabel: {
              textStyle: {
                fontSize: 14,
                color: "#fff"
              }
            },
            axisLine: {
              lineStyle: {
                color: "#00A2FF",
                width: 2
              }
            },
            axisTick: {
              show: false
            },
            // splitLine: {
            //     lineStyle: {
            //         type: 'dashed',
            //         color: '#DDD'
            //     }
            // },
            data: xdata
          }
        ],
        yAxis: [
          {
            type: "value",
            // name: '总价(万元)',
            axisLabel: {
              formatter: "{value}",
              color: "#65F5FD",
              fontSize: 14
            },
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,0)"
                // color:'65F5FD'
              }
            },
            splitLine: {
              lineStyle: {
                type: "dashed",
                color: "#385B71"
              }
            }
          }
        ],
        series: [
          {
            name: legendData[0],
            type: "bar",
            barWidth: 10, //柱子宽度
            barGap: 1, //柱子之间间距
            itemStyle: {
              normal: {
                color: colorSet
                // barBorderRadius: 10,
              }
            },
            data: dataArr
          },
          {
            name: legendData[1],
            type: "bar",
            barWidth: 10, //柱子宽度
            barGap: 1, //柱子之间间距
            itemStyle: {
              normal: {
                color: colorSet2
                // barBorderRadius: 10,
              }
            },
            data: dataArr2
          }
        ]
      };

      Echart.setOption(option);
    },
    chartRight() {
      let that = this;
      let box = document.getElementById("chart2");
      let Echart = this.$echarts.init(box, true);
      let option = {
        // backgroundColor: new this.$echarts.graphic.LinearGradient(
        //   0,
        //   0,
        //   0,
        //   1,
        //   [
        //     {
        //       offset: 0,
        //       color: "#c86589"
        //     },
        //     {
        //       offset: 1,
        //       color: "#06a7ff"
        //     }
        //   ],
        //   false
        // ),
        title: {
          //   text: "数量视图",
          left: "center",
          bottom: "3%",
          textStyle: {
            color: "#fff",
            fontSize: 16
          }
        },
        grid: {
          top: "20%",
          left: "5%",
          right: "5%",
          bottom: "15%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.rightData1,
          //["14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]
          axisLabel: {
            margin: 30,
            color: "#ffffff63"
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: true,
            length: 25,
            lineStyle: {
              color: "#ffffff1f"
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#ffffff1f"
            }
          }
        },
        yAxis: [
          {
            type: "value",
            position: "right",
            axisLabel: {
              margin: 20,
              color: "#ffffff63"
            },

            axisTick: {
              show: true,
              length: 15,
              lineStyle: {
                color: "#ffffff1f"
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#ffffff1f"
              }
            },
            axisLine: {
              lineStyle: {
                color: "#fff",
                width: 2
              }
            }
          }
        ],
        series: [
          {
            name: "注册总量",
            type: "line",
            smooth: true, //是否平滑曲线显示
            showAllSymbol: true,
            symbol: "circle",
            symbolSize: 6,
            lineStyle: {
              normal: {
                color: "#fff" // 线条颜色
              }
            },
            label: {
              show: true,
              position: "top",
              textStyle: {
                color: "#fff"
              }
            },
            itemStyle: {
              color: "red",
              borderColor: "#fff",
              borderWidth: 3
            },
            tooltip: {
              show: false
            },
            areaStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "#eb64fb"
                    },
                    {
                      offset: 1,
                      color: "#3fbbff0d"
                    }
                  ],
                  false
                )
              }
            },
            data: this.rightData2
          }
        ]
      };

      Echart.setOption(option);
    },
    duibichart() {
      let that = this;
      let box = document.getElementById("dbchart");
      let Echart = this.$echarts.init(box, true);
      function rgb() {
        //rgb颜色随机
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        var rgb = "rgb(" + r + "," + g + "," + b + ")";
        return rgb;
      }
      let one = {
        name: "移动",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
          normal: {
            width: 3
          }
        },
        areaStyle: {
          normal: {
            color: new this.$echarts.graphic.LinearGradient(
              0,
              0,
              1,
              0,
              [
                {
                  offset: 0,
                  color: "rgba(16,97,204, 0.3)"
                },
                {
                  offset: 0.8,
                  color: "rgba(17,235,210, 0)"
                }
              ],
              false
            ),
            shadowColor: "rgba(0, 0, 0, 0.1)",
            shadowBlur: 10
          }
        },
        itemStyle: {
          normal: {
            color: "#ccc"
          },
          emphasis: {
            color: "rgb(0,196,132)",
            borderColor: "rgba(0,196,132,0.2)",
            extraCssText: "box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);",
            borderWidth: 10
          }
        },
        data: null
      };
      //  this.dbDataList=data.data.data
      // this.dbDatax=data.data.dates
      // this.dbDataName=data.data.tname
      let ser = [];
      this.dbDataList.forEach((item, index) => {
        let col = rgb();
        let obj = {
          ...one,
          name: this.dbDataName[index],
          itemStyle: { normal: { color: col } },
          data: item
        };
        ser.push(obj);
      });

      let option = {
        // backgroundColor: "#424956",
        // title: {
        //     text: '请求数',
        //     textStyle: {
        //         fontWeight: 'normal',
        //         fontSize: 16,
        //         color: '#F1F1F3'
        //     },
        //     left: '6%'
        // },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              color: "#57617B"
            }
          }
        },
        legend: {
          icon: "rect",
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: this.dbDataName,
          //   ["移动"],
          right: "4%",
          textStyle: {
            fontSize: 12,
            color: "#fff"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: "#fff"
              }
            },
            data: this.dbDatax
            // [
            //   "1日",
            //   "2日",
            //   "3日",
            //   "4日",
            //   "5日",
            //   "6日",
            //   "7日",
            //   "8日",
            //   "9日"
            // ]
          }
        ],
        yAxis: [
          {
            type: "value",
            // name: "单位（%）",
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: "#fff"
              }
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14
              }
            },
            splitLine: {
              lineStyle: {
                color: "#57617B"
              }
            }
          }
        ],
        series: ser
      };
      Echart.setOption(option);
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
            this.ip_id = data.data.mec[0].ip_id;
            this.types = data.data.types.map(item => {
              return {
                ...item,
                checked: false
              };
            });
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
            this.dbjigoulist = data.data.mec.map((item, index) => {
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
            // console.log(this.dbjigoulist);
            this.getData(this.t_mechanism_id, this.t_mechanism_id, this.ip_id);
            // this.warnTypes = data.data.types.map(item => {
            //   return {
            //     ...item,
            //     checked: true
            //   };
            // });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getData(t_mechanism_id, mid, ip_id) {
      let objs = {
        t_mechanism_id: t_mechanism_id,
        mid: mid,
        ip_id: ip_id
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
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=Home&c=Index&a=moth_ainfo",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.status == 200) {
            // console.log(data.data);
            this.dataArr = data.data.number;
            this.dataArr2 = data.data.last;
            this.xdata = data.data.tname;
            this.rightData1 = data.data.tname;
            this.rightData2 = data.data.ratio;
            this.chartLeft();
            this.chartRight();
            console.log(data.data.ratio);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getDuiBi(t_mechanism_id, mid, ip_id, tid, time, ntime) {
      let objs = {
        t_mechanism_id, //
        mid, //机构id
        ip_id,
        tid,
        time,
        ntime
      };
      console.log(objs);
      var token = this.$gscookie.getCookie("gun");
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);
      var params = new URLSearchParams();
      params.append("sign", sign);
      params.append("token", token);
      params.append("t_mechanism_id", objs.t_mechanism_id);
      params.append("mid", objs.mid);
      params.append("ip_id", objs.ip_id);
      params.append("tid", objs.tid);
      params.append("time", objs.time);
      params.append("ntime", objs.ntime);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=Home&c=Index&a=moth_info",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.status == 200) {
            // console.log(data.data);
            this.dbDataList = data.data.data;
            this.dbDatax = data.data.dates;
            this.dbDataName = data.data.tname;
            // console.log(data.data.tname);
            this.dbtext = "";
            let length = data.data.content.length;
            let n = 0;
            let timer = setInterval(() => {
              if (n < length) {
                this.dbtext += data.data.content[n];
                n++;
              } else {
                clearInterval(timer);
              }
            }, 100);
            this.duibichart();
            return;
            // this.dbnames = data.data.mname;
            // this.dbx = data.data.days;
            // this.dblist = data.data.data;
            // // this.dbtext=data.data.content;
            // let length = data.data.content.length;
            // let n = 0;
            // this.dbtext = "";
            // let timer = setInterval(() => {
            //   if (n < length) {
            //     this.dbtext += data.data.content[n];
            //     n++;
            //   } else {
            //     clearInterval(timer);
            //   }
            // }, 100);
            // this.duiBiEchart();
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created() {
    //t_mechanism_id    mid    ip_id
    let item = this.$gscookie.getCookie("message_obj");
    let obj = this.$route.params;
    this.t_mechanism_id = item.mechanism_id;
    this.getTypes();
  },
  mounted() {}
};
</script>