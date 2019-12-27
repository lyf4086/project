<template>
  <div class="jigou">
    <div class="tree-menu">
      <h3>枪瞄管理</h3>
      <div class="nav-wrap">
        <el-tree
          :data="treeData"
          :props="defaultProps"
          accordion
          :highlight-current="true"
          node-key="id"
          :current-node-key="currentNodeKey"
          @node-click="handleNodeClick"
          :default-expanded-keys="zhankai"
          
        ></el-tree>
      </div>
    </div>
    <div class="top-nav">
      <div class="bread-wrap">
        <!--面包屑导航-->
        <breadNav title="枪瞄管理" :next="active_title" />
      </div>
      <div class="check-type">
        <select name="" id="" v-model="checkType" @change="typeChange">
          <option value="1">全部</option>
          <option value="2">在线</option>
          <option value="3">离线</option>
        </select>
      </div>
      <div class="search-wrap">
        <!--搜索框-->
        <select class="sel" v-model="selValue">
          <option value disabled selected>请选择搜索类型</option>
          <option value="IMEI">枪瞄IMEI</option>
        </select>
        <input
          type="text"
          class="textput"
          v-model="putValue"
          @keyup.13="subSearch"
          placeholder="请输入搜素关键字"
        />
        <button class="sub" @click="subSearch"></button>
      </div>
    </div>
    <div class="page-index" v-show="pageTotal">
      <el-pagination
        :page-size="keshihua?9:19"
        :pager-count="9"
        layout="total, prev, pager, next"
        :current-page="currentPage"
        @current-change="currentChange"
        :total="pageTotal"
        ref="page"
      ></el-pagination>
    </div>
    <div class="message-box" v-show="false">
      <p>当前显示 *** {{active_title}} *** 下的枪瞄信息</p>
    </div>
    <div class="add-del" v-show="ishand">
      <button @click="alert=true">新增枪瞄</button>
      <button @click="delQiaoMiao">删除枪瞄</button>
      <button @click="modifyMiao">修改枪瞄</button>
    </div>
    <div class="content"  v-show="keshihua">
      <newContent
        @hehe="openMap"
        :dataList="qiangmiaoData"
        @changeOneD="changeOneDataZhuangTai"
        :allGunList="allGunList"
        @updataView="updataView"
        :activefujigou="active_fujigou"
        :activeyema="active_yema"
        @getAllGun="getAllGun"
      ></newContent>
    </div>
    <div class="change_type">
      <button title="可视化" :class="{'active':keshihua}" @click="changeShowType(1)"></button>
      <button title="列表" :class="{'active':!keshihua}" @click="changeShowType(2)"></button>
    </div>
    <div class="content2" v-show="!keshihua">
      <div class="none-data" v-if="!qiangmiaoData.length">暂时没有数据</div>
      
      <div class="list-title" v-show="qiangmiaoData.length">
        <input type="checkbox" v-model="checkAll"/>
        <span>枪瞄编号</span>
        <span>所属警员</span>
        <span>枪瞄状态</span>
        <span>枪瞄类型</span>
        <span>剩余电量</span>
        <span>绑定枪支编号</span>
        <span>充电状态</span>
        <span>最后定位时间</span>
        <span>绑定/解绑</span>
      </div>
      <div class="list-item"  v-for="(item,index) in qiangmiaoData" :key="index">
        <input type="checkbox" v-model="item.checked"/>
        <span style="cursor:pointer;text-decoration:underline" @click="showMap(item)">{{item.IMEI}}</span>
        <span>{{item.policeuser_name || '暂无'}}</span>
        <span>{{item.heart==1 ? "在线":"离线"}}</span>
        <span>{{item.gtypes_name}}</span>
        <span style="cursor:pointer;text-decoration:underline" @click="dianLiang(item)">{{item.electricity}}%</span>
        <span>{{item.gun_code || '暂无'}}</span>
        <span>{{item.ischarging}}</span>
        <span>{{item.created}}</span>
        <span v-if="item.gun_id==0" style="cursor:pointer" @click="bangding(item)">绑定</span>
        <span v-if="item.gun_id>0" style="color:red;cursor:pointer" @click="jiebang(item)">解绑</span>
      </div>
    </div>
    <div class="cover" v-show="alert||xiugai||tan3||tan2">
      <div class="text-wrap" v-show="alert">
        <div class="text-title">新增枪瞄</div>
        <div class="text-content">
          
          <div class="floor">
            <span>IMEI:</span><input type="number" v-model="formLabelAlign.iemi"><br/>
          </div>
          <div class="floor">
            <span>枪瞄类型：</span>
              <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in types"
                  :key="item.id"
                  :label="item.gtypes"
                  :value="item.id">
                </el-option>
              </el-select>
          </div>
        </div>
        <div class="submit" @click="subAddQiangMiao">确认</div>
        <i @click="del">X</i>
      </div>
      <div v-show="xiugai" class="xiugai">
        <div class="title">修改枪瞄</div>
        <button class="del" @click="xiugai=false">X</button>
        <div class="floor"><span>原名字：</span><span>{{xiugaiData.IMEI}}</span></div>
        <div class="floor">
          <span>新名字：</span>
          <input type="text" v-model="xiugaiStr" />
        </div>
        <div class="floor"><span>类型：</span><span>{{xiugaiData.gtypes_name}}</span></div>
        <div class="floor"><span>修改类型：</span>
                  <el-select v-model="changeValue" placeholder="请选择">
                    <el-option
                      v-for="item in types"
                      :key="item.id"
                      :label="item.gtypes"
                      :value="item.id">
                    </el-option>
                  </el-select>
       
        </div>
        <button class="sub" @click="subChange">确认修改</button>
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
      <div class="alert2" v-show="tan2">
        <div class="del" @click="close2" >X</div>
        <div class="t1">电池信息</div>
        <div id="dianchi11"></div>
        <div class="message" >
          <p>剩余电量：{{active_dianliang}}%</p>
          <p>枪瞄编号：{{showMessage.IMEI}}</p>
          <p>当前携带警员：{{showMessage.policeuser_name}}</p>
        </div>
        <div class="t">电量趋势图</div>
        <div id="chart33">
        </div>
        <div class="title">
          <span>电量 %</span>
          <span>时间</span>
          
        </div>
        <div class="listwrap">
          <div class="list" id="dianlianglist11">
            <div class="item" v-for="(item,index) in dianlianglist" :key="index">
              
              <span>{{item.elec}}</span>
              <span>{{item.created}}</span>
            </div>
          </div>
        </div>
        <button class="close" @click="close2">取消</button>
      </div>
    </div>
    <GaoDeMap v-if="gaodeshow" :arr="gaodeArr" :mes="alertMessage" title="" @closeMap="close"/>
    <MapMarker @closeMap="close" v-if="liXianMapShow" :arr="liXianLngLat" :title="liXianTitle" :mes="liXianMes"/>
  </div>
