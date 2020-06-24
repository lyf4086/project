<template>
  <div class="item hvr-float-shadow">
    <div class="imgwrap">
      <img v-if="oneDate.icon" :src="oneDate.icon" alt="警员" />
      <img v-if="!oneDate.icon" src="../../../assets/img/head-icon.png" alt />
    </div>
    <div class="textwrap">
      <p>警员：{{oneDate.policeName}}</p>
      <p>警号：{{oneDate.policeNum}}</p>
      <p>持枪证号：{{oneDate.permitid}}</p>
      <p>单位：{{oneDate.mechanism_name}}</p>
      <p>枪支编号：{{oneDate.gunNum}}</p>
      <p>持枪类型：{{oneDate.bulletType}}</p>
      <p>
        <button @click="openalert(oneDate)">查看详情</button>
        <button @click="toHistory(oneDate)">历史轨迹</button>
        <button @click="toNew(oneDate)">最新位置</button>
        
      </p>
    </div>
    <div class="mes-l">
      <span></span>
      <p>审批人：{{oneDate.aprName}}</p>
      <p>用途：{{oneDate.taskType}}</p>
    </div>
    <div class="mes-r" :class="{'alert':oneDate.state}">
      <span v-if="oneDate.state" @click="toAlarm(oneDate)" style="cursor:pointer"></span>
      <span v-if="!oneDate.state"></span>
      <p>借出时间：{{oneDate.optime}}</p>
      <p>预期归还时间：{{oneDate.planreturntime}}</p>
    </div>
    <div class="cover1" v-show="xiangqingalert">
      <div class="alert" v-if="xiangqingData">
        <button class="del" @click="close">X</button>
        <div class="leftwrap">
          <div class="box-l">
            <div class="imgwrap">
              <img v-if="oneDate.icon" :src="oneDate.icon" alt="警员" />
              <img v-if="!oneDate.icon" src="../../../assets/img/head-icon.png" alt />
            </div>
            <div class="btnwrap">
              <button @click="toNew(oneDate)">最新轨迹</button>
              <button @click="toHistory(oneDate)">历史轨迹</button>
              <button>枪瞄状态{{xiangqingData.heart}}</button>
            </div>
            <div class="iconwrap1">
              
            </div>
            <div class="iconwrap2">
              
            </div>
          </div>
          <div class="box-r">
            <div class="text1">
              <p><i>警员</i><i>：{{oneDate.policeName}}</i></p>
              <p><i>IMEI</i><i>：{{oneDate.IMEI}}</i></p>
              <p><i>手机号</i><i>：{{oneDate.phoneNum}}</i></p>
              <p><i>单位</i><i>：{{oneDate.mechanism_name}}</i></p>
            </div>
            <div class="text2">
              <p><i>警号</i><i>：{{oneDate.policeNum}}</i></p>
              <p><i>持枪证</i><i>：{{oneDate.permitid}}</i></p>
              <p><i>枪支编号</i><i>：{{oneDate.gunNum}}</i></p>
              <p><i>枪支类型</i><i>：{{oneDate.bulletType}}</i></p>
            </div>
            <div class="text3">
              <p>本月出勤数量：{{xiangqingData.btoal}}条</p>
              <p>出勤任务总量：{{xiangqingData.toal}}条</p>
            </div>
            <div class="text4">
              <p>离套报警数量：{{xiangqingData.litao}}条</p>
              <p>区域报警数量：{{xiangqingData.quyu}}条</p>
            </div>
          </div>
        </div>
        <div class="mes mes1">
          <p><i>出库时间：</i><i>{{xiangqingData.optime}}</i></p>
          <p><i>归还时间：</i><i>{{xiangqingData.planreturntime}}</i></p>
        </div>
        <div class="mes mes2">
          <p><i>所属枪柜：</i><i>{{xiangqingData.guncabinet_code}}</i></p>
          <p><i>枪锁位：</i><i>{{xiangqingData.gposition}}</i></p>
        </div>
        <div class="mes mes3">
          <p><i>枪支编号：</i><i>{{xiangqingData.gun_code}}</i></p>
          <p><i>枪支类型：</i><i>{{xiangqingData.gunType}}</i></p>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import url(./onePerson.css);
</style>
<script>
export default {
  props: {
    oneDate: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      xiangqingalert:false,
      xiangqingData:null
    };
  },
  methods: {
    openalert(item){
      // this.getXiangqing(item.id)
      this.$emit('openalert',item)
    },
    close(){
      this.xiangqingalert=false
    },
    toHistory(obj) {
      this.$emit("toHistory", obj);
    },
    toNew(obj) {
      this.$emit("toNew", obj);
    },
    toAlarm(oneDate) {
      this.$router.push({
        name: "BaoJing",
        params: {
          one: true,
          ...oneDate
        }
      });
    },
    getXiangqing(id) {//.次方法停用
      //................获取持枪人员列表信息函数
      var key = this.$store.state.key;
      var objs = { id: id };
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("id", objs.id);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=Home&c=Gunlibrary&a=gunlibrary",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.status == 200) {
           
            this.xiangqingalert=true
            this.xiangqingData=data.data
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
