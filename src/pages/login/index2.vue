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
import Lock32_Function from './lyfweb'
import { setTimeout } from 'timers';
export default {
  data() {
    return {
      username: "",
      pwd: "",
      randomNumber:0,
      keyStr:''
    };
  },
  methods: {
    Lock32_Function,
    res() {
      this.$router.go(0)
      this.username = this.pwd = "";
    },
    
    sub() {
      let rnd=this.randomNumber
      let randLock32=this.keyStr
      if (!this.username.trim() || !this.pwd.trim()) {
        this.$message({
          message: "用户名或密码不能为空",
          type: "warning"
        });
        return;
      }
      var key = this.$store.state.key;
      var objs = { uname: this.username, pwd: this.pwd ,rnd,randLock32};
      var sign = this.$methods.mkSign(objs, key);
      var params = new URLSearchParams();
      params.append("uname", objs.uname);
      params.append("pwd", objs.pwd);
      params.append("sign", sign);
      params.append("rnd", objs.rnd);
      params.append("randLock32", objs.randLock32);
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
             sessionStorage.setItem("gun", JSON.stringify(res.data.data.token));//使用原生方法
             this.$store.commit("setPreFix", {
              prefix_on: res.data.data.prefix_on
            });
            
            sessionStorage.setItem("mechanism_id", JSON.stringify(res.data.data.mechanism_id));//使用原生方法
            this.$store.state.role_id = res.data.data.role_id;
            sessionStorage.setItem('role_id',res.data.data.role_id)
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
            sessionStorage.setItem("message_obj", JSON.stringify(message_obj));//使用原生方法
            if (res.data.data.role_id == 3) {//如果是用枪员，只能看轨迹页面
              let zaixian=this.$store.state.zaixian
              if(zaixian){
                this.$router.push(`/indexg/guiji`);
              }else{
                this.$router.push(`/indexg/map`);
              }
              
            } else {//正常情况登录成功跳首页
              this.$router.push(`/indexg/huizong`);
            }
             this.$message({
              type: "success",
              message: "登陆成功！"
            });
            console.log('登录成功,接下来去首页');
            this.username = "";
            this.pwd = "";
          } else {
            console.log('登录失败原因：',res.data.msg)
            this.$message({
              type: "error",
              message: res.data.msg
            });
          }
        })
        .catch(req => {
          console.log(req);
        });
      
    },
    getStr(){
      let that=this
      $.ajax({
        url:that.$store.state.baseURL +'/weixin/project/index.php?m=home&c=Ukey&a=ukey',
        success:function (res){
          that.randomNumber=res
          that.Lock32_Function(res,0)
        }
      })
    }
  },
  created() {
    this.getStr()
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
