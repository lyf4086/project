<template>
  <div class="con">
    <div class="prev" @click="prev"></div>
    <div class="item4" v-if="index=='item4'">
      <div class="title">
        <span>机构名称</span>
        <span>数量</span>
      </div>
      <ul class="list" v-if="item4_data">
        <li v-for="item,index in item4_data" :key="index" @click="next(item)">
          <span>{{item.mechanism_name}}</span>
          <span>{{item.num}}</span>
        </li>
      </ul>
    </div>
    <div class="item7" v-if="index=='item7'">
      <div class="title">
        <span>枪支类型</span>
        <span>借出时间</span>
        <span>归还时间</span>
        <span>用途</span>
        <span>用枪人</span>
        <span>枪支编号</span>
        <span>机构名称</span>
      </div>
      <ul class="list">
        <li v-for="e in 20">
          <span>枪支类型</span>
          <span>借出时间</span>
          <span>归还时间</span>
          <span>用途</span>
          <span>用枪人</span>
          <span>枪支编号</span>
          <span>机构名称</span>
        </li>
      </ul>
    </div>
    <div class="item8" v-if="index=='item8'">
      <div class="title">
        <span>枪支类型</span>
        <span>所属警员</span>
        <span>枪支编号</span>
        <span>枪锁位</span>
      </div>
      <ul class="list">
        <li v-for="item,index in item8_data" :key="index">
          <span>{{item.type_name}}</span>
          <span>{{item.policeuser_name}}</span>
          <span>{{item.gun_code}}</span>
          <span>{{item.gposition}}</span>
        </li>
      </ul>
    </div>
    <div class="item9" v-if="index=='item9'">
      <div class="title">
        <span>枪支类型</span>
        <span>所属警员</span>
        <span>枪支编号</span>
        <span>枪锁位</span>
      </div>
      <ul class="list">
        <li v-for="e in 20">
          <span>枪支类型</span>
          <span>所属警员</span>
          <span>枪支编号</span>
          <span>枪锁位</span>
        </li>
      </ul>
    </div>
    <div class="gun_history" v-if="index=='gunHistory'">
      <div class="title">
        <span>机构名称</span>
        <span>枪支类型</span>
        <span>枪支编号</span>
        <span>借出时间</span>
        <span>归还时间</span>
        <span>用途</span>
        <span>用枪员</span>
      </div>
      <p
        v-if="!gun_history_data.length"
        style="width:100%;text-align:center;line-height:300px;"
      >暂无数据</p>
      <ul class="list" v-if="gun_history_data.length">
        <li v-for="item,index in gun_history_data" :key="index">
          <span>{{item.org_name}}</span>
          <span>{{item.gunType}}</span>
          <span>{{item.gunNum}}</span>
          <span>{{item.oprtime}}</span>
          <span>{{item.planTime}}</span>
          <span>{{item.taskinfo}}</span>
          <span>{{item.username}}</span>
          <!-- <span>机构名称</span>
          <span>枪支类型</span>
          <span>枪支编号</span>
          <span>借出时间</span>
          <span>归还时间</span>
          <span>用途</span>
          <span>用枪员</span>-->
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
@import url(./pub.css);
</style>
<script>
export default {
  data() {
    return {
      index: "",
      item4_data: [],
      time: "",
      gun_history_data: [],
      item7_data: [],
      item8_data: []
    };
  },
  methods: {
    prev() {
      this.$router.go(-1);
    },
    next(item) {
      this.$router.push({
        name: "Next",
        params: {
          source: "item4",
          time: this.time,
          obj: item
        }
      });
    },
    getData_item4(time, type) {
      let objs = { time: time, type: type };
      var token = this.$gscookie.getCookie("gun");
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);
      var params = new URLSearchParams();
      params.append("sign", sign);
      params.append("token", token);
      params.append("time", objs.time);
      params.append("type", objs.type);
      this.$axios({
        url:
          "http://s.tronl.cn/weixin/project/index.php?m=home&c=Index&a=moth_alarm_lit",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.status == 200) {
            this.item4_data = data.data.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getData_item7(datetime) {
      let objs = { datetime: datetime };
      var token = this.$gscookie.getCookie("gun");
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);
      var params = new URLSearchParams();
      params.append("sign", sign);
      params.append("token", token);
      params.append("datetime", objs.datetime);
      this.$axios({
        url:
          "http://s.tronl.cn/weixin/project/index.php?m=home&c=Index&a=task_lit",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          console.log("item7", data);
          if (data.status == 200) {
            this.item7_data = data.data.data;
            // console.log(this.item7_data)
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getData_item8(gtypes) {
      let objs = { gtypes: gtypes };
      var token = this.$gscookie.getCookie("gun");
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);
      var params = new URLSearchParams();
      params.append("sign", sign);
      params.append("token", token);
      params.append("gtypes", objs.gtypes);
      this.$axios({
        url:
          "http://s.tronl.cn/weixin/project/index.php?m=home&c=Index&a=gun_lit",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          console.log("item8", data);
          if (data.status == 200) {
            this.item8_data = data.data.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getDataGunHistory(id) {
      let objs = { gun_id: id };
      var token = this.$gscookie.getCookie("gun");
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);
      var params = new URLSearchParams();
      params.append("sign", sign);
      params.append("token", token);
      params.append("gun_id", objs.gun_id);
      this.$axios({
        url:
          "http://s.tronl.cn/weixin/project/index.php?m=home&c=Index&a=gun_history",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          console.log("gunlist", data);
          if (data.status == 200) {
            this.gun_history_data = data.data.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created() {
    let item = this.$gscookie.getCookie("message_obj");
    if (item.role_id == 3) {
      this.$router.push({
        name: "HuiZong"
      });
    }
    let par = this.$route.params;

    this.time = par.time;
    this.index = par.source;
    if (par.source == "item4") {
      this.getData_item4(par.time, par.type);
    } else if (par.source == "gunHistory") {
      this.getDataGunHistory(par.obj.id);
    } else if (par.source == "item7") {
      console.log("item7", par.time);
      this.getData_item7(par.time);
    } else if (par.source == "item8") {
      this.getData_item8(par.gtypes);
    } else if (par.source == "item9") {
    }
  }
};
</script>