</template>
<style scoped>
@import url(./index.css);
</style>
<script>
import MapMarker from '@/components/map-marker.vue' 
import GaoDeMap from '@/components/mapalertgaode.vue'
import breadNav from "@/components/breadnav";
import newContent from "./children/new-content";
export default {
  components: { breadNav, newContent ,MapMarker,GaoDeMap},
  data() {
    return {
      changeValue:'',
      tan3:false,
      tan2:false,
      xuanZhongGunId:'',
      liXianMapShow:false,
      alertMessage:{},
      gaodeshow:false,
      liXianLngLat:[40.2,116.37],
      gaodeArr:[116.37,40.2],
      liXianMes:{"mechanism_name":'2123223'},
      liXianTitle:'',
      alert: false,
      xiugai: false,
      xiugaiData: {},
      xiugaiStr: "",
      mapIsShow: false,
      qiangmiaoData: [], //...........当前显示的枪瞄数据
      active_title: "", //...当前显示谁的数据
      treeData: [], //树形菜单数据
      currentNodeKey: "",
      firstId: undefined, //...属性菜单第一个数据得id
      defaultProps: {
        children: "child",
        label: "mechanism_name"
      },
      active_fujigou: null, //.....当前被点击激活的机构默认为空
      labelPosition: "right",
      formLabelAlign: {
        iemi: "",
        region: "0",
        type: "0"
      },
      allGunList: [],
      putValue: "",
      selValue: "",
      pageTotal: null,
      active_yema: 1,
      ishand: false, //..........是否点击了树形菜单
      options: [],
      value: '',
      types:[],
      checkType:1,
      currentPage:0,
      keshihua:true,
      loading:null,
      zhankai:[],
      showMessage:{},
      showMessage:'',
      dianliangData1:'',
      dianliangData2:'',
      dianlianglist:[],
      active_dianliang:'',
      moveListTimer1:null
    };
  },
  computed:{
    checkAll:{
      get(){
        return this.qiangmiaoData.every(e=>e.checked)
      },
      set(b){
        return this.qiangmiaoData.forEach(e=>e.checked=b)
      }
    }
  },
  methods: {
    dianLiang(item){
      this.tan2=true
       this.showMessage=item;
      this.active_dianliang = item.electricity;
     
      this.dianchi(item.electricity);
      this.getDianliang(item.IMEI);
      setTimeout(()=>{
        if(this.dianlianglist.length>3){
          
          window.clearInterval(this.moveListTimer1)
          this.moveListTimer1=window.setTimeout(() => {
            
            this.$methods.listMove("#dianlianglist11", 3000);
            console.log('99999999999')
          }, 300);
        }
      },2000)
    },
    close2(){
      this.tan2=false
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
          this.dianliangData1 = data.data.data.map(e => e.created);
          this.dianliangData2 = data.data.data.map(e => e.elec);
          this.dianlianglist = data.data.datas;
          this.chart2();
        })
        .catch(error => {
          console.log(error);
        });
    },
     chart2() {
       
      let that = this;
      let box = document.getElementById("chart33");
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
     dianchi(n) {
      let that = this;
      let box = document.getElementById("dianchi11");
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
                    return data+'%';
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
    getAllGun(){
      // console.log('getAllGun')
      this.getAllGunList(this.active_fujigou);
    },
    bangding(item){

      this.tan3=true
      this.active_qiangmiao=item.gunaiming_id
      this.getAllGunList(this.active_fujigou);
    },
    jiebang(item){
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
    close3(){
      this.tan3=false
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
    
    close(){
      this.liXianMapShow=false
      this.gaodeshow=false
    },
    showMap(item){
      if(!item.latitude||!item.longitude){
        this.$message({
          type:'warning',
          message:"定位信息不全"
        })
        return
      }
      let zaixian=this.$store.state.zaixian
      if(zaixian){
        // console.log(item)
        this.gaodeArr=[item.longitude-0,item.latitude-0]
        this.alertMessage=`姓名：${item.policeuser_name || "暂无"} ，时间：${item.created}`

        this.gaodeshow=true
      }else{
        this.liXianMapShow=true
        this.liXianLngLat=[item.latitude-0,item.longitude-0]
        let name=item.policeuser_name?item.policeuser_name:'无'
        this.liXianMes={"mechanism_name":'所属人：'+name+'，枪瞄类型：'+item.gtypes_name}
        this.liXianTitle=item.policeuser_name
      }
      

    },
    changeShowType(n){
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.qiangmiaoData=[]
      if(n===1){
        this.keshihua=true
      }else{
        this.keshihua=false
      }
      localStorage.setItem('setKeShiHua',this.keshihua)
      
      this.getDataList(this.active_fujigou, 1,this.checkType)
      this.$refs.page.internalCurrentPage = 1;
    },
    typeChange(){
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      // console.log(this.checkType,this.active_fujigou)
      this.$refs.page.internalCurrentPage = 1;

      this.getDataList(this.active_fujigou, 1,this.checkType)
    },
    updataView() {
      this.getDataList(this.active_fujigou, this.active_yema);
      // this.getAllGunList(this.active_fujigou);//暂时弃用
    },

    changeOneDataZhuangTai(n) {},
    currentChange(n) {
      //..........页码的点ji
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.qiangmiaoData=[]
      this.active_yema = n;
      this.getDataList(this.active_fujigou, n,this.checkType);
    },
    subSearch() {
      if (!this.selValue) {
        this.$message({ message: "请选择搜索条件", type: "warning" });
        return;
      } else if (!this.putValue) {
        this.$message({ message: "请输入您要搜索的内容", type: "warning" });
        return;
      }
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.search(this.active_fujigou,1, this.putValue);
    },
    search(id='',n = 1, val = "") {
      var objs = {
        mechanism_id:id,
        p: n,
        ps: "12"
      };
      var token = this.$gscookie.getCookie("gun");
      let name_code = this.selValue;
      objs[name_code] = val;
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);
      var params = new URLSearchParams();
      params.append("mechanism_id", objs.mechanism_id);
      params.append("p", objs.p);
      params.append("ps", objs.ps);
      params.append(name_code, objs[name_code]);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL +
          // "/weixin/project/index.php?m=home&c=search&a=gunaimings",
          "/weixin/project/index.php?m=home&c=gunaiming&a=gunaimings",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200 && data.data.data.length != 0) {
            this.qiangmiaoData = data.data.data.list;

          }
          this.selValue = "";
          this.putValue = "";
          this.pageTotal = null;
          this.loading.close()
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleNodeClick(item) {
      //.............树形菜单点击
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.qiangmiaoData=[]
      this.currentPage = 1;
      this.checkType=1;
      this.active_yema = 1;
      if (this.$refs.page) {
        this.$refs.page.internalCurrentPage = 1;
      }
      this.active_fujigou = item.mechanism_id; //...........更新当前激活的active_fujigou
      this.getDataList(this.active_fujigou); //.............获取枪瞄数据
      this.active_title = item.mechanism_name;
      // this.getAllGunList(this.active_fujigou); //弃用.............获取当前机构下所有枪支
      this.allGunList=[]
      this.ishand = true;
    },
    add() {
      this.alert = true;
    },
    del() {
      this.alert = false;
    },
    delMap() {
      this.mapIsShow = false;
    },
    openMap() {
      this.mapIsShow = true;
    },
    
    addQiangMiao(imei,gtypes) {
      var key = this.$store.state.key;
      var objs = { IMEI: imei, mechanism_id: this.active_fujigou ,gtypes:gtypes}; //mechanism_id是机构id
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("IMEI", objs.IMEI);
      params.append("mechanism_id", objs.mechanism_id);
      params.append("gtypes", objs.gtypes);
      params.append("sign", sign);
      params.append("token", token);

      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=gunaiming&a=rewrite",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            this.$message({ message: "添加枪瞄成功", type: "success" });
            this.getDataList(this.active_fujigou, this.active_yema); //.........更新视图
          } else if (data.data.code == 401) {
            this.$message({
              message: "添加失败！IMEI不能重复",
              type: "warning"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getDataList(jigou_id = 1, p = 1,heart=1) {
      //.............................获取枪瞄列表数据函数
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      var key = this.$store.state.key;
      var objs = { 
        mechanism_id: jigou_id, p: p, ps: this.keshihua ?9:19
      ,heart:heart};
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("mechanism_id", objs.mechanism_id);
      params.append("p", objs.p);
      params.append("ps", objs.ps);
      params.append("heart", objs.heart);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=gunaiming&a=gunaimings",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
            if(data.data.code==200){
              this.loading.close()
               this.types=data.data.data.ggtype
              let newArr = data.data.data.list.map(e => {
                return {
                  ...e,
                  checked: false
                };
              });
              this.qiangmiaoData = newArr; //.............返回数据之后赋值给qiangmiaoData
              this.pageTotal = data.data.data.psum * 1;
              // console.log(this.qiangmiaoData)
            }
        })
        .catch(error => {
          console.log(error);
        });
    },

    deleteData(gun_id) {
      //.........................删除枪瞄数据

      var key = this.$store.state.key;
      var objs = { gunaiming_id: gun_id };
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("gunaiming_id", objs.gunaiming_id);

      params.append("sign", sign);
      params.append("token", token);

      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=gunaiming&a=del",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            this.$message({ message: "删除成功", type: "success" });
            this.getDataList(this.active_fujigou, this.active_yema); //.........更新视图
          }
          if (data.data.code == 401) {
            this.$message({ message: "删除失败！请先解除绑定", type: "error" });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getTreeData(isCreate = true) {
      // ......................该组件默认加载树形菜单数据
      
      var key = this.$store.state.key;
      var objs = { p: 1, ps: 10 };
      var sign = this.$methods.mkSign(objs, key);

      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("p", objs.p);
      params.append("ps", objs.ps);
      // params.append('mechanism_id', objs.mechanism_id);
      params.append("sign", sign);
      params.append("token", token);

      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=mechanism&a=mechanisms_tree",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          this.zhankai.push(data.data.data.list[0].id)
          this.zhankai.push(data.data.data.list[0].child[0].id || "")
          if(data.data.data.list[0].child[0].child){
            this.zhankai.push(data.data.data.list[0].child[0].child[0].id)
          }
          this.treeData = data.data.data.list;
          // this.handleNodeClick(this.treeData[0]); //....主动促发一次点击事件
          this.firstId = this.treeData[0].id;
          this.active_fujigou = data.data.data.list[0].id;
          if (isCreate) {
            this.currentNodeKey = data.data.data.list[0].id;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    subAddQiangMiao() {
      if (!this.formLabelAlign.iemi) {
        this.$message({ message: "枪瞄不能为空", type: "warning" });
        return;
      }
      if(!this.value){
         this.$message({ message: "枪瞄类型", type: "warning" });
        return;
      }
      this.addQiangMiao(this.formLabelAlign.iemi,this.value);
      this.alert = false;
      this.formLabelAlign.iemi = ""; //清空iemi
    },
    delQiaoMiao() {
      let arr1 = this.qiangmiaoData.filter(e => e.checked);
      let nojiebang = arr1.find(e => e.gun_id != 0);
      if (!arr1.length) {
        this.$message("请选择要删除的枪瞄");
        return;
      }
      this.$confirm("确定要删除吗？请三思", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (nojiebang) {
            this.$message({
              message: "无法删除已绑定枪支，请先解绑后删除",
              type: "warning"
            });
            return;
          }

          let idStr = arr1.map(e => e.gunaiming_id).join(",");
          this.deleteData(idStr);
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    modifyMiao() {
      let modifyArr = this.qiangmiaoData.filter(e => e.checked);
      if (modifyArr.length == 0) {
        this.$message("请选择要删除的数据");
        return;
      } else if (modifyArr.length > 1) {
        this.$message.error("单次只能修改一个");
        return;
      }
      this.xiugai = true;
      this.xiugaiData = modifyArr[0];
      this.changeValue=modifyArr[0].gtypes
    },
    subChange() {
      if (!this.xiugaiStr) {
        this.$message.error("修改后不能为空");
        return;
      }
      
      this.modify(this.xiugaiStr,this.changeValue, this.xiugaiData.gunaiming_id);
    },
    modify(imei,changeValue, id) {
      var key = this.$store.state.key;
      var objs = {
        IMEI: imei,
        mechanism_id: this.active_fujigou,
        gunaiming_id: id
      }; //mechanism_id是机构id
      if(!!changeValue){
        objs.gtypes=changeValue
      }
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("IMEI", objs.IMEI);
      params.append("mechanism_id", objs.mechanism_id);
      params.append("gunaiming_id", objs.gunaiming_id);
      params.append("sign", sign);
      params.append("token", token);
      if(!!changeValue){
        params.append("gtypes", objs.gtypes);
      }
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=gunaiming&a=rewrite",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            this.$message({ message: "修改枪瞄成功", type: "success" });
            this.updataView()
            this.xiugai = false;
            this.xiugaiStr=''
            this.changeValue=''
            this.qiangmiaoData.find(e => {
              if (e.IMEI == this.xiugaiData.IMEI) {
                // alert(999)
                e.IMEI = this.xiugaiStr;
              }
            });
          } else if (data.data.code == 401) {
            this.$message({
              message: "添加失败！IMEI不能重复",
              type: "warning"
            });
          }
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

            this.tan3=false
            this.$message({ message: "绑定成功", type: "success" });
            this.updataView()
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
            this.$message("解除绑定成功");
            this.updataView()
          }
        })
        .catch(error => {
          console.log(error);
        });
    }, //..........................解绑end
    getAllGunList(jigou_id) {
      //................获取未绑定的枪支列表信息函数
      var key = this.$store.state.key;
      var objs = { mechanism_id: jigou_id, p: 1, ps: 10000, isbind: 1 };
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("mechanism_id", objs.mechanism_id);
      params.append("p", objs.p);
      params.append("ps", objs.ps);
      params.append("isbind", objs.isbind);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=gun&a=guns",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          let dataArr = data.data.data.list.map(e => {
            return {
              ...e,
              opacity: "1",
              checked: false
            };
          });
          this.allGunList = dataArr;
          console.log(dataArr.length)
        })
        .catch(error => {
          console.log(error);
        });
    } //................获取列表信息函数end
  },
  created() {
    let treeData=JSON.parse(sessionStorage.getItem('tree-list'))
    this.zhankai.push(treeData[0].id)
    if(!!treeData[0].child.length){
            this.zhankai.push(treeData[0].child[0].id || "")
            if(!!treeData[0].child[0].child){
                this.zhankai.push(treeData[0].child[0].child[0].id)
              }
          }
    this.treeData = treeData;
    this.firstId = this.treeData[0].id;
    this.active_fujigou = treeData[0].id;
    this.currentNodeKey = treeData[0].id;
    this.activeJiGouId = treeData[0].id;
    this.getDataList(this.activeJiGouId, 1);

    let { jiGouId, yeMa } = this.$store.state;
    
    let item = this.$gscookie.getCookie("message_obj");
    this.currentNodeKey = this.$gscookie.getCookie("mechanism_id");
    let zaixian=this.$store.state.zaixian
    if (item.role_id == 3) {
      if(zaixian){
        this.$router.push({
          name: "GuiJi"
        });
      }else{
        this.$router.push({
          name: "Map"
        });
      }
      
    }
    let str = this.$gscookie.getCookie("gun");
    if (JSON.stringify(str) == "{}") {
      this.$router.push("/loginput");
    }
    if (jiGouId || yeMa) {
      this.currentNodeKey = jiGouId;
      this.activeJiGouId = jiGouId;

      this.currentPage = yeMa - 0;
      this.getTreeData(false);
      this.getDataList(jiGouId, yeMa);
      this.$store.commit("emptyNumber");
    }
  },
  mounted() {
    let keshi=localStorage.getItem('setKeShiHua')
     this.keshihua=JSON.parse(keshi) 
    this.$store.commit('setStr',{
      str1:'枪瞄列表',
      str2:'情况汇总'
    })
  },
  destroyed(){
    this.$store.commit('huanyuanStr')
  }
};
</script>
