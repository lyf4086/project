<template>
  <div class="main" v-if="message">
    <div class="content">
      <div class="text">
        <div class="item">
          <span>姓名：</span>
          <span>{{message.uname}}</span>
        </div>
        <div class="item">
          <span>角色：</span>
          <span>{{message.role_name}}</span>
        </div>
        <div class="item">
          <span>手机号：</span>
          <span>{{message.mobile}}</span>
        </div>
        <div class="item">
          <span>警号：</span>
          <span>{{message.police_number}}</span>
        </div>
        <div class="item">
          <span>所属机构：</span>
          <span>{{message.mechanism_name}}</span>
        </div>
        <div class="item">
          <span>所属枪支：</span>
          <span>{{gunList.length}} 把</span>
        </div>
        <div class="gun_list">
          <div class="gun_item" v-for="(item,index) in gunList" :key="index">
            <strong>所配枪支</strong>
            <p>枪支类型：{{item.gtype_name}}</p>
            <p>枪支编号：{{item.gun_code}}</p>
            <button @click="gunMessage(item)">详情</button>
            <button @click="history(item)">历史借出记录</button>
          </div>
        </div>
      </div>
      <div class="img_wrap">
        <img src="../../assets/img/head-icon.png" alt v-if="!message.icon">
        <img v-else="message.icon" :src="message.icon" alt>
      </div>
    </div>
    <!-- <div class="imgwrap" v-if="false">
      <img :src="message.icon" alt="">
    </div>
    <div class="textwrap">
      <p>警员姓名：{{message.uname}}</p>
      <p>所属机构：{{message.mechanism_name}}</p>
      <p>警号：{{message.police_number}}</p>
      <p>警员角色：{{message.role_id}}</p>
      <p>联系电话：{{message.mobile}}</p>
      <p>职位：{{message.position}}</p>
    </div>
    <div class="gunwrap">
      <div class="item" v-for="item,index in gunList" :key="index">
        <p>枪支编号: {{item.gun_code}}</p>
        <p>枪支类型：{{item.gtype_name}}</p>
        <p>枪瞄id：{{item.gunaiming_id}}</p>
        <div class="gun">

        </div>
      </div>
    </div>
    -->
    <button class="prev" @click="prev"></button>
    <div class="cover" v-if="xiangqing">
      <div class="alert_box">
        <button class="close" @click="close">取消</button>
        <div class="contentwrap">
          <div class="top"></div>
          <div class="bottom">
            <div class="down"></div>
            <div class="up"></div>
          </div>
        </div>
        <div class="text">
          <div class="title">
            <span></span>
            <span>用枪人</span>
            <span>审批人</span>
            <span>操作人</span>
            <span>枪支类型</span>
            <span>借出时间</span>
            <span>归还时间</span>
            <span>用途类型</span>
          </div>
          <div v-if="!xiangqingList.length" class="no_data">暂无数据</div>
          <div class="list_wrap" v-if="xiangqingList.length">
            <div class="list" v-for="item,index in xiangqingList" :key="index">
              <span>{{index+1}}</span>
              <span>{{item.usrename}}</span>
              <span>{{item.aprvname}}</span>
              <span>{{item.opname}}</span>
              <span>{{item.gtype}}</span>
              <span>{{item.oprtime}}</span>
              <span>{{item.planTime}}</span>
              <span>{{item.taskinfo}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import url(./personmessage.css);
</style>
<script>
export default {
  data() {
    return {
      message: null,
      gunList: [],
      yeMa: "",
      jiGouId: "",
      fromQiangZhi: false,
      fromRenYuan: false,
      xiangqing: false,
      xiangqingList: []
    };
  },
  methods: {
    close() {
      this.xiangqing = false;
    },
    prev() {
      if (this.fromQiangZhi) {
        this.fromQiangZhi = false;
        this.$router.push({
          name: "QiangZhi",
          params: {
            yeMa: this.yeMa,
            jiGouId: this.jiGouId
          }
        });
      } else if (this.fromRenYuan) {
        this.fromRenYuan = false;
        this.$router.push({
          name: "RenYuan",
          params: {
            yeMa: this.yeMa,
            jiGouId: this.jiGouId
          }
        });
      } else {
        this.$router.go(-1);
      }
    },
    getData(porsonid) {
      var key = this.$store.state.key;
      var objs = { id: porsonid };
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("id", objs.id);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          "http://s.tronl.cn/weixin/project/index.php?m=home&c=Policeuser&a=info",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            this.message = data.data.data;
            this.gunList = data.data.guns;
            if (!this.message.mechanism_name) {
              this.$router.go(-1);
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getGunMessageList(gun_id) {
      var key = this.$store.state.key;
      var objs = { id: gun_id };
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("id", objs.id);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          "http://s.tronl.cn/weixin/project/index.php?m=home&c=Gun&a=gun_info",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            this.xiangqingList = data.data.history;
            // console.log( this.xiangqingList)
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    gunMessage(item) {
      this.xiangqing = true;
      this.getGunMessageList(item.id);
      return;
      this.$router.push({
        name: "QiangZhi",
        params: item
      });
    },
    history(item) {
      this.$router.push({
        name: "Pub",
        params: {
          from: "personmessage",
          source: "gunHistory",
          obj: item
        }
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
    let policeuser_id = this.$store.state.policeuser_id;
    this.getData(policeuser_id);
  }
};
</script>
