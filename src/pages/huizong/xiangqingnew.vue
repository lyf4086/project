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
            v-for="(item,index) in warningType"
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
            v-for="(item,index) in jigoulist"
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
      <div class="fenxiduibi" @click="fenxi">对比分析</div>
    </div>
    <div id="second">
      <div class="left">
        <div class="n" >报警列表</div>
        <div class="c">
          <div class="tit">
            <span>机构名称</span>
            <span>报警日期</span>
            <span>报警数量</span>
            <span>查看详情</span>
          </div>
          <div class="awrap">
            <div class="list-new" id="list-new">
              <div class="item" v-for="(item,index) in dataList" :key="index">
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
      <div class="alert"  v-show="steap===1">
        <button @click="close">X</button>
        <!-- <div id="duibi"></div> -->
        <div class="buzou"></div>
        <div class="title">
          <i></i>查询时间
        </div>
        <div class="selwrap">
          查询时间 <input type="date" v-model="dbtimestart">
          至
          <input type="date" v-model="dbtimeend">
          <!-- <div class="sub" >查询</div> -->
        </div>
        <div class="next" @click="next1">下一步</div>
      </div>
      <div class="alert2"  v-show="steap===2">
        <button  @click="close">X</button>
        <!-- <div id="duibi"></div> -->
        <div class="buzou"></div>
        <div class="title">
          <i></i>报警类型
        </div>
        <div class="typewrap">
          <div class="item " @click="dbchecktype(index)" :class="{selected:item.checked}" v-for="item,index in dbwarningtype" :key="index">
            <i></i>{{item.name}}
          </div>
        </div>
        <div class="next" @click="next2">下一步</div>
      </div>
      <div class="alert3"  v-show="steap===3" >
         <button  @click="close">X</button>
        <!-- <div id="duibi"></div> -->
        <div class="buzou"></div>
        <div class="title">
          <i></i>机构名称
        </div>
        <div class="typewrap">
          <div class="item " @click="dbjigoucheck(index)" :class="{selected:item.checked}" v-for="item,index in dbjigoulist" :key="index">
            <i></i>{{item.mechanism_name}}
          </div>
        </div>
        <div class="next" @click="next3">下一步</div>
      </div>
      <div class="alert4" v-show="steap===4">
        <button @click="close">X</button>
        <div id="dbchart"></div>
        <p>分析结果</p>
        <div class="text">
          {{dbtext}}
        </div>
        <div class="next"  @click="next4">关闭</div>
      </div>
    </div>
  <!-- </div> -->
