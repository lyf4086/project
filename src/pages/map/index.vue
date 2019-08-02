<template>
  <div class="guiji">
    <div class="wrap">
      <div id="map"></div>
      <div class="left_mes" v-show="filterMessage.uname">
        <div class="main_mes">
          <i
            class="view"
            @click="binaZuBack"
            v-show="!oneAlarmPersonList.length||oldOrNew=='new'"
            :class="{'left_view':!checked_person_show}"
            v-if="!oneAlarmPersonList.length"
          ></i>
          <i
            class="view"
            v-if="oneAlarmPersonList.length"
            @click="alarmBoxShowOrHide"
            :class="{'left_view':!oneAlarmPersonListBox}"
          ></i>
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
              <span @click="bianZuList" v-show="oldOrNew !='old'" title="人员编组"></span>
              <span title="查看历史轨迹" @click="toHistory"></span>
              <span @click="toBaoJing" title="报警信息"></span>
              <span @click="setWarningRange" v-show="oldOrNew !='old'" title="开始设置报警区域"></span>
              <p class="lookmore" @click="toOnePersonData">查看更多>></p>
            </div>
          </div>
        </div>
        <div class="item_list" v-show="checked_person_show" v-if="!oneAlarmPersonList.length">
          <div class="title">
            <span>编组人员姓名</span>
            <span>编组人员编号</span>
            <span>编组人员详细信息</span>
          </div>
          <div class="item_wrap_scroll">
            <div class="item" v-for="item,index in checkedPersonArr" :key="index">
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
          <div class="title">
            <span>选择</span>
            <span>选择机构</span>
            <span>编组人员</span>
            <span>枪支编号</span>
          </div>
          <div class="person-list-wrap">
            <div class="person-list" v-for="item,index in noCheckedList" :key="index">
              <span>
                <input type="checkbox" v-model="item.checked" />
              </span>
              <span>{{item.mechanism_name}}</span>
              <span>{{item.policeuser_name}}</span>
              <span>{{item.gun_code}}</span>
            </div>
          </div>

          <div class="button-wrap">
            <button @click="yijingXuanze">确 定</button>
          </div>
        </div>

        <div
          class="one_alarm_person_list"
          v-if="oneAlarmPersonList.length && oneAlarmPersonListBox"
        >
          <div class="item" v-for="item,index in oneAlarmPersonList">
            <div class="img_wrap">
              <img v-if="item.icon" :src="item.icon" alt />
              <img v-if="!item.icon" src="../../assets/img/head-icon.png" alt />
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
          <option value="old">历史轨迹</option>
          <option value="new">最新轨迹</option>
        </select>
      </div>
      <button @click="searchOnePerson" v-show="activeIMEI">查找</button>
      <div class="sel_item">
        <select
          class="last-sel"
          v-model="value"
          v-html="optionsStr"
          v-show="hasPerson"
          @change="TypeChange"
        ></select>
        <!-- <el-select
          id="sel"
          v-show="hasPerson"
          v-model="value"
          placeholder="请选择"
          @change="TypeChange"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.loca_name"
            :value="item.id"
          ></el-option>
        </el-select>-->
      </div>
    </div>
    <div class="warning">
      <div class="btns">
        <span title="库存" @click="test">库存</span>
        <span title="入套">入套</span>
        <span title="执勤">执勤</span>
        <span title="离套">离套</span>
      </div>
    </div>
    <div class="setWarning" v-show="setWarning">
      <button @click="startSetArea">开始设置区域</button>
      <button @click="confirmSetArea">确认设置区域</button>
      <button @click="resetArea">重新设置区域</button>
    </div>
    <!-- 所有报警区域列表 -->
    <div class="alarm_list" v-show="role_id!=3">
      <select name id class="sel" v-html="allAlarmSelectStr" ref="alarmSelect" @change="showOne"></select>
      <div>
        <strong>报警类型：</strong>
        <p v-if="oneAlarmMessage.datetime">{{oneAlarmMessage.type}}</p>
        <p v-else="!oneAlarmMessage.datetime">--|--</p>
      </div>
      <div>
        <strong>创建时间：</strong>
        <p v-if="oneAlarmMessage.datetime">{{oneAlarmMessage.datetime}}</p>
        <p v-else="!oneAlarmMessage.datetime">--|--</p>
      </div>
      <div v-if="oneAlarmMessage.datetime">
        <button class="del-area" @click="del">删除该区域</button>
      </div>
      <button class="goback" @click="outIn">
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
        <input type="submit" class="del" value="X" @click="stopSetArea" />
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
    <!-- <el-select id="sel" v-show="hasPerson" v-model="value" placeholder="请选择" @change="TypeChange">
      <el-option v-for="item in options" :key="item.id" :label="item.loca_name" :value="item.id"></el-option>
    </el-select>-->
  </div>
