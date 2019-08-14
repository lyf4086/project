<template>
  <div class="wrap">
    <div class="header">
      <span>时间</span>
      <span>机构名称</span>
      <span>数量</span>
      <span>占比</span>
      <span>总和</span>
    </div>
    <div class="list12">
      <div class="item" v-for="item,index in dataList" :key="index" v-if="dataList.length">
        <span>{{item.datetime}}</span>
        <span>{{item.mechanism_name}}</span>
        <span>{{item.number}}</span>
        <span>{{item.ratio}}%</span>
        <span>{{item.sum}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataList: []
    };
  },
  methods: {
    move() {
      var $uList = $(".wrap .list12");
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
    getData() {
      let objs = {};
      var token = this.$gscookie.getCookie("gun");
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);
      var params = new URLSearchParams();
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          "http://s.tronl.cn/weixin/project/index.php?m=home&c=Index&a=child_alarm",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.status == 200) {
            this.dataList = data.data.data;
            // console.log(data.data.data);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  mounted() {
    this.getData();
    this.move();
  }
};
</script>
<style scoped >
@import url("./item4.css");
</style >
