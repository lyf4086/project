<template>
  <div class="guiji">
    <div class="wrap111">
      <div id="container"></div>      
      <div class="left_mes" v-show="filterMessage.uname">
        <div class="main_mes">
          <span>
            <i
              class="view"
              @click="binaZuBack"
              v-show="!oneAlarmPersonList.length && oldOrNew=='new'"
              :class="{'left_view':!checked_person_show}"
              v-if="!oneAlarmPersonList.length"
            ></i>
            <i
              class="view"
              v-if="oneAlarmPersonList.length"
              @click="alarmBoxShowOrHide"
              :class="{'left_view':!oneAlarmPersonListBox}"
            ></i>
          </span>
          <div class="img_wrap">
            <img v-if="filterMessage.imgSrc" :src="filterMessage.imgSrc" alt />
            <img v-if="!filterMessage.imgSrc" src="../../assets/img/head-icon.png" />
          </div>
          <h6>{{filterMessage.uname}}</h6>
          <p>警员编号：</p>
          <p>{{filterMessage.bianhao}}</p>
          <div class="btn_wrap" :no_click="noClick">
            <div class="left_btn" @click="closeToLeft">
              <i class="l_r"></i>
            </div>
            <div class="right_btn">
              <div class="no_click" v-if="noClick"></div>
              <div class="yongqiangyuan" v-if="yongqiangyuan"></div>
              <span @click="bianZuList" v-show="oldOrNew !='old'" title="人员编组"></span>
              <span title="查看历史轨迹" @click="toHistory"></span>
              <span @click="toBaoJing" title="报警信息"></span>
              <span @click="setWarningRange" v-show="oldOrNew !='old'" title="开始设置报警区域"></span>
              <p class="lookmore" @click="toOnePersonData">查看更多>></p>
            </div>
          </div>
        </div>
        <div
          class="item_list"
          v-show="checked_person_show && computedList.length"
          v-if="!oneAlarmPersonList.length"
        >
          <div class="title">
            <span>编组人员姓名</span>
            <span>编组人员编号</span>
            <span>编组人员详细信息</span>
          </div>
          <div class="item_wrap_scroll">
            <div class="item" v-for="(item,index) in computedList" :key="index">
              <p>
                <span class="img_wrap">
                  <img :src="item.policeuser.icon" alt />
                </span>
                <span class>{{item.policeuser_name}}</span>
              </p>
              <p>{{item.policeuser.police_number}}</p>
              <p class="btns">
                <span title="个人详情" @click="spanToXiangQing(item)">
                  <i class="el-icon-view"></i>
                </span>
                <span title="报警信息" @click="spanToBaoJing(item)"></span>
                <span title="删除" @click="spanToDelete(item)"></span>
              </p>
            </div>
          </div>
        </div>
        <div class="check-person-list" v-show="bianzu_list_show">
          <div class="check-name">
            <!-- <el-tag size="mini" closable v-for="item,index in jigouSelArr" :key="index">{{item}}</el-tag> -->
            <Tag
              :list="jigouSelArr"
              @delOneJiGou="delOneJiGou"
              @clickOneTab="clickOneTab"
              :jigouSelIndex="jigouSelIndex"
            />
          </div>
          <div class="title">
            <!-- <span>选择</span> -->
            <span><input type="checkbox" v-model="checkall" /></span>
            <span>选择机构</span>
            <span>编组人员</span>
            <span>枪支编号</span>
          </div>
          <div class="over-list-wrap">
            <div class="person-list-wrap" :class="{active:jigouSelIndex==0}">
              <div class="person-list" v-for="(item,index) in fillSeilf" :key="index">
                <span>
                  <input type="checkbox" v-model="item.checked" />
                </span>
                <span :title="item.mechanism_name">{{item.mechanism_name}}</span>
                <span>{{item.policeuser_name}}</span>
                <span :title="item.gun_code">{{item.gun_code}}</span>
              </div>
            </div>
            <div
              class="person-list-wrap"
              :class="{active:jigouSelIndex==i+1}"
              v-for="(arr,i) in allMechanismPersonList"
              :key="i"
            >
              <div class="person-list" v-for="(item,index) in arr" :key="index">
                <span>
                  <input type="checkbox" v-model="item.checked" />
                </span>
                <span :title="item.mechanism_name">{{item.mechanism_name}}</span>
                <span>{{item.policeuser_name}}</span>
                <span :title="item.gun_code">{{item.gun_code}}</span>
              </div>
            </div>
          </div>

          <div class="button-wrap">
            <select v-html="allMechanism" v-model="allMechanismValue" @change="MechanismChange"></select>
            <button @click="yijingXuanze">确 定</button>
          </div>
        </div>

        <div
          class="one_alarm_person_list"
          v-if="oneAlarmPersonList.length && oneAlarmPersonListBox"
        >
          <div class="item" v-for="(item,index) in oneAlarmPersonList" :key="index">
            <div class="img_wrap">
              <img v-if="item.icon" :src="item.icon" />
              <img v-if="!item.icon" src="../../assets/img/head-icon.png" />
            </div>
            <span :title="item.policeuser_name">{{item.policeuser_name}}</span>
            <span :title="item.police_number">{{item.police_number}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="sel_wrap">
      <div class="sel_item">
        机构：
        <select v-html="jigouOptionStr" @change="jigouSelChange"></select>
      </div>
      <div class="sel_item" v-show="gunAndJingyuanOptionStr">
        <span>警员及枪支：</span>
        <select v-html="gunAndJingyuanOptionStr" @change="jingyuanSelChange"></select>
      </div>
      <div class="sel_item">
        <span>追踪类型：</span>
        <select v-model="oldOrNew" @change="changeGuiJiType">
          <option value disabled selected>请选择轨迹类型</option>
          <option value="old">历史定位</option>
          <option value="new">最新定位</option>
        </select>
      </div>
      <button @click="searchOnePerson" v-show="activeIMEI">查找</button>
      <div class="sel_item" v-if="false">
        <select
          class="last-sel"
          v-model="value"
          v-html="optionsStr"
          v-show="hasPerson"
          @change="TypeChange"
        ></select>
      </div>
    </div>
    <div class="warning">
      <div class="btns">
        <span>离套状态</span>
        <span>正常值勤</span>
        <span>范围预警</span>
      </div>
    </div>
    <div class="setWarning" v-show="setWarning">
      <button @click="startSetArea">开始设置区域</button>
      <button @click="confirmSetArea">确认设置区域</button>
      <button @click="resetArea">重新设置区域</button>
    </div>
    <!-- 所有报警区域列表 -->
    <div class="alarm_list">
      <select  class="sel" v-html="allAlarmSelectStr" ref="alarmSelect" @change="showOne"></select>
      <div>
        <strong>报警类型：</strong>
        <p v-if="oneAlarmMessage.datetime">{{oneAlarmMessage.type}}</p>
        <p v-if="!oneAlarmMessage.datetime">--|--</p>
      </div>
      <div>
        <strong>报警时间：</strong>
        <p class="lh" v-if="oneAlarmMessage.datetime">{{oneAlarmMessage.stime}}<br/>至<br/>{{oneAlarmMessage.etime}}</p>
        <p v-if="!oneAlarmMessage.datetime">--|--</p>
      </div>
      <div v-if="oneAlarmMessage.datetime">
        <button class="del-area" @click="del">删除该区域</button>
      </div>
      <button class="goback" @click="outIn" >
        <i class="ii"></i>
      </button>
    </div>
    <!-- 所有报警区域列表 -->
    <div class="cover" v-show="checkTime || setAreaTime">
      <div class="sel_time" v-show="checkTime">
        <input type="submit" class="del" value="X" @click="checkTime=false" />
        <h6>请选择起止时间</h6>
        <div class="put_wrap">
          <span>开始时间：</span>
          <input type="datetime-local" v-model="startTime" ref="star" />
        </div>
        <div class="put_wrap">
          <span>结束时间：</span>
          <input type="datetime-local" v-model="endTime" />
        </div>
        <button @click="searchByTime">搜索</button>
      </div>

      <div class="sel_time" v-show="setAreaTime">
        <input type="submit" class="del" value="X" @click="stopSetArea" v-show="false" />
        <h6>请选择起止时间</h6>
        <div class="put_wrap">
          <span>报警类型：</span>
          <select name id v-model="alarmType">
            <option value="1">单次报警区域</option>
            <option value="2">例常报警区域</option>
          </select>
        </div>
        <div class="danci" v-show="alarmType==1">
          <div class="put_wrap">
            <span>开始时间：</span>
            <input type="datetime-local" v-model="startTime" ref="star" />
          </div>
          <div class="put_wrap">
            <span>结束时间：</span>
            <input type="datetime-local" v-model="endTime" />
          </div>
          <div class="put_wrap">
            <span>区域名称：</span>
            <input type="text" v-model="areaName" />
          </div>
        </div>
        <div class="lichang" v-show="alarmType==2">
          <div class="put_wrap">
            <span>开始时间：</span>
            <input type="time" v-model="startTime" ref="star" />
          </div>
          <div class="put_wrap">
            <span>结束时间：</span>
            <input type="time" v-model="endTime" />
          </div>
          <div class="put_wrap">
            <span>区域名称：</span>
            <input type="text" v-model="areaName" />
          </div>
        </div>
        <button @click="submitSetAreaWarning">确认</button>
      </div>
    </div>
    <!-- 切换航速据模式 -->
    <div class="change-type" v-show="hasPerson &&oldOrNew!=='old'&& !setWarning &&moveingPersonList.length===1">
      <div class="btn" :class="{yc:checkTypeIsShow}" @click="changeTypeHandle">
        <i class="fangxiang"></i>
      </div>
      <div class="btn-wrap" v-show="!checkTypeIsShow">
        <p>请选择定位类型</p>
        <div class="list">
          <div class="item item1" @click="changeTypeBtnClick1" :class="{active:checkIndex===1}">
            <div class="icon"></div>混合
          </div>
          <div class="item item2" @click="changeTypeBtnClick2" :class="{active:checkIndex===2}">
            <div class="icon"></div>北斗
          </div>
          <div class="item item3" @click="changeTypeBtnClick3" :class="{active:checkIndex===3}">
            <div class="icon"></div>基站
          </div>
          <div class="item item4" @click="changeTypeBtnClick4" :class="{active:checkIndex===4}">
            <div class="icon"></div>wifi
          </div>
        </div>
      </div>
    </div>
    <!-- 切换航速据模式 -->
    <div class="isjiupian" v-show="oldOrNew=='old'">
      <!-- <button @click="jiupianhou" :class="{active:jiupian}">可能轨迹</button>
      <button @click="weijiupian" :class="{active:!jiupian}">混合定位</button> -->
      <div class="btn" :class="{yc:checkTypeIsShow}" @click="changeTypeHandle">
        <i class="fangxiang"></i>
      </div>
      <div class="list" v-show="!checkTypeIsShow">
        <p>请选择轨迹模式</p>
        <!-- 默认显示不纠偏 -->
        <div class="i" :class="{active:!jiupian}" @click="jiupianhou">
          <span></span>
          <p>历史定位</p>
        </div>
        <div class="i" :class="{active:jiupian}" @click="weijiupian">
          <span></span>
          <p>可能路径</p>
        </div>
      </div>
      
    </div>
  </div>
</template>
<style >
@import url(./guiji.css);
.delArea {
  padding: 0 6px;
}
</style>
<script>
//
import * as meth from "./methods.js";
import * as more from "./more.js";
import * as buJiupian from "./bujiupian.js"
import Tag from "./tag";
import { setInterval, setTimeout, clearInterval } from "timers";
export default {
  components: { Tag },
  data() {
    return {
      map: "",
      moveTimer: null,
      moveingPersonList: [],
      dataHasChange: false, //...用户有没有进行页面操作，默认没有操作
      activePersonsDingWei: [], //.......当前显示人员的经纬度数组
      isChange: false, //....数据是否变化了
      active_person_show: false,
      bianzu_list_show: false,
      checked_person_show: false,
      jigouOptionStr: "",
      gunAndJingyuanOptionStr: "",
      activeIMEI: "",
      noCheckedList: [],
      selectedPerson: {},
      checkedPersonArr: [],
      lineArr: [], //.............线标记数组
      pointMark: [[1, 1]], //[116.49, 39.9]
      oldOrNew: "",
      checkTime: false,
      startTime: "2019-09-04T11:11", //查询历史轨迹开始时间
      endTime: "2019-09-11T11:11", //查询历史轨迹结束时间
      areaName: "",
      filterMessage: {
        uname: "",
        bianhao: "",
        newOrOld: "",
        imgSrc: ""
      },
      timer: "",
      onLeft: false,
      IMEI_img: [],
      aaimg: "",
      setWarning: false,
      markerArr: [], //当前临时标记点数组
      polyline: "",
      polygon: "",
      polygonArr: "",
      allAlarmShow: true,
      allAlarmAreaList: [], //..所有报警区域列表
      setAreaTime: false, //......设置区域报警的事件选择器
      activeAreaAlarmId: "", //......添加之后当前这一个报警区域的id
      alarmType: "1", //.........报警类型。默认为单次报警
      allAlarmSelectStr: "",
      allAlarmSelectValue: "",
      noClick: false,
      oneAlarmPersonList: [],
      oneAlarmPersonListBox: true,
      oldPositionArr: [],
      role_id: {},
      oneAlarmMessage: {},
      timer2: null,
      allPersonIEMIStr: "",
      showAllIMEI: false,
      yongqiangyuan: false,
      areaTimer: null,
      delId: "",
      shezhiyanse: null,
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        }
      ],
      value: "",
      optionsStr: "",
      hasPerson: false,
      clickTrue: true,
      header: {
        jizhan: require("@/assets/img/jizhan.png"),
        wifi: require("@/assets/img/wifi.png")
      },
      headName: "",
      checkTypeIsShow: false,
      checkIndex: 1,
      allMechanismData: null,
      allMechanism: null,
      allMechanismValue: "",
      jigouSelArr: [],
      jigouSelIndex: 0,
      allMechanismPersonList: [],
      jigouname: "",
      markerArrLinShi: [],
      jiupian:false,
      loading:null,
      last_time_arr:[],
     
    };
  },
  computed: {
    computedList() {
      return this.checkedPersonArr.slice(1);
    },
    fillSeilf() {
      return this.noCheckedList.filter(
        item => item.IMEI != this.selectedPerson.IMEI
      );
    },
    checkall:{
      get:function (){
        return this.fillSeilf.every(e=>e.checked)
      },
      set:function (b){
        // console.log(b)
        return this.fillSeilf.forEach(e=>e.checked=b)
      }
    }
  },
  methods: {
    ...meth,
    ...more,
    ...buJiupian,
    jiupianhou(){
      //现在是反的未纠偏的是显示纠偏后的数据
      this.jiupian=false
      this.searchByTime()
    },
    weijiupian(){
      //现在是反的未纠偏的是显示纠偏后的数据
      this.jiupian=true
      this.searchByTime()
    },
    clickOneTab(n) {
      this.jigouSelIndex = n;
    },
    delOneJiGou(n) {
      if (n == 0) return;

      this.jigouSelArr.splice(n, 1);
      this.clickOneTab(0);
    },
    MechanismChange() {
      let val = this.allMechanismValue.split("|");

      let tar = this.allMechanismData.find(e => e.id == val[0]);

      let hasN = this.jigouSelArr.find(e => e == tar.mechanism_name);
      if (!hasN) {
        let n = this.jigouSelArr.push(tar.mechanism_name);
        this.jigouSelIndex = n - 1;

        this.getAllJiGouName(val[0], val[1]);
      }
    },
    changeTypeHandle() {
      // 1.混合定位，2.北斗定位，3.基站定位。4，wifi定位
      this.checkTypeIsShow = !this.checkTypeIsShow;
    },
    changeTypeBtnClick1() {
      this.checkIndex = 1;
      this.value = 1;
      this.headName = "";
      this.markerArr.forEach(item => {
        item.stopMove();
      });
      this.isChange = true;
      this.searchOnePerson();
    },
    changeTypeBtnClick2() {
      this.checkIndex = 2;
      this.value = 2;
      this.headName = "";
      this.markerArr.forEach(item => {
        item.stopMove();
      });
      this.isChange = true;
      this.searchOnePerson();
    },
    changeTypeBtnClick3() {
      this.$message("当前为基站定位，定位数据仅供参考");
      this.checkIndex = 3;
      this.value = 3;
      this.headName = "jizhan";
      this.markerArr.forEach(item => {
        item.stopMove();
      });
      this.isChange = true;
      this.searchOnePerson();
    },
    changeTypeBtnClick4() {
      this.checkIndex = 4;
      this.value = 4;
      this.headName = "wifi";
      this.markerArr.forEach(item => {
        item.stopMove();
      });
      this.isChange = true;
      this.searchOnePerson();
    },
    TypeChange() {
      //切模式
      console.log(this.value);
      if (!this.hasPerson) return;

      if (this.value == 3) {
        this.$message("当前为基站定位，定位数据仅供参考");
        this.headName = "jizhan";
      } else if (this.value == 4) {
        this.headName = "wifi";
      } else {
        this.headName = "";
      }
      //先清除动画一面报错
      this.markerArr.forEach(item => {
        item.stopMove();
      });
      this.isChange = true;
      this.searchOnePerson();
    },
    spanToXiangQing(item) {
      this.$store.commit("setPoliceId", {
        policeuser_id: item.policeuser_id
      });
      this.$router.push({
        name: "PersonMessage"
      });
    },
    spanToBaoJing(item) {
      this.$router.push({
        name: "BaoJing",
        params: item
      });
    },
    spanToDelete(item) {
      this.noCheckedList.forEach(obj => {
        if (obj.IMEI == item.IMEI) {
          obj.checked = false;
        }
      });
      if (this.noCheckedList.filter(e => e.checked).length < 1) {
        this.shuaXinMap();
        this.getIMEI([this.activeIMEI]);
        this.checkedPersonArr.length = 0;
        return;
      }
      this.yijingXuanze();
    },
    toOnePersonData() {
      this.$store.commit("setPoliceId", {
        policeuser_id: this.selectedPerson.policeuser_id
      });
      this.$router.push({
        name: "PersonMessage"
      });
    },
    toHistory() {
      this.$confirm("此操作将搜索历史轨迹, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.oldOrNew = "old";
          this.isChange = true;
          this.checkTime = true;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    changeTime(timestamp) {
      var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D =
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
      var h =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      var m =
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":";
      var s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    },
    alarmBoxShowOrHide() {
      this.oneAlarmPersonListBox = !this.oneAlarmPersonListBox;
    },
    stopSetArea() {
      this.setAreaTime = false;

      this.polygon.hide();
      this.markerArr.length = 0;
      // console.log(this.markerArr)
    },
    showOne(ev,val) {
      this.hasPerson = false;
      this.bianzu_list_show = false;
      this.markerArr.forEach(item => {
        item.stopMove();
      });
      let v=null;
      if(!val){
        v = this.$refs.alarmSelect.value;
      }else{
        v=val
      }
     
      // let id = this.alarmId;
      this.allMechanismPersonList.length = 0;
      this.jigouSelArr.length = 1;
      this.jigouSelIndex = 0;
      this.delId = v;
      if (!v) {
        this.$message({
          type: "warning",
          message: "先选择区域"
        });
        return;
      }

      setTimeout(() => {
        this.overArea(v);
      }, 500);
      clearInterval(this.areaTimer);
      this.areaTimer = setInterval(() => {
        this.overArea(v);
      }, 10000);
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.getOneAlarmArea(v);

      this.noClick = true;
      this.isChange = true;
      this.oldOrNew = "";
    },
    del() {
      let id = this.delId;
      let that = this;

      this.$confirm("此操作将永久删除该区域, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          that.delOneAlarmArea(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    showAll() {
      let v = this.$refs.alarmSelect.value;

      this.getOneAlarmArea(v);
      // this.showAllAlarmArea(this.allAlarmAreaList)
    },
    submitSetAreaWarning() {
      let newArr1 = [...this.checkedPersonArr, this.selectedPerson];
      let gun_ids11 = newArr1.map(e => e.gun_id);

      let ip_ids = newArr1.map(item => item.ip_id);

      let pointsArr11 = this.markerArr.map(
        e => `${e.Ge.position.lng}|${e.Ge.position.lat}`
      );
      let policeuser_id = this.selectedPerson.policeuser_id;
      let s_t = this.startTime.replace("T", " ");
      let e_t = this.endTime.replace("T", " ");
      let areaName = this.areaName;
      let str = newArr1.map(e => e.IMEI).join(",");

      if (!areaName.trim()) {
        this.$message({
          type: "warning",
          message: "请输入区域名称"
        });
        return;
      }
     if(new Date(s_t).getTime() >new Date(e_t).getTime()){
       this.$message({
          type: "warning",
          message: "时间选择有误，请重新选择"
        });
        return;
     }
      this.shezhiquyu(
        gun_ids11,
        ip_ids,
        pointsArr11,
        policeuser_id,
        s_t,
        e_t,
        areaName,
        str
      );
      // this.markerArr.length=0

      this.startTime = this.endTime = "";
      this.areaName = "";
    },
    showOneAlarmArea(arr, id) {
      // console.log('247',arr,id)
      let map = this.map;
      let that = this;
      let arr2 = arr.map(e => e.Ge.position);
      var polygon = new AMap.Polygon({
        path: arr2,
        fillColor: "rgba(165,233,170,0.5)", // 多边形填充颜色
        borderWeight: 2, // 线条宽度，默认为 1
        strokeColor: "rgb(66,92,248)", // 线条颜色
        area_alarm_id: id
      });

      polygon.on("rightclick", function(ev) {
        var contextMenu = new AMap.ContextMenu();
        contextMenu.addItem(
          "删除该区域",
          function() {
            polygon.hide();
            that.delOneAlarmArea(ev.target.Ge.area_alarm_id);
          },
          0
        );
        contextMenu.addItem(
          "显示该区域人员",
          function() {
            console.log("可以获取单个区域");
          },
          1
        );
        contextMenu.open(map, ev.lnglat);

        // console.log('showOneAlarmArea',ev)
        // console.log('showOneAlarmArea',ev.target.G.area_alarm_id)

        // that.$confirm('此操作将永久删除该q区域, 是否继续?', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   that.delOneAlarmArea(ev.target.G.area_alarm_id)
        //   this.$message({
        //     type: 'success',
        //     message: '删除成功!'
        //   });
        // }).catch(() => {
        //   this.$message({
        //     type: 'info',
        //     message: '已取消删除'
        //   });
        // });
      });
      this.polygon = polygon;
      map.add(polygon);
      this.map.setFitView(polygon);
    },
    showAllAlarmArea(arr) {
      //........参数必须为数组
      if (arr == "") {
        this.$message("暂时没有报警区域");
        return;
      }
      let that = this;
      let map = this.map;
      let arr2 = arr.length ? arr : [arr] || this.allAlarmAreaList;
      let arr3 = arr2.map(e => {
        let pointArr = e.points.split(",").map(e => e.split("|"));
        return {
          ...e,
          pointArr
        };
      });
      let polygonArr = arr3.map(item => {
        return new AMap.Polygon({
          path: item.pointArr,
          fillColor: "rgba(165,233,170,0.5)", // 多边形填充颜色
          borderWeight: 2, // 线条宽度，默认为 1
          strokeColor: "rgb(66,92,248)", // 线条颜色
          area_alarm_id: item.area_alarm_id,
          stime: item.stime,
          etime: item.etime,
          isenable: item.isenable
        });
      });
      polygonArr.forEach(e => {
        e.on("rightclick", function(ev) {
          var contextMenu = new AMap.ContextMenu();
          contextMenu.addItem(
            "删除该区域",
            function() {
              e.hide(); //
              that.delOneAlarmArea(ev.target.Ge.area_alarm_id);
            },
            0
          );
          contextMenu.addItem(
            "显示该区域人员",
            function() {
              // console.log("显示该区域人员", ev.target.Ge.area_alarm_id);
              that.getOneAlarmArea(ev.target.Ge.area_alarm_id);
            },
            1
          );
          contextMenu.open(map, ev.lnglat);
          // contextMenuPositon = ev.lnglat;
        });
      });

      this.polygonArr = polygonArr;
      map.add(polygonArr);
      this.map.setFitView(polygonArr);
    },
    outIn() {
      if (this.allAlarmShow) {
        $(".alarm_list").animate({ right: "-2.4rem" }, function() {
          $(".goback").animate({ right: "2.08rem" });
          $(".ii").css("transform", "rotateY(180deg)");
        });
      } else {
        $(".goback").animate({ right: "0" }, function() {
          $(".alarm_list").animate({ right: "-0.33rem" });
          $(".ii").css("transform", "rotateY(0deg)");
        });
      }
      this.allAlarmShow = !this.allAlarmShow;
    },
    donghua() {
      //临时用作执行手动执行实时动画
      let that = this;

      AMapUI.load(["ui/misc/PathSimplifier", "lib/$"], function(
        PathSimplifier,
        $
      ) {
        if (!PathSimplifier.supportCanvas) {
          alert("当前环境不支持 Canvas！");
          return;
        }
        that.map.clearMap();
        var heads = [
          "../project/Uploads/2018-12-21/1-8.png",
          "../project/Uploads/2018-12-21/1-2.png",
          "../project/Uploads/2018-12-21/Q11.png"
        ];
        var paths = [
          [[116.288282, 40.149152], [116.288656, 40.148176]],
          [[116.292874, 40.149154], [116.282716, 40.148926]],
          [[116.288856, 40.148282], [116.288156, 40.141282]]
        ];

        that.initPage(PathSimplifier, $, heads, paths);
      });
    },
    changeGuiJiType(e) {
      this.checked_person_show=false
      this.bianzu_list_show=false
      this.isChange = true; //..改变了数据避免多次点击
      this.oldOrNew = e.target.value;
      if (e.target.value == "new") {
        this.lineArr.length = 0;
      } else {
        this.pointMark = [1, 1];
      }
    },
    toBaoJing() {
      //去报警管理页面
      let p = this.activeIMEI;
      this.$confirm("此操作将去报警页面, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$router.push({
            name: "BaoJing",
            params: this.selectedPerson
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    searchByTime() {
      //.....根据时间搜索历史轨迹
      let t1 = this.startTime.replace("T", " ");
      let t2 = this.endTime.replace("T", " ");
      if (!t1 || !t2) {
        this.$message({
          message: "请选择时间",
          type: "warning"
        });
        return;
      }
      if(new Date(t1).getTime()>new Date(t2).getTime()){
        this.$message({
          message: "时间选择有误，请重新选择",
          type: "warning"
        });
        return;
      }
      this.shuaXinMap();
      if(this.jiupian){
        this.searchHistory(this.activeIMEI, t1, t2); //通过起止时间搜索历史轨迹
      }else{
        this.getBujiupian(this.activeIMEI, t1, t2)//不纠偏的历史轨迹
      }
    

      // this.startTime = this.endTime = "";
    },
    searchOnePerson() {
      // this.jiupian=true//默认是纠偏后的
      // clearInterval(this.moveTimer);
      //.........搜索人员后弹出该人员信息
      this.oneAlarmMessage = {};
      this.oneAlarmPersonList.length = 0;
      if (!this.isChange) {
        console.log("重复点击");
        this.map.setFitView([...this.markerArr]);
        return;
      }
      if (this.showAllIMEI) {
        this.getAllPersonByIMEI(this.allPersonIEMIStr);
        return;
      }
      if (this.markerArr.length) {
        this.markerArr.forEach(item => {
          item.stopMove();
        });
      }
      // 跨区域编组新增
      this.jigouSelArr.length = 0;
      this.jigouSelArr.push(this.jigouname);
      // console.log(this.jigouname);
      // 跨区域编组新增
      clearInterval(this.areaTimer);
      this.noCheckedList.forEach(e => (e.checked = false));
      this.checkedPersonArr.length = 0;
      //清除循环请求是否超出区域的定时器
      clearInterval(this.areaTimer);

      this.shuaXinMap(); //......刷新地图
      this.$refs.alarmSelect.value = "";
      this.setWarning = false; //..........关闭设置报警区域

      // this.IMEI_img[this.activeIMEI] = this.activeIMEI['']['img'] ;
      this.IMEI_img = [];
      this.IMEI_img[this.activeIMEI] = this.aaimg;
      this.filterMessage.uname = this.selectedPerson.policeuser_name;
      this.filterMessage.bianhao = this.selectedPerson.policeuser.police_number;
      this.filterMessage.imgSrc = this.selectedPerson.policeuser.icon;
      // this.filterMessage.newOrOld=this.oldOrNew

      this.$refs.star.max = nowTime();
      if (this.oldOrNew == "old") {
        this.checkTime = true;
        return;
      }

      // this.IMEI_img[this.activeIMEI] = this.activeimg ;
      this.active_person_show = true;
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.getIMEI([this.activeIMEI]); //..............搜索一个人员
      function nowTime() {
        //...获取当前时间串
        let str = "";
        var date_now = new Date();
        var year = date_now.getFullYear();
        var month =
          date_now.getMonth() + 1 < 10
            ? "0" + (date_now.getMonth() + 1)
            : date_now.getMonth() + 1;
        var date =
          date_now.getDate() < 10
            ? "0" + date_now.getDate()
            : date_now.getDate();
        return (str = `${year}-${month}-${date}`);
      }
      let that = this;
    },
    bianZuList() {
      //....选择编组人员列表

      // this.bianzu_list_show=true
      this.bianzu_list_show = !this.bianzu_list_show;
      this.checked_person_show = false;
    },
    yijingXuanze() {
      //.................编组后搜索一组人员
      let fillterPerson = [];
      this.allMechanismPersonList.forEach(item => {
        item.forEach(e => {
          if (e.checked) {
            fillterPerson.push(e);
          }
        });
      });
      // 跨机构编组
      let arrCED = this.noCheckedList.filter(e => e.checked);
      if (!arrCED.length) {
        this.$message("请选择编组人员");
        return;
      } else {
        for (var i = 0; i < arrCED.length; i++) {
          this.IMEI_img[arrCED[i]["IMEI"]] = arrCED[i]["policeuser"]["img"];
        }
        // 跨机构编组新增
        fillterPerson.forEach((item, index) => {
          this.IMEI_img[item["IMEI"]] = item["policeuser"]["img"];
        });
        // console.log(this.IMEI_img);
        // return;
        // this.checkedPersonArr = arrCED;
        this.checkedPersonArr = [...arrCED, ...fillterPerson];
        this.bianzu_list_show = false;
        this.checked_person_show = true;
        //.............一组人员定位
        let arrIMEI = arrCED.map(e => e.IMEI);
        arrIMEI.unshift(this.activeIMEI);
        let fillterPersonIMEI = fillterPerson.map(e => e.IMEI);
        let IMEIList = [...fillterPersonIMEI, ...arrIMEI];
        console.log(IMEIList);

        this.shuaXinMap(); //..刷新地图
        this.getIMEI(IMEIList);
        // this.getIMEI(arrIMEI); //....................................
      }
    },
    binaZuBack() {
      this.bianzu_list_show=false
      this.checked_person_show = !this.checked_person_show;
    },
    jigouSelChange(e) {
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let n = e.target[e.target.selectedIndex];
      this.jigouname = n.innerText.trim(); //记录当前选中的机构名字
      this.isChange = true;
      this.getPersonAndGunStr(e.target.value);
    },
    jingyuanSelChange(e) {
      // if (e.target.value == "showAll") {
      //   this.showAllIMEI = true;

      //   return;
      // }
      this.isChange = true; //..改变了数据避免多次点击
      this.str = e.target.value.split("|"); //..........记录当前选择的IMEI号

      this.activeIMEI = this.str[0];
      var img = this.str[1];

      this.aaimg = img;

      let person = this.noCheckedList.filter(e => e.IMEI == this.activeIMEI);
      this.selectedPerson = person[0];
    },
    closeToLeft() {
      //  bianzu_list_show:false,
      //   checked_person_show:false,
      if (
        this.bianzu_list_show ||
        this.checked_person_show ||
        this.oneAlarmPersonListBox
      ) {
        this.bianzu_list_show = false;
        this.checked_person_show = false;
        this.oneAlarmPersonListBox = false;
      }
      if (!this.onLeft) {
        $(".main_mes").animate({ left: "-1.7rem" }, function() {
          $(".left_btn").animate({ left: "1.7rem" });
        });
        $(".l_r").css("transform", "rotateY(180deg)");
      } else {
        $(".left_btn").animate({ left: "0rem" }, function() {
          $(".main_mes").animate({ left: "0rem" });
        });
        $(".l_r").css("transform", "rotateY(0deg)");
      }
      this.onLeft = !this.onLeft;
    },
    shuaXinMap() {
      let map = new AMap.Map("container", {
        center: [116.397428, 39.90923],
        resizeEnable: true,
        zoom: 9
      });

      // AMap.plugin(["AMap.ToolBar", "AMap.Scale"], function() {
      //   map.addControl(new AMap.ToolBar());
      //   map.addControl(new AMap.Scale());
      // });
      // return;
      // let a = document.querySelector(".amap-toolbar");
      // a.style.cssText = "position:absolute;right:0.3rem;top:0.1rem";
      this.map = map;
    },
    guijiHistory(arr) {
      AMapUI.load(["ui/misc/PathSimplifier"], function(PathSimplifier) {
        if (!PathSimplifier.supportCanvas) {
          alert("当前环境不支持 Canvas！");
          return;
        }

        //启动页面
        initPage(PathSimplifier);
      });
      let map = this.map;
      function initPage(PathSimplifier) {
        //创建组件实例
        var pathSimplifierIns = new PathSimplifier({
          zIndex: 100,

          map: map, //所属的地图实例
          getPath: function(pathData, pathIndex) {
            //返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
            return pathData.path;
          },
          // getHoverTitle: function(pathData, pathIndex, pointIndex) {
          //   返回鼠标悬停时显示的信息
          //   if (pointIndex >= 0) {
          //     //鼠标悬停在某个轨迹节点上
          //     return (
          //       pathData.name +
          //       "，点:" +
          //       pointIndex +
          //       "/" +
          //       pathData.path.length
          //     );
          //   }
          //   鼠标悬停在节点之间的连线上
          //   return pathData.name + "，点数量" + pathData.path.length;
          // },
          renderOptions: {
            //轨迹线的样式
            pathLineStyle: {
              // strokeStyle: "#64c0fa",
              // strokeStyle: '#b9ddfb',
              strokeStyle:"rgba(0,0,0,0)",
              // lineWidth: 6,
              lineWidth:0,
              dirArrowStyle: true
            }
            // pathNavigatorStyle:{
            // width:15,
            // height:15,
            // fillStyle:'green',

            // content:PathSimplifier.Render.Canvas.getImageContent('http://img4.imgtn.bdimg.com/it/u=2844400994,2589149374&fm=214&gp=0.jpg',
            // function onload() {
            //       //图片加载成功，重新绘制一次
            //       pathSimplifierIns.renderLater();
            //   },
            //   function onerror(e) {
            //       alert('图片加载失败！');
            //   })
            // }
          }
        });

        //这里构建两条简单的轨迹，仅作示例
        pathSimplifierIns.setData([
          {
            name: "轨迹",
            path: arr //.....传参
            // strokeColor:'red'
          }
        ]);

        //创建一个巡航器
return
        var navg0 = pathSimplifierIns.createPathNavigator(
          0, //关联第1条轨迹
          {
            loop: true, //循环播放
            speed: 100
          }
        );

        navg0.start();
      }
    }
  },
  created() {
    let roleId = this.$store.state.role_id;
    if (roleId == 3) {
      this.yongqiangyuan = true; //如果是用枪员，编组等功能禁用
    }
    let str = this.$gscookie.getCookie("gun");
    if (JSON.stringify(str) == "{}") {
      this.$router.push("/loginput");
    }
    this.getJiGouStr();
    this.getAlarmList(); //....获取所有报警区域列表
    this.role_id = this.$gscookie.getCookie("message_obj").role_id;
  },
  mounted() {
    
     
    //调用报警方法，
    this.timer2 = setInterval(() => {
      this.hasWarning();
    }, 10000);

    document.addEventListener("click", function(ev) {
      if (ev.target.className == "to_xiangqing") {
        console.log(ev.target.dataset.d);
      }
    });

    let that = this;
    this.shuaXinMap();

    document.querySelector(".amap-logo").style.display = "none";
    document.querySelector(".amap-copyright").style.opacity = "0";
  },
  beforeDestroy() {
    // console.log('this.timer销毁前')
    clearInterval(this.timer2);
    clearInterval(this.moveTimer);
  },
  updated() {
    document.querySelector(".amap-logo").style.display = "none";
    document.querySelector(".amap-copyright").style.opacity = "0";
  },
  activated() {
    let obj = this.$route.params;
      this.$store.commit('setStr',{
        str1:'枪支定位',
        str2:'轨迹追踪'
      })
    if (obj.area_id) {
      this.$refs.alarmSelect.value = obj.area_id;
      // console.log(obj.area_id)
      this.showOne();
    }
    // if(obj.newOrHistory=='toNew'){
    //   this.IMEI_img[obj.IMEI]=obj.icon
    //   this.activeIMEI=obj.IMEI
    //   this.filterMessage.uname=''
    //   this.shuaXinMap()
    //   this.getIMEI([obj.IMEI])
    // }else{
    //   console.log(obj)
    //   this.filterMessage.uname=obj.policeName
    //   this.filterMessage.newOrOld='old'
    //    this.filterMessage.imgSrc=obj.icon

    // }
    if (obj.IMEI) {
      this.filterMessage.uname = obj.policeName;
      this.filterMessage.newOrOld = "old";
      this.filterMessage.imgSrc = obj.icon;
      this.activeIMEI = obj.IMEI;
      this.checkTime = true;
    }
  },
  
  deactivated(){
    this.loading ? this.loading.close():null
    this.$store.commit('huanyuanStr')
  }
};
</script>
