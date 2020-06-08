<template>
  <div class="wrap">
    <div class="header">
      <span>机构名称</span>
      <span>姓名</span>
      <span>枪支编号</span>
      <span>枪支类型</span>
      <span>借出时间</span>
    </div>
    <div class="list12">
      <div
        class="item"
        
        @click="toxiangqing(item.tt)"
        v-for="(item,index) in dataList"
        :key="index"
        :class="{'odd':index%2}"
        v-if="dataList.length"
      >
        <span>{{item.mechanism_name}}</span>
        <span>{{item.policeName}}</span>
        <span>{{item.gun_code}}</span>
        <span>{{item.gunType}}</span>
        <span>{{item.optime}}</span>
      </div>
    </div>
  </div>
</template>
<style scoped >
/* @import url("./item4.css"); */
@import url("./index.css");
</style>
<script>
export default {
  data() {
    return {
      dataList: [],
      ip_id: "",
      tt: "",
      mid: ""
    };
  },
  methods: {
    toxiangqing(tt) {
      this.$router.push({
        name: "Item6XQ",
        params: {
          ip_id: this.ip_id,
          tt: this.tt,
          mid: this.mid
        }
      });
    },
    move() {
      var $uList = $(".wrap .list12");
      let timer = null;
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
        var scrollHeight = $(".list12 .item:first").height();
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
          "/weixin/project/index.php?m=Home&c=Index&a=gun_history",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.status == 200) {
            this.dataList = data.data.data;
            this.ip_id = data.data.ip_id;
            this.tt = data.data.tt;
            this.mid = data.data.mid;
            if(data.data.data.length>5){
              this.move();
            }
            
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  mounted() {
    let mes = this.$gscookie.getCookie("message_obj");
    this.getData(mes.mechanism_id);
    
  }
};
</script>

