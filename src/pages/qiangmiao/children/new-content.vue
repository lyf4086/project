<template>
  <div class="main" ref="main">
    <div class="none-data" v-if="!dataList.length">暂时没有数据</div>
    <!-- 
    <div class="item_miao" v-for="item in data" :key="item.IMEI" >
      <div class="content">
        <div class="item" :title="item.IMEI" @click="showOne(item)">
          <p>{{item.IMEI}}</p>
        </div>
        <div class="item" title="枪瞄状态">{{item.heart==1 ? "在线":"不在线"}}</div>
        <div class="item" title="电量" @click="tanchuang2(item)">{{item.electricity}}%</div>
        <div class="item" title="充电状态">{{item.ischarging}}</div>
        <div class="item" title="所属警员" @click="lookPerson(item)">{{item.policeuser_name || '暂无'}}</div>
        <div class="item" title="所属机构">
          <p>{{item.mechanism_name}}</p>
        </div>
        <div class="item" title="绑定解绑">
          <span @click="tanchuang3(item)" v-if="item.gun_id==0">绑定</span>
          <span
            v-if="item.gun_id>0"
            class="jiebang"
            @click="jiebang(item)"
            style="color:red;"
            :title="item.gun_code"
          >解绑</span>
        </div>
        <div class="item" title="最后定位时间">{{item.created}}</div>
      </div>
      <input type="checkbox" id="checkbox" class="check" v-model="item.checked" />
    </div>
     -->
    <div class="one-data"  v-for="item in dataList" :key="item.IMEI" >
      <input type="checkbox" id="checkbox" class="check" v-model="item.checked" />
      <div class="left">
        <div class="l1" :title="`枪瞄编号：${item.IMEI}`" @click="showOne(item)">{{item.jm}}</div>
        <div class="l2" title="枪瞄状态" :class="{green:item.heart==1}">{{item.heart==1 ? "在线":"离线"}}</div>
        <div class="l3" title="电量" @click="tanchuang2(item)">{{item.electricity}}%</div>
        <div class="l4" title="充电状态">{{item.ischarging}}</div>
      </div>
      <div class="center">
        <div class="down"></div>
        <div class="up"></div>
        <div class="m" :class="{buzaixian:item.heart!=1}">
          <img :src="`${imgs[item.img]}`" >
        </div>
      </div>
      <div class="right">
        <div class="r1" title="所属警员">{{item.policeuser_name || '暂无'}}</div>
        <div class="r2" title="枪瞄类型">{{item.gtypes_name}}</div>
        <div class="r3" title="绑定解绑">
          <span @click="tanchuang3(item)" v-if="item.gun_id==0">绑定</span>
          <span
            v-if="item.gun_id>0"
            class="jiebang"
            @click="jiebang(item)"
            style="color:red;"
            :title="`所绑枪支编号:${item.gun_code || '暂无'}`"
          >解绑</span>
        </div>
        <div class="r4" title="最后定位时间">{{item.created}}</div>
      </div>
      
    </div>
    <div class="zhezhao" v-show="tan1||tan2||tan3||map">
      <div class="alert1" v-show="tan1" v-if="OneMessage">
        <p>设备号码：{{OneMessage.IMEI}}</p>
        <p>创建时间：{{OneMessage.created}}</p>
        <p>所绑枪支ID：{{OneMessage.gun_id}}</p>
        <p>枪瞄ID：{{OneMessage.gunaiming_id}}</p>
        <p>所属机构：{{OneMessage.mechanism_name}}</p>
        <p>所属警员：{{OneMessage.policeuser_name || '暂无'}}</p>
        <!-- <el-button type="text" @click="open">点击打开 Message Box</el-button> -->
        <button class="close" @click="close1">X</button>
      </div>
      <div class="map_wrap" v-show="map">
        <div id="map_content"></div>
        <button class="close" @click="mapClose">取消</button>
        <div class="del" @click="mapClose">X</div>
      </div>
      <div class="alert2" v-show="tan2">
        <div class="del" @click="close2">X</div>
        <div class="t1">电池信息</div>
        <div id="dianchi"></div>
        <div class="message" v-if="showMessage">
          <p>剩余电量：{{active_dianliang}}%</p>
          <p>枪瞄编号：{{showMessage.IMEI}}</p>
          <p>所属警员：{{showMessage.policeuser_name}}</p>
        </div>
        <div class="t">电量趋势图</div>
        <div id="chart2">
          
        </div>
        <div class="title">
          <span>电量</span>
          <span>时间</span>
          
        </div>
        <div class="listwrap">
          <div class="list" id="dianlianglist">
            <div class="item" v-for="(item,index) in dianlianglist" :key="index">
              
              <span>{{item.elec}}</span>
              <span>{{item.created}}</span>
            </div>
          </div>
        </div>
        <button class="close" @click="close2">取消</button>
      </div>
      <div class="alert3" v-show="tan3">
        <p class="t">选择要绑定的枪支</p>
        <button class="close" @click="close3">X</button>
        <input @input="putChange" class="put1" v-model.trim="xuanZhongGunId" placeholder="输入枪支ID" />
        <div class="list" ref="list">
          <div class="no-data" v-if="allGunList.length==0">该机构下暂时没有枪支信息,请前往添加</div>
          <div :style="{'opacity':e.opacity}" class="item" :key="e.id" v-for="(e,key) in allGunList"  @click="gunListClick(e,key)" >
            枪支编号:{{e.gun_code}} ，类型：{{e.gtype || "无"}}
            <!-- <input type="checkbox" v-model="e.checked" /> -->
          </div>
        </div>
        <input type="submit" class="btn" @click="submitBt" value="确认绑定" />
      </div>
    </div>
    <MapMarker v-if="mapShow" :arr="mapLngLat" @closeMap="closeMap"/>
  </div>
