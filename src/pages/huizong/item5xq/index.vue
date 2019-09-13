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
      timer: null
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
    initMap() {
      let map = new AMap.Map("container", {
        center: [116.397428, 39.90923],
        resizeEnable: true,
        zoom: 13
      });
      this.map = map;
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
            this.setMarker(data.data.positions);
            // this.move()
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    setMarker(list) {
      let activeImg = require("@/assets/img/head-icon.png"); //引入默认图片
      let markerArr = list.map((item, i) => {
        let xy = [item.longitude, item.latitude];
        return new AMap.Marker({
          content: `<div class="marker-route11" >
                      <div class="cover11" ></div>
                      <div class="img_wrap11">
                        <img src="${activeImg}" />
                      </div>
                    </div>`,
          position: xy,
          title: item.policeName,
          offset: new AMap.Pixel(-16, -56)
        });
      });
      markerArr.forEach(item => {
        AMap.event.addListener(item, "click", function(ev) {
          // console.log(333);
        });
      });

      this.map.add(markerArr);
      this.map.setFitView([...markerArr]);
    }
  },
  created() {
    let mes = this.$gscookie.getCookie("message_obj");
    this.t_mechanism_id = mes.mechanism_id;
    this.getData(mes.mechanism_id);
    this.timer = setInterval(() => {
      this.$router.go(0);
    }, 180000);
  },
  mounted() {
    this.initMap();
    this.$store.commit("setStr", {
      str1: "全国枪支",
      str2: "出勤详情"
    });
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
    this.$store.commit("huanyuanStr");
  }
};
</script>