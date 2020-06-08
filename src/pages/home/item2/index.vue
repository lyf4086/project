<template>
  <div class="wrap">
    <div class="item">
      <div class="imgwrap">
        <div class="icon"></div>
      </div>
      <div class="text">
        <strong>枪支总量</strong>
        <div>
          <b style="cursor:pointer;text-decoration:underline"  @click="toQiangZhi">{{obj.gunai}}</b>
          <i>支</i>
        </div>
      </div>
      <div class="bar"></div>
    </div>
    <div class="item">
      <div class="imgwrap">
        <div class="icon"></div>
      </div>
      <div class="text">
        <strong>枪柜总量</strong>
        <div>
          <b style="cursor:pointer;text-decoration:underline" @click="toQiangGui">{{obj.lcount}}</b>
          <i>个</i>
        </div>
      </div>
      <div class="bar"></div>
    </div>
    <div class="item">
      <div class="imgwrap">
        <div class="icon"></div>
      </div>
      <div class="text">
        <strong>枪瞄总量</strong>
        <div>
          <b style="cursor:pointer;text-decoration:underline" @click="toQiangMiao">{{obj.guncount}}</b>
          <i>个</i>
        </div>
      </div>
      <div class="bar"></div>
    </div>
    <div class="item">
      <div class="imgwrap">
        <div class="icon"></div>
      </div>
      <div class="text">
        <strong>警员总数</strong>
        <div>
          <b style="cursor:pointer;text-decoration:underline" @click="toJingYuan">{{obj.pcount}}</b>
          <i>人</i>
        </div>
      </div>
      <div class="bar"></div>
    </div>
  </div>
</template>
<style scoped >
@import url("./index.css");
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
    toQiangZhi() {
      
      this.$router.push({
        name: "QiangZhi"
      });
    },
    toQiangMiao() {
      
      this.$router.push({
        name: "QiangMiao"
      });
    },
    toQiangGui() {
      
      this.$router.push({
        name: "QiangGui"
      });
    },
    toJingYuan() {
      let roleId = sessionStorage.getItem('role_id')
     
      if (roleId == 2) {
        this.$message.warning('无权查看')
        return
      };
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
  created(){
      this.getData()
  }
};
</script>