<template>
  <div class="main box">
    <div class="left-bg"></div>
    <div class="right-bg"></div>
    <div class="center-round-under"></div>
    <div class="center-round-up" @click="toXQ"></div>
    <div class="text-left">
      <p>枪支总量</p>
      <strong @click="toQiangZhi">{{obj.gunai}}</strong>
      <p>枪瞄总量</p>
      <strong @click="toQiangMiao">{{obj.guncount}}</strong>
    </div>
    <div class="text-right">
      <p>枪柜总量</p>
      <strong @click="toQiangGui">{{obj.lcount}}</strong>
      <p>警员</p>
      <strong @click="toJingYuan">{{obj.pcount}}</strong>
    </div>
    <div class="gun">350</div>
  </div>
</template>
<style scoped>
@import url(./item2.css);
</style>
<script>
export default {
  data() {
    return {
      obj: {
        gunai: 0,
        guncount: 0,
        lcount: 0,
        pcount: 0
      }
    };
  },
  methods: {
    toXQ() {
      this.$router.push({
        name: "CenterXQ"
      });
    },
    toQiangZhi() {
      let roleId = this.$store.state.role_id;
      if (roleId == 3) return;
      this.$router.push({
        name: "QiangZhi"
      });
    },
    toQiangMiao() {
      let roleId = this.$store.state.role_id;
      if (roleId == 3) return;
      this.$router.push({
        name: "QiangMiao"
      });
    },
    toQiangGui() {
      let roleId = this.$store.state.role_id;
      if (roleId == 3) return;
      this.$router.push({
        name: "QiangGui"
      });
    },
    toJingYuan() {
      let roleId = this.$store.state.role_id;
      if (roleId == 3) return;
      this.$router.push({
        name: "RenYuan"
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
          "/weixin/project/index.php?m=home&c=Index&a=guns",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          Object.assign(this.obj, data.data.data);
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
