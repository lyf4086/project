<template>
  <div class="wrap" @click="toXiangQing">
    <div class="left" v-if="personList">
      <div class="item" v-for="(item,index) in personList" :key="index">
        <div class="tou">
          <img v-if="item.thumb_icon" :src="item.thumb_icon" alt />
          <img v-if="!item.thumb_icon" src="../../../assets/img/head-icon.png" alt />
        </div>
        <div class="text">
          <p>姓名：{{item.uname}} &nbsp;tell：{{item.mobile}}</p>
          <div>
            <span title="警员角色">{{item.job}}</span>
            <span title="枪支类型">{{item.gtype}}</span>
            <span @click="goPersonMessage(item)">其他信息</span>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <p>重要任务枪支出口总量</p>
      <h3>{{total}}支</h3>
      <div class="bg1"></div>
      <div class="bg2"></div>
    </div>
  </div>
</template>
<style scoped>
@import url(./item3.css);
</style>
<script>
import { setInterval } from "timers";
export default {
  data() {
    return {
      p: [{ n: "李志伟", t: 15697686673 }, { n: "李志伟", t: 15697686673 }],
      personList: [],
      total: ""
    };
  },
  methods: {
    toXiangQing() {
      this.$router.push({
        name: "Item5XQ"
      });
    },
    goPersonMessage(item) {
      return
      let roleId = this.$store.state.role_id;
      if (roleId == 3) return;
      this.$gscookie.setCookie("personMessage", {
        from: "HuiZong",
        item: item
      });
      this.$store.commit("setPoliceId", {
        policeuser_id: item.policeuser_id
      });
      this.$router.push({
        name: "PersonMessage"
        // params: item
      });
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
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=Index&a=gunperson",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          // console.log(data)
          if (data.status == 200) {
            this.personList = data.data.data;
            console.log("personlist", data.data);
            this.total = data.data.total;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    move() {}
  },
  created() {
    this.getData();
  },
  mounted() {}
};
</script>
