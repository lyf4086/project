<template>
  <div class="wrap">
    <div id="container"></div>
    <div class="topbtn" @click="updown">
      <i  :class="{active:!isshow}"></i>
    </div>
    <div id="message" :class="{hidden:isshow}">
      <div class="title">
        <span>
          <i></i>机构名称
        </span>
        <span>
          <i></i>持枪人员
        </span>
        <span>
          <i></i>枪支编号
        </span>
        <span>
          <i></i>审批人员
        </span>
        <span>
          <i></i>借出时间
        </span>
        <span>
          <i></i>预计归还时间
        </span>
      </div>
      <div class="list">
        <div id="listwrap">
          <div class="item" v-for="(item,index) in dataList" :key="index">
            <span>{{item.mechanism_name || ""}}</span>
            <span>{{item.policeName || ""}}</span>
            <span>{{item.gun_code || ""}}</span>
            <span>{{item.aprname || ""}}</span>
            <span>
              <p>{{item.optime || ""}}</p>
            </span>
            <span>
              <p>{{item.planreturntime || ""}}</p>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="cover" v-if="coverShow"></div>
  </div>
</template>
<style >
@import url(./item5.css);
</style>
<script>
import { setInterval, clearInterval } from "timers";
export default {
  data() {
    return {
      dataList: [],
      isshow: true,
      timer: null,
      map:null,
      BM:null,
      loading:null,
      coverShow:false
    };
  },
  methods: {
    move() {
      var $uList = $("#listwrap");
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
        var scrollHeight = $("#listwrap .item:first").height();
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

    updown() {
      this.isshow = !this.isshow;
    },
    mapInitLiXian() {
      let that = this;
      let liXianMapKey=this.$store.state.liXianMapKey;
      let lixianMapCenter=this.$store.state.lixianMapCenter;
      BM.Config.HTTP_URL = this.$store.state.lixianStr;
      var map = BM.map("container", liXianMapKey, {
        center: lixianMapCenter,
        zoom: 1,
        zoomControl: true
      });
      map.setZoom(10);
      this.BM = BM;
      this.map = map;
    },
    setMarkerLiXian(arr) {

      let that = this;
      let BM = this.BM;
      let map = this.map;
      let markerArr = arr.map(item => {
        let cln=item.heart==1?null:'is_lixian'
        let stateName=''
        if(item.astate==1){
          stateName='litao';
        }else if(item.astate==2){
          stateName='rutao';
        }else if(item.astate==3){
          stateName='fanwei';
        }else{
          stateName='';
        }
        let activeImg = require("@/assets/img/head-icon.png");
        let icon=this.BM.divIcon({
            html:`<div class="marker-route11 ${cln}" style="margin-top:-50px;margin-left:-20px;">
                      <div class="cover11" ></div>
                      <div class="img_wrap11">
                        <img src="${activeImg}" />
                      </div>
                      <div class="set-type ${stateName}"></div>
                    </div>`
          })
        return BM.marker([item.latitude-0,item.longitude-0], {
          title: item.policeName ,
          icon:icon
          }).addTo(map);
      });
       let lixianArr=arr.map(item=>{
          return [item.latitude-0,item.longitude-0]
        })
      map.fitBounds(lixianArr);
      this.markerArr = markerArr;
      markerArr.forEach((item,index)=>{
        item.on('click',function (){
          const h = that.$createElement;
          that.$message({
            type:'none',
            duration:3000,
            message: h('div', {style:'font-size:0.18rem;line-height:0.32rem'}, [
              h('h1', null, `警员姓名：${arr[index].policeName}`),
              h('p', {  }, `所属机构：${arr[index].mechanism_name}`),
              h('p', {  }, `定位类型：${arr[index].ptype}`),
              h('p', {  }, `是否在线：${arr[index].heart==1?'在线':'不在线'}`),
              h('p', { }, `定位时间：${arr[index].created}`)
            ])
          });
          that.coverShow=true;
          setTimeout(()=>{
            that.coverShow=false;
          },3000)
        })
      })
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
            console.log(data);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getData(t_mechanism_id) {
      let objs = { t_mechanism_id };
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
          "/weixin/project/index.php?m=Home&c=Index&a=gunperson_info",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.status == 200) {
            this.dataList = data.data.data;
            this.personList = data.data.positions;
            this.setMarkerLiXian(data.data.positions);
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
    let mes = this.$gscookie.getCookie("message_obj");
    this.t_mechanism_id = mes.mechanism_id;
    this.getData(mes.mechanism_id);
    this.timer = setInterval(() => {
      this.$router.go(0);
    }, 180000);
  },
  mounted() {
    
    this.mapInitLiXian()
    this.$store.commit("setStr", {
      str1: "全国枪支",
      str2: "出勤详情"
    });
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
    this.$store.commit("huanyuanStr");
    this.loading.close()
  }
};
</script>