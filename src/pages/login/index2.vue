<template>
  <div class="login2">
    <div class="fromwrap">
      <div class="username">
        <input type="text" placeholder="用户名" v-model="username" ref="put" />
      </div>
      <div class="pass">
        <input type="password" placeholder="密码" v-model="pwd" @keyup.13="sub" />
      </div>

      <input type="submit" class="sub" value @click="sub" />

      <input type="reset" class="reset" value @click="res" />
    </div>
  </div>
</template>
<style scoped>
@import url(./index.css);
</style>
<script>
import axios from "axios";
import md5 from "js-md5";
export default {
  data() {
    return {
      username: "",
      pwd: ""
    };
  },
  methods: {
    res() {
      this.username = this.pwd = "";
    },
    
    sub() {
      if (!this.username.trim() || !this.pwd.trim()) {
        this.$message({
          message: "用户名或密码不能为空",
          type: "warning"
        });
        return;
      }

      var key = this.$store.state.key;
      var objs = { uname: this.username, pwd: this.pwd };

      var sign = this.$methods.mkSign(objs, key);

      var params = new URLSearchParams();
      params.append("uname", objs.uname);
      params.append("pwd", objs.pwd);
      params.append("sign", sign);

      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=login&a=loginpro",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(res => {
          if (res.data.code == 200) {
            if(res.data.data){
              if(res.data.data.mapkey){
                this.$store.commit('setMapKey',{key:res.data.data.mapkey,center:res.data.data.mapcentral})
              }
            }

            sessionStorage.setItem("sync", JSON.stringify(res.data.data.sync));
            //  this.$gscookie.setCookie("gun", res.data.data.token);
             sessionStorage.setItem("gun", JSON.stringify(res.data.data.token));//使用原生方法
             this.$store.commit("setPreFix", {
              prefix_on: res.data.data.prefix_on
            });
            // this.$gscookie.setCookie(
            //   "mechanism_id",
            //   res.data.data.mechanism_id
            // );
            sessionStorage.setItem("mechanism_id", JSON.stringify(res.data.data.mechanism_id));//使用原生方法
            this.$store.state.role_id = res.data.data.role_id;
            this.$store.state.jigouTreeStr = res.data.data.mechanism_id;
            let message_obj = {
              role_id: res.data.data.role_id,
              uname: res.data.data.uname,
              id: res.data.data.policeuser_id,
              mechanism_name: res.data.data.mechanism_name,
              police_number: res.data.data.police_number,
              sex: res.data.data.sex,
              icon: res.data.data.icon,
              mechanism_id: res.data.data.mechanism_id
            };
            // this.$gscookie.setCookie("message_obj", message_obj);
            sessionStorage.setItem("message_obj", JSON.stringify(message_obj));//使用原生方法
            if (res.data.data.role_id == 3) {
              let zaixian=this.$store.state.zaixian
              if(zaixian){
                this.$router.push(`/indexg/guiji`);
              }else{
                this.$router.push(`/indexg/map`);
              }
              
            } else {
              this.$router.push(`/indexg/huizong`);
            }
             this.$message({
              type: "success",
              message: "登陆成功！"
            });
            console.log('登录成功后',res);
          } else {
            this.$message({
              type: "warning",
              message: res.data.msg
            });
          }
        })
        .catch(req => {
          console.log(req);
        });
      this.username = "";
      this.pwd = "";
    }
  },
  created() {
    let str = this.$gscookie.getCookie("gun");
    if (str.length) {
      this.$router.push("/indexg/huizong");
    }
    
  },
  mounted() {
    this.$refs.put.focus();
  }
};
</script>