</template>
<style scoped>
@import url(./index.css);
.delArea {
  padding: 0 6px;
}
</style>
<script>
import * as meth from "./methods.js";
import * as fns from "./index.js";
import { setInterval, setTimeout, clearInterval } from "timers";
export default {
  data() {
    return {
      BM: null,
      map: null,
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
      startTime: "", //查询历史轨迹开始时间
      endTime: "", //查询历史轨迹结束时间
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
      polyline: "",
      polygon: "",
      polygonArr: "",
      quyuArr: [], //..当前显示的区域的轮廓坐标，用以改变区域颜色
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
      markerArr: [], //当前临时标记点数组
      polyLineArr: [],
      newXianArr: [],
      shangyigequyu: null,
      fitBoundsArr: [], //记录当前显示的坐标点，用于地图自适应显示
      delId: "",
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        }
      ],
      value: "",
      optionsStr: "",
      hasPerson: false,
      clickTrue: true
    };
  },
  computed: {
    computedList() {
      return this.checkedPersonArr;
    }
  },
  methods: {
    ...meth,
    ...fns,
    TypeChange() {
      //切模式
      console.log(this.value);
      if (!this.hasPerson) return;

      if (this.value == 3) {
        this.$message("当前为基站定位，定位数据仅供参考");
      }
      //先清除动画一面报错
      // this.markerArr.forEach(item => {
      //   item.stopMove();
      // });
      this.isChange = true;
      this.searchOnePerson();
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
    mapInit() {
      let that = this;
      BM.Config.HTTP_URL = "http://192.168.1.107:9000";
      if (this.map) {
        this.map.remove();
      }
      var map = BM.map("map", "bigemap.awiawk58", {
        center: [39.9, 116.32],
        zoom: 1,
        zoomControl: true
      });

      map.setZoom(10);

      this.BM = BM;
      this.map = map;
    },
    setMarker(arr) {
      let that = this;
      let BM = this.BM;
      let map = this.map;
      let markerArr = arr.map(item => {
        // console.log(item);
        // , { title: "999999" }
        return BM.marker(item).addTo(map);
      });

      map.fitBounds(arr);
      this.markerArr = markerArr;
      markerArr.forEach(e => {
        console.log(e);
        e.bindPopup("测试弹窗");
      });
    },
    setPolyGon(arr, state) {
      let color = state === 1 ? "red" : "blue"; //state为1则存在报警
      let that = this;
      let BM = this.BM;
      let map = this.map;
      this.quyuArr = arr; //记录当前显示的区域的坐标点
      let polygon = BM.polygon(arr, { color: color }).addTo(map);
      this.polygon = polygon;
      return polygon;
    },
    newShuaXinMap() {
      let that = this;
      let BM = this.BM;
      let map = this.map;

      if (this.newXianArr.length) {
        this.newXianArr.forEach(e => e.remove());
      }
      if (this.polyLineArr.length) {
        this.polyLineArr.forEach(e => e.remove());
      }
      if (this.polygon) {
        this.polygon.remove();
      }
      if (this.markerArr.length) {
        this.markerArr.forEach(e => e.remove());
      }
      if (this.shangyigequyu) {
        this.shangyigequyu.remove();
      }
    },
    test() {
      // this.newShuaXinMap()
      console.log(this.markerArr);
      // this.markerArr.forEach(e=>e.remove())
    }
  },
  created() {
    this.getJiGouStr();
    this.getAlarmList();
  },
  mounted() {
    this.mapInit();
    $(".bigemap-control-zoom").css("display", "none");
    $(".bigemap-control-attribution").css("display", "none");
  }
};
</script>

