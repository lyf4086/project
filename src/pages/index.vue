<template>
  <div id="wrap">
    <div id="header">
      <div class="logo">
        <img src="@/assets/img/logo1.png"  @click="toBigScreem"/>
      </div>
      <div class="nav_wrap">
        <div class="nav-btns">
          <div class="nav">
            <router-link
              v-for="(item,index) in list"
              :to="item.road"
              :key="index" 
              class="item"
              tag="div"
            >
              <p>{{item.name}}</p>
              <p>{{item.en}}</p>
            </router-link>
          </div>
          <div class="btns">
            <!-- <span>配置</span> -->
            <router-link
              v-if="mes.role_id==1"
              title="配置"
              to="/indexg/peizhi"
              tag="span"
            ></router-link>
            <!--  v-show="mes.role_id!=3 && sync==1" -->
            <span title="同步数据" @click="tongbu" v-if="false"></span>

            <router-link
              title="人员管理"
              v-show="mes.role_id==3||mes.role_id==2?false:true"
              to="/indexg/renyuan"
              tag="span"
            ></router-link>
            <router-link
              title="机构管理"
              v-show="mes.role_id==3||mes.role_id==4||mes.role_id==2?false:true"
              to="/indexg/jigouguanli"
              tag="span"
            ></router-link>
            <span title="修改密码" @click="pas"></span>
            <span title="个人信息" @click="mine" class="mine"></span>
            <span title="退出登录" @click="logout"></span>
          </div>
        </div>
        <div class="title">
          <p>{{this.$store.state.str1}}</p>&nbsp;
          <p>{{this.$store.state.str2}}</p>
        </div>
        <div class="mine-message" :style="{'right':mineShow ?0:'-3rem'}">
          <div class="line1"></div>
          <div class="line2"></div>
          <div class="line3"></div>
          <div class="line4"></div>
          <p class="mine-title">个人信息</p>
          <div class="imgwrap">
            <img :src="mes.icon" v-if="mes.icon" alt="head pic" />
            <img src="@/assets/img/head-icon.png" v-if="!mes.icon" alt="head pic" />
          </div>

          <p class="mine-name">姓名：{{mes.uname}}</p>
          <p class="pms">角色：{{juese(mes.role_id)}}</p>
          <p class="pms">性别：{{mes.sex==1 ? "男" :"女"}}</p>
          <p class="pms">所属机构：{{mes.mechanism_name}}</p>
          <p class="pms">警员编号：{{mes.police_number}}</p>

          <button @click="uploadImg" class="change_pass">上传或修改头像</button>
        </div>
        <div class="cover" v-show="pasShow || upPic || tb">
          <div class="tongbu" v-show="tb">
            <div class="round"></div>数据同步中，请稍后...
          </div>
          <div class="changepass" v-show="pasShow">
            <div class="pas">
              <span>请输入密码：</span>
              <input type="password" placeholder="请输入密码" v-model="pwd1" ref="pass1" />
            </div>
            <div class="pas">
              <span>确认 密码：</span>
              <input type="password" placeholder="请再次确认密码" v-model="pwd2" ref="pass2" />
            </div>
            <div class="subs">
              <button @click="subChange">确定修改</button>
              <i></i>
              <button @click="quxiao">取消修改</button>
            </div>
          </div>

          <div class="up-pic" v-show="upPic">
            <div class="del" @click="QX">X</div>

            <el-upload
              class="avatar-uploader"
              :action="uploadImgURL"
              :show-file-list="false"
              :data="userId"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </div>
      </div>
    </div>
    <div id="content">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
    <div class="warning_list" v-show="warningList.length && warningBoxIsShow">
      <div class="item_wrap" ref="listWrap" id="auto_list">
        <transition
          name="slide-fade"
          v-for="(item,index) in warningList"
          :key="index"
          v-if="item.show"
        >
          <div class="warning_item">
            <span :title="index+1">{{index+1}}</span>
            <span @click="itemClick(item)"><i>{{item.policeuser_name||"暂无"}}</i> ({{item.type||"暂无"}})</span>
            <span class="chuli" @click="done(index)">极速处理</span>
          </div>
        </transition>
      </div>
    </div>
    <div
      class="warning_list_onoff"
      :class="{'has_donghua':!warningBoxIsShow}"
      @click="warningBox"
      v-show="warningList.length"
    >
      <span>{{warningBoxIsShow ? "隐藏列表" : "显示列表"}}</span>
      <i></i>
    </div>
    <div class="tixing">
      <div id="warning">这里是枪支归还提醒</div>
    </div>
    <!-- <audio controls="controls" src='https://www.w3school.com.cn/i/horse.ogg' ref="audio"></audio> -->
  </div>