</div>
</template>
<style scoped>
@import url("./xiangqingnew.css");
</style>
<script>
// import GunDongList from "@/components/gundonglist";
import { setInterval, clearInterval } from 'timers';
export default {
  data() {
    return {
      steap:1,
      dbtimestart:'',
      dbtimeend:'',
      dbwarningtype:[
        { id: "03", name: "入套报警", checked: false },
        { id: "07", name: "区域报警", checked: false },
        { id: "001", name: "逾期报警", checked: false },
        { id: "09", name: "离套报警", checked: false }
      ],
      selectedType:'',
      dbjigoulist:[],
      dbselectedjigou:'',
      dbtext:'',
      dbnames:['111','222'],
      dbx:['06:00', '07:00', '23:55'],
      dblist:[],
      // active:3,
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
        { id: "09", name: "离套报警", checked: true },
        { id: "07", name: "区域报警", checked: true },
        { id: "001", name: "逾期报警", checked: true}  
      ],
      jigoulist: [],
      series: {
        "03": [],
        "09": [],
        "001": [],
        "09": []
      },
     loading:null
    };
  },
  methods: {
    
    dbchecktype(n){
      this.dbwarningtype.forEach((e,i)=>{
        if(i===n){
          e.checked=true
        }else{
          e.checked=false
        }
      })
    },
    dbjigoucheck(index){
      this.dbjigoulist[index].checked=!this.dbjigoulist[index].checked
    },
    next1(){
      if(this.dbtimestart && this.dbtimeend){
        if(new Date(this.dbtimestart).getTime() >new Date(this.dbtimeend).getTime()){
          this.$message({
            type:"error",
            message:"请重新选择时间"
          })
          return
        }
        this.steap=2;
      }else{
        this.$message({
          type:'warning',
          message:'请选择起止时间'
        })
        
      }
      
    },
    next2(){
      let obj=this.dbwarningtype.find(e=>e.checked)
      if(obj){
        this.selectedType=obj.id//选择的报警类型
        this.steap=3
      }else{
        this.$message({
          type:'warning',
          message:'请选择类型'
        })
      }
      
    },
    next3(){
      let ls=this.dbjigoulist.filter(e=>e.checked)
      if(ls.length>0){
        this.steap=4;
        let ip_id=ls[0].ip_id
        let jigoustr=ls.map(e=>e.id).join()
        let strT=this.dbtimestart+','+this.dbtimeend;//时间区间字符串
        // console.log(this.dbtimestart,this.dbtimeend,this.selectedType,this.dbselectedjigou)
        this.getDuiBi(jigoustr,ip_id,this.selectedType,strT)
      }else{
        this.$message({
          type:'warning',
          message:'请选择机构'
        })
      }
      
    },
    next4(){
      this.dbtimestart='',
      this.dbtimeend='',
      this.dbwarningtype.forEach(e=>e.checked=false)
      this.dbjigoulist.forEach(e=>e.checked=false)
      this.steap=1;
      this.showFenXi=false
    },
    subDuiBi(){
      this.getDuiBi(32,1,'03,09,07,08','2019-08-16,2019-08-22')
      
    },
    close() {
      this.steap=1;
      this.showFenXi = false;
      this.next4()
    },
    fenxi() {
      this.showFenXi = true;
      // this.initEchart();
      // this.duiBiEchart()
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
      let box = document.getElementById("dbchart");
      let Echart = this.$echarts.init(box,true);
      let one={
                name: '111',
                data: [0.3, 0.9, 0.7, 0.9, 0.8, 0.3],
                type: 'line',
                smooth: true, //折线是否平滑
                areaStyle: {
                    opacity: 0
                },
                itemStyle: {
                    normal: {
                        color: "#197CD8", //小圆点的颜色
                        lineStyle: {
                            color: "#197CD8" //折线的颜色
                        }
                    }
                }
            }
      let dbseries=this.dblist.map((e,i)=>{
        return {
          ...one,
          name:this.dbnames[i],
          data:e
        }
      })
      let option = {
        postion:'200',
        // backgroundColor: '#598193', //画布背景
        title: {
            text: '',
            x: "center",
            y: "-5",
            textStyle: {
                fontSize: 16,
                color: '#fff'
            }
        },
        legend: {
            icon: 'line',
            top: 20,
            textStyle: {
            color: "#fff",
            data:this.dbnames
            // ['原方案','建议方案'] 
        },

        itemWidth: 10,  // 设置宽度
        itemHeight: 10, // 设置高度
        },
        tooltip: {
            trigger: 'axis',
        },
        xAxis: { //x轴
            type: 'category',
            boundaryGap: false, //坐标轴两边留白策略
            data: this.dbx,
            // ['06:00', '07:00', '23:55'],
            axisLabel: {
                interval: 0,
                rotate: -40,
                textStyle: {
                    fontSize: 12,
                    color: '#fff'
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
        },
        yAxis: { //y轴
            min: 0,
            type: 'value',
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed'
                }
            },
            axisLabel: {
                textStyle: {
                    fontSize: 12,
                    color: '#fff'
                },
            },
            axisLine: {
                "show": false,
                lineStyle: {
                    color: '#fff'
                }
            },
        },
        series: dbseries
        
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
          this.$store.state.baseURL+"/weixin/project/index.php?m=Home&c=Index&a=alarm_anal",
        method: "POST",
        changeOrigin: true,
        data: params
      })
      .then((data)=>{
          if(data.status==200){
            // console.log(data.data)
            this.dbnames=data.data.mname
            this.dbx=data.data.days
            this.dblist=data.data.data
            // this.dbtext=data.data.content;
            let length=data.data.content.length;
            let n=0
            this.dbtext=''
            let timer=setInterval(()=>{
              if(n<length){
                this.dbtext+=data.data.content[n]
                n++
              }else{
                clearInterval(timer)
              }
            },100)
            this.duiBiEchart()
          }
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
      if(new Date(timeStart).getTime() > new Date(timeEnd).getTime()){
        this.$message({
          type:"error",
          message:"时间选择有误"
        })
        return
      }
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      
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
     
      this.getData(s, types, names, ip_id);
    },
    move() {
      this.$methods.listMove("#list-new",3000)      
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
      function rgb() {
        //rgb颜色随机
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        var rgb = "rgba(" + r + "," + g + "," + b + ",0.4)";
        return rgb;
      }
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
              color: '#94C9EC'
              // 
              // color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
              //   {
              //     offset: 0,
              //     color:rgb
              //     //  "rgba(7,44,90,0.3)"
              //   },
              //   {
              //     offset: 1,
              //     color: "rgba(0,146,246,0.9)"
              //   }
              // ])
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
        let col = rgb();
        let obj = {
          ...one,
          name: item,
          itemStyle: { normal: { color: col ,areaStyle:{color:col}} },
          data: that.series[index]
        };
        ser.push(obj);


        // let col = rgb();
        // one.name = item;
        // one.data = that.series[index];
        // one.itemStyle.normal.color=col
        // ser.push({ ...one });
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
      console.log(objs)
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
          this.$store.state.baseURL+"/weixin/project/index.php?m=home&c=Index&a=alarm_info",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.status == 200) {
            console.log(data)
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
               this.dbjigoulist=data.data.data.mec.map((item, index) => {
                  return {
                    ...item,
                    checked: false
                  };
               })
               
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
            // console.log(this.rightData1,this.rightData2)
            this.chartNew1();

            this.series = data.data.data.series;
            this.chartNew2();
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
    
    this.timeStart = obj.timeObj[0];
    this.timeEnd = obj.timeObj[1];
    let mid=obj.mid
    let types = "";
    let arr1 = this.warningType.filter(e => e.checked);
    types = arr1.map(e => e.id).join();
    // console.log("333", item);
    // return;
    this.getData(obj.timeObj.join(), types,mid);
    // getData(timeStr, typeId = "", jigouId = "", ip_id)
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
    this.loading.close()
  }
};
</script>