</template>
<style scoped>
@import url(./new-content.css);
</style>
<script>
import { clearTimeout } from 'timers';
import MapMarker from '@/components/map-marker.vue'
export default {
  components:{MapMarker},
  props: {
    dataList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    allGunList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    activefujigou: {
      type: String,
      default: function() {
        return "";
      }
    },
    activeyema: {
      type: Number,
      default: function() {
        return 1;
      }
    }
  },
  data() {
    return {
      tan1: false,
      tan2: false,
      tan3: false,
      map: false,
      xuanZhongGunId: "",
      active_qiangmiao: "", //.............当前激活的枪瞄id
      OneMessage: null,
      active_dianliang: "",
      moveListTimer:null,
      dianlianglist: [],
      dianliangData1: ["2014", "2015", "2016", "2017", "2018", "2019"],
      dianliangData2: [150, 200, 259, 360, 378, 450, 450],
      showMessage:null,
      mapShow:false,
      mapLngLat:[],
       sync: 0 ,//动静态区分，默认静态，1为动态
       imgs:{
         qm:require("@/assets/img/qm-item-bg.png"),
         qm92:require("@/assets/img/qm92.png")
       }
    };
  },

  methods: {
    closeMap(){
      this.mapShow=false
    },
    dianchi(n) {
      let that = this;
      let box = document.getElementById("dianchi");
      let Echart = this.$echarts.init(box, true);
      var data = n; //数值大小
      var max = 100; //满刻度大小
      let option = {
        // title: {
        //     text: '-AQI-',
        //     top:'38%',
        //     left:'center',
        //     textStyle:{
        //         color: '#fff',
        //         fontSize: 18
        //     }
        // },
        // backgroundColor: 'orange',

        color: ["rgb(0,0,200)", "rgba(255,255,255,.2)"],
        series: [
          {
            type: "pie",
            center: ["40%", "50%"],
            radius: ["78%", "70%"],
            hoverAnimation: false,
            data: [
              {
                name: "",
                value: data,
                label: {
                  show: true,
                  position: "center",
                  color: "#fff",
                  fontSize: 38,
                  fontWeight: "bold",
                  formatter: function(o) {
                    return data;
                  }
                }
              },
              {
                //画剩余的刻度圆环
                name: "",
                value: max - data,
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            ]
          },
          {
            type: "pie",
            center: ["99%", "99%"],
            radius: ["47%", "69%"],
            hoverAnimation: false,
            data: [
              {
                name: "",
                value: data,
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                },
                itemStyle: {
                  color: "rgba(0,0,0,0)"
                }
              },
              {
                //画中间的图标
                name: "",
                value: 0,
                label: {
                  position: "inside",
                  backgroundColor: {},
                  padding: 10
                }
              },
              {
                name: "",
                value: max - data,
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                },
                itemStyle: {
                  color: "rgba(0,0,0,0)"
                }
              }
            ]
          }
        ]
      };
      Echart.setOption(option);
    },
    chart2() {
      let that = this;
      let box = document.getElementById("chart2");
      let Echart = this.$echarts.init(box, true);
      let option = {
        // backgroundColor: "#0E204A",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(255,255,255,0)" // 0% 处的颜色
                  },
                  {
                    offset: 0.5,
                    color: "rgba(255,255,255,1)" // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(255,255,255,0)" // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            }
          }
        },
        grid: {
          top: "18%",
          left: "1%",
          right: "1%",
          bottom: "25%"
          // containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: true,
            axisLine: {
              //坐标轴轴线相关设置。数学上的x轴
              show: true,
              lineStyle: {
                color: "rgba(255,255,255,0.4)"
              }
            },
            axisLabel: {
              //坐标轴刻度标签的相关设置
              textStyle: {
                color: "#d1e6eb",
                margin: 15
              }
            },
            axisTick: {
              show: false
            },
            data: that.dianliangData1
          }
        ],
        yAxis: [
          {
            type: "value",
            min: 0,
            // max: 140,
            splitNumber: 4,
            splitLine: {
              show: true,
              lineStyle: {
                color: "rgba(255,255,255,0.1)"
              }
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              show: false,
              margin: 20,
              textStyle: {
                color: "#d1e6eb"
              }
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: "注册总量",
            type: "line",
            // smooth: true, //是否平滑曲线显示
            // 			symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            // symbol: 'image://./static/images/guang-circle.png',
            symbolSize: 8,
            lineStyle: {
              normal: {
                color: "#53fdfe" // 线条颜色
              },
              borderColor: "#f0f"
            },
            label: {
              show: true,
              position: "top",
              textStyle: {
                color: "#fff"
              }
            },
            itemStyle: {
              normal: {
                color: "rgba(255,255,255,1)"
              }
            },
            tooltip: {
              show: false
            },
            areaStyle: {
              //区域填充样式
              normal: {
                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(0,150,239,0.3)"
                    },
                    {
                      offset: 1,
                      color: "rgba(0,253,252,0)"
                    }
                  ],
                  false
                ),
                shadowColor: "rgba(53,142,215, 0.9)", //阴影颜色
                shadowBlur: 20 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
              }
            },
            data: that.dianliangData2
          }
        ]
      };
      Echart.setOption(option);
    },
    lookPerson(item) {
      if (!item.policeuser_id) {
        this.$message({
          type: "error",
          message: "暂无"
        });
        return;
      }
      this.$store.commit("setPoliceId", {
        policeuser_id: item.policeuser_id,
        yeMa: this.activeyema,
        jiGouId: this.activefujigou
      });
      this.$router.push({
        name: "PersonMessage"
      });
    },
    mapClose() {
      this.map = false;
    },
    showOne(item) {
      if (!item.longitude) {
        this.$message({
          type: "warning",
          message: "没有卫星定位数据"
        });
        return;
      }
   
      let zaixian=this.$store.state.zaixian
        if(zaixian){
          //默认打开在线地图
          this.map = true;
          this.mapInit(item);
        }else{
          //打开谷歌离线地图
          this.mapShow=true
          this.mapLngLat=[item.latitude-0,item.longitude-0]
        }
    },
    mapInit(obj) {
      let map = new AMap.Map("map_content", {
        center: [obj.longitude, obj.latitude],
        resizeEnable: true,
        zoom: 13
      });
      var marker = new AMap.Marker({
        position: new AMap.LngLat(obj.longitude, obj.latitude), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        title: obj.policeName
      });
      map.add(marker);
      map.setFitView([...marker]);
    },
    IEMI_alert(n) {
      this.tan1 = true;
      this.tan2 = false;
      this.tan3 = false;
      this.OneMessage = this.data[n];
    },
    tanchuang2(item) {
      console.log(item)
      this.showMessage=item;
      this.active_dianliang = item.electricity;
      this.tan1 = false;
      this.tan2 = true;
      this.tan3 = false;
      this.dianchi(item.electricity);

      this.getDianliang(item.IMEI);
      clearTimeout(this.moveListTimer)
      this.moveListTimer=setTimeout(() => {
        this.$methods.listMove("#dianlianglist", 3000);
      }, 300);
    },
    tanchuang3(item) {
      //.......绑定枪瞄弹窗
      this.tan1 = false;
      this.tan2 = false;
      this.tan3 = true;
      this.active_qiangmiao = item.gunaiming_id;
    },
    close1() {
      this.tan1 = false;
    },
    close2() {
      this.tan2 = false;
    },
    close3() {
      this.tan3 = false;
    },
    putChange(e) {
      var val = e.target.value;
      var list = this.allGunList;
      this.blys(val, list);
    },
    blys(val, list) {
      var v = val;
      for (let i = 0; i < list.length; i++) {
        var ind = list[i]["gun_id"].indexOf(v);
        if (ind == -1) {
          //  this.list[i]['opacity']='0.3';
          this.allGunList[i]["opacity"] = "0.3";
        } else {
          // this.list[i]['opacity']='1';
          this.allGunList[i]["opacity"] = "1";
        }
      }
    },
    gunListClick(e, key) {
      this.allGunList.forEach(e => (e.opacity = "0.3"));
      // this.allGunList[key].checked=true
      this.xuanZhongGunId = e.gun_id;
      this.allGunList[key].opacity = "1";
    },
    submitBt() {
      // let xuanzhong=this.allGunList.filter(e=>e.checked)
      if (this.xuanZhongGunId == "") {
        this.$message("请输入要绑定的枪支ID");
        return;
      }

      this.bind(this.xuanZhongGunId, this.active_qiangmiao);
      this.xuanZhongGunId = "";
      this.active_qiangmiao = "";
    },
    jiebang(item) {
      // if (!confirm("确定要解除绑定吗？")) return;

      this.$confirm("确定要解除绑定吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.unbind(item.gun_id, item.gunaiming_id); //...............解绑枪支枪瞄
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消解绑"
          });
        });
    },
    getDianliang(IMEI) {
      var key = this.$store.state.key;
      var objs = { IMEI };
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("IMEI", objs.IMEI);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=Home&c=Gunaiming&a=elec",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          console.log(data);
          this.dianliangData1 = data.data.data.map(e => e.created);
          this.dianliangData2 = data.data.data.map(e => e.elec);
          this.dianlianglist = data.data.datas;
          this.chart2();
        })
        .catch(error => {
          console.log(error);
        });
    },

    bind(gun_id, miao_id) {
      //....................绑定枪支和枪瞄
      var key = this.$store.state.key;
      var objs = { gun_id: gun_id, gunaiming_id: miao_id };
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("gun_id", objs.gun_id);
      params.append("gunaiming_id", objs.gunaiming_id);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=gunaiming&a=bind",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            this.$message({ message: "绑定成功", type: "success" });
            this.tan3 = false;
            this.$emit("updataView");
          } else {
            this.$message({ message: "绑定失败！请重新绑定", type: "warning" });
            this.tan3 = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }, //......................绑定end
    unbind(gun_id, miao_id) {
      //....................解除绑定
      var key = this.$store.state.key;
      var objs = { gun_id: gun_id, gunaiming_id: miao_id };
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("gun_id", objs.gun_id);
      params.append("gunaiming_id", objs.gunaiming_id);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=gunaiming&a=unbind",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            this.$message({ message: "解除绑定成功", type: "success" });
            this.$emit("updataView");
          }
        })
        .catch(error => {
          console.log(error);
        });
    } //..........................解绑end
  },
  created(){
    this.sync = this.$gscookie.getCookie("sync");
    console.log(this.sync)
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.main.addEventListener("mouseover", ev => {
         return
        if (ev.target.className == "") {
         console.log('移入了')
        //  return
          ev.target.previousElementSibling.style.display = "block";
          ev.target.onmouseout = function() {
            let b = $(this)[0].querySelector(".check");
            b.onmouseover = function() {
              b.style.display = "block";
            };
            if (!b.checked) {
              $(this)[0].querySelector(".check").style.display = "none";
            }
          };
        }
      });
    });
  },
  updated() {
    // console.log(this.activefujigou, this.activeyema);
  }
};
</script>