</template>

<script>
import { setInterval, clearInterval, setTimeout } from "timers";

export default {
  
  data() {
    return {
      audioSrc:'',
      baseURL:this.$store.state.baseURL,
      uploadImgURL:this.$store.state.baseURL+"/weixin/project/index.php?m=home&c=Policeuser&a=upload",
      moveTimer: null,
      upPic: false,
      imageUrl: "",
      userId: {
        id: ""
      },
      mineShow: false,
      pasShow: false,
      pwd1: "",
      pwd2: "",
      navList: {
        数据汇总: {
          road: "/indexg/huizong",
          name: "数据汇总",
          en: "DATACOLLECTION"
        },
        轨迹追踪: { 
          road:'/indexg/guiji', 
          name: "轨迹追踪", 
          en: "TRAJECTORY" 
        },
        枪瞄管理: {
          road: "/indexg/qiangmiao",
          name: "枪瞄管理",
          en: "GUNAIMING"
        },
        枪支管理: {
          road: "/indexg/qiangzhiguanli",
          name: "枪支管理",
          en: "TRAJECTORY"
        },
        报警管理: {
          road: "/indexg/baojingguanli",
          name: "报警管理",
          en: "AMMUNITSTOCK"
        },
        弹药在库: {
          road: "/indexg/danyaozaiku",
          name: "弹药在库",
          en: "AMMUNITIONSTOCK"
        },
        弹药消耗: {
          road: "/indexg/danyaoxiaohao",
          name: "弹药消耗",
          en: "CONSUME"
        },
        枪柜: { road: "/indexg/qianggui", name: "枪柜", en: "GUNCABNET" },
        持枪人员: {
          road: "/indexg/chiqiangrenyuan",
          name: "持枪人员",
          en: "GUNLIBRARY"
        },
        枪库: { road: "/indexg/qiangku", name: "枪库", en: "GUNLIBRARY" },
        录音录像: { road: "/indexg/vidio", name: "录音录像", en: "VIDEO" }
      },
      list: [],
      mes: null,
      warningList: [],
      warningMove: false,
      warningBoxIsShow: true,
      tb: false,
      sync: "",
      loading:null,
      timer11:null,
      timerTishi:null
    };
  },
  methods: {
    playAudio(){
      let audio=document.querySelector('audio')
       audio.currentTime = 0; //从头开始播放提示音
      audio.play(); //播放
    },
    toBigScreem(){
      this.$router.push('/dapingnew')
    },
    tongbu() {
      let that = this;
      this.$confirm("此操作将同步系统数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.tb = true;
          var objs = {};
          var token = this.$gscookie.getCookie("gun");
          var key = this.$store.state.key;
          var sign = this.$methods.mkSign(objs, key);
          var params = new URLSearchParams();
          params.append("sign", sign);
          params.append("token", token);
          this.$axios({
            url:
              this.$store.state.baseURL+"/weixin/project/index.php?m=home&c=Jd&a=index",
            method: "POST",
            changeOrigin: true,
            data: params
          })
            .then(data => {
              if (data.data.code == 200) {
                this.tb = false;
                this.$message({
                  type: "success",
                  message: "数据同步成功"
                });
              }
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消同步"
          });
        });

    },
    itemClick(item) {
      if (this.$route.name == "BaoJing") {
        new Promise(resolve => {
          this.$router.push({
            name: " "
          });
          resolve();
        }).then(() => {
          setTimeout(() => {
            this.$router.push({
              name: "BaoJing",
              params: {
                one: true,
                ...item
              }
            });
          }, 10);
        });

        return;
      }
      let ty = item.type;
      if (ty == "区域报警") {
        this.$router.push({
          name: "GuiJi",
          params: item
        });
      } else {
        this.$router.push({
          name: "BaoJing",
          params: {
            one: true,
            ...item
          }
        });
      }
    },
    juese(n) {
      if (n == "1") {
        return "系统管理员";
      } else if (n == "2") {
        return "枪支管理员";
      } else if (n == "3") {
        return "用枪员";
      } else if (n == "4") {
        return "领导";
      }
    },
    handleAvatarSuccess(res, file) {
      //  let that=this

      this.mes.icon = res[0].icon;

      this.$message({
        type: "success",
        message: "上传成功"
      });
      this.upPic = false;
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      var obj = this.userId;
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(obj, key);
      var token = this.$gscookie.getCookie("gun");
      this.userId.sign = sign;
      this.userId.token = token;

      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 5MB!");
      }
      return isJPG && isLt2M;
    },
    QX() {
      this.upPic = false;
    },
    warningBox() {
      this.warningBoxIsShow = !this.warningBoxIsShow;
    },
    done(index) {
      let id = this.warningList[index].alarm_info_id;

      this.warningList[index].show = false;
      this.chuLi(id, "极速处理");
    },
    logout() {
     
      this.$confirm("将要退出登录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$gscookie.setCookie("gun", "");
          this.$router.push("/login");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出"
          });
        });

    },
    mine() {
      // this.mineShow=!this.mineShow
    },
    pas() {
      this.pasShow = true;
    },
    quxiao() {
      this.pasShow = false;
    },
    uploadImg() {
      //上传或者修改头像
      this.upPic = true;
    },
    getNav() {
      var objs = {};
      var key = this.$store.state.key;

      var sign = this.$methods.mkSign(objs, key);

      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();

      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url: this.$store.state.baseURL+"/weixin/project/index.php?m=home&c=role&a=menu",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            let obj = data.data.data.list;
            for (let item in obj) {
              this.list.push(this.navList[obj[item]]);
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    subChange() {
      if(this.pwd1.trim()=='')return
      if (!this.pwd1 || !this.pwd2) {
        this.$message({
          message: "有必填选项未填！",
          type: "warning"
        });
      }
      if (this.pwd1 !== this.pwd2) {
        this.$message.error("两次输入不一致，请重新输入");
        return;
      }
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
       //............................................................
       let mes=JSON.parse(sessionStorage.getItem('message_obj'))
      var token = this.$gscookie.getCookie("gun");
      var objs = {
        "policeuser_id":mes.id,
        "pwd":this.pwd1
      };
     
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);
      var params = new URLSearchParams();
     params.append("policeuser_id", objs.policeuser_id);
     params.append("pwd", objs.pwd);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL+"/weixin/project/index.php?m=home&c=policeuser&a=hand",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          this.loading.close()
          if (data.data.code == 200) {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.pasShow=false
          }else{
            this.$message({
              type:'error',
              message:data.data.msg
            })
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getAllWarningList() {
      // ......................获取全部报警列表
      var key = this.$store.state.key;
      var objs = {};
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL+"/weixin/project/index.php?m=home&c=alarm&a=last_alarms",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            if (!data.data.data.length) return;
            this.warningList.length=0
            let list = data.data.data.map(e => {
                  return {
                    ...e,
                    show: true
                  };
                });
            this.warningList = Object.assign([],this.warningList,list)          

              let obj={};
                let newArr=[]
                data.data.data.forEach(item=>{
                  obj[item.policeuser_id]=item
                })

                for(let i in obj){
                  newArr.push(obj[i])
                }
                //  console.log(newArr)
                //存去重后的所有报警人员
                sessionStorage.setItem('everBodyWarningType',JSON.stringify(newArr))
           
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    listMoving() {
      var $uList = $("#auto_list");
      var timer = null;
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
        var scrollHeight = $(".warning_item:first").height();
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
              .find(".warning_item:first")
              .appendTo($uList);
          }
        );
      }
    },
    chuLi(ids, desc = "") {
      var key = this.$store.state.key;
      var objs = { alarm_info_ids: ids, desc: desc };
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("alarm_info_ids", objs.alarm_info_ids);
      params.append("desc", objs.desc);
      params.append("sign", sign);
      params.append("token", token);

      this.$axios({
        url:
          this.$store.state.baseURL+"/weixin/project/index.php?m=home&c=alarm&a=alarm_processing",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            this.getAllWarningList();
          }
        })
        .catch(error => {
          console.log(error);
        });
      this.hasData = true;
    },
    tishi() {
      //.........所借枪支即将到期提示
      let roleId = this.$store.state.role_id;
      //.获取提示信息

      setInterval(() => {
        this.getTiShi();
      }, 100000);
      if (roleId == 3) {
      }
    },
    getTiShi() {
      var key = this.$store.state.key;
      var objs = {};
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL+"/weixin/project/index.php?m=home&c=Alarm&a=gun_return",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            if (!data.data.data == 0) {
              this.$message({
                type: "warning",
                message: `所借枪支归还时间：${data.data.data.planreturntime}`
              });
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    setTimer(){
       var objs = {};
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url: this.$store.state.baseURL+"/weixin/project/index.php?m=home&c=Gunlibrary&a=hand",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created() {
    this.sync = this.$gscookie.getCookie("sync");
    this.getAllWarningList();
    this.getNav();
    this.mes = this.$gscookie.getCookie("message_obj");
    this.userId.id = this.mes.id;
  },
  beforeDestroy(){
    clearInterval(this.timerTishi)
  },
  mounted() {
    
    this.timerTishi=setInterval(()=>{
      // console.log('开始播放')
      this.$store.commit('playAudio','long')
    },60000)
    //提示音
    this.timer11=setInterval(() => {
      this.setTimer()
    }, 1000000);
    this.navList['轨迹追踪'].road=this.$store.state.zaixian?'/indexg/guiji':'/indexg/map'
    // this.tishi(); //暂时弃用...执行提示函数
    // isFullscreenForNoScroll(); //...判断是否全屏
    // window.onresize = function() {
    //   isFullscreenForNoScroll();
    // };
    function isFullscreenForNoScroll() {
      if (
        document.body.scrollHeight === window.screen.height &&
        document.body.scrollWidth === window.screen.width
      ) {
        document.getElementById("content").style.height = "81vh";
      } else {
        document.getElementById("content").style.height = "78.5vh";
      }
    }
    this.listMoving();
    let that = this;
    //重复请求有下角报警列表
    setInterval(() => {
      that.getAllWarningList();
    }, 20000);

    function checkMineMessage(ev) {
      if (ev.target.className == "mine-message") {
        that.mineShow = true;
      } else if (ev.target.className == "mine") {
        // that.mineShow=true
        that.mineShow = !that.mineShow;
      } else if (ev.target.className == "change_pass") {
        that.mineShow = true;
      } else if (ev.target.className == "mine-title") {
        that.mineShow = true;
      } else if (ev.target.className == "mine-name") {
        that.mineShow = true;
      } else {
        that.mineShow = false;
      }
    }
    document.addEventListener("click", checkMineMessage);

    this.$refs.pass1.onblur = function() {
      let text = this.value;
      let reg = /^[A-Za-z0-9]{6,16}$/;
      if (!reg.test(text)) {
        that.$message("密码长度在6-16位之间，可以是数字字母结合！");
        this.focus();
      }
    };
  }
};
</script>
<style scoped >
@import url(./global.css);

#wrap {
  height: 100vh;
  background: url(../assets/img/global.png);
  background-size: 100vw 100vh;
  overflow: hidden;
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(-1rem);
  opacity: 0;
}
</style>
