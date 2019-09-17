<template>
  <div class="item-main" v-if="!!item.created">
    <div class="title" style="color:#ffffff">
      <div class="round_wrap">
        <div class="round"></div>
        <div class="gun"></div>
      </div>
      <div class="name">
        <p>
          {{item.policeuser.policeuser_name}}
          <i
            :title="item.policeuser.police_number"
          >{{item.policeuser.police_number}}</i>
        </p>
        <p class="time">{{changeTime(item.created)}}</p>
      </div>
    </div>
    <div class="content">
      <div class="tex_wrap">
        <div class="list">
          <span>报警类型：</span>
          <span>{{item.type}}</span>
        </div>
        <div class="list">
          <span>处理人：</span>
          <span>{{item.uname || "暂无"}}</span>
        </div>
        <div class="list">
          <span>枪支编号：</span>
          <span>{{item.gun.gun_code}}</span>
        </div>
        <div class="list">
          <span>枪支类型：</span>
          <span>{{item.gun.gtype}}</span>
        </div>
        <div class="list" v-if="false">
          <span>描述：</span>
          <span>电量剩余{{item.ele}}%</span>
        </div>
        <div class="list" v-if="false">
          <span>处理意见：</span>
          <span class="yijian" :title="item.desc">{{!!item.desc ? item.desc :'无'}}</span>
        </div>
        <div class="list">
          <span>是否处理：</span>
          <span :class="chuli">
            <i></i>
            {{text}}
          </span>
        </div>
        <div class="list btnwrap">
          <button class="btn1" @click="showNew([item.nlongitude,item.nlatitude])">最新位置</button>
          <button class="btn2" @click="showAlert([item.lon,item.lat])">报警位置</button>
          <button class="btn3" @click="showMore(item)">详情</button>
        </div>
      </div>

      <div
        class="sel"
        v-show="!item.desc && item.types!='08'"
        :class="{selected:item.checked}"
        @click="changeOne(item.index)"
      ></div>
    </div>
    <div class="cover" v-if="xiangqing">
      <div class="alert" v-if="message.IMEI">
         <button class="close" @click="closeXiangqing">取消</button>
        <div class="del"  @click="closeXiangqing">X</div>
        <div class="txt">
          <p>枪瞄IMEI：{{message.IMEI}}</p>
          <p> 处理标题：{{message.desc}}</p>
          <p>枪支类型：{{message.gtype}}</p>
          <p>枪支编号：{{message.gun_code}}</p>
          <p>手机号码：{{message.mobile}}</p>
          <p>持枪人警号：{{message.police_number}}</p>
          <p>持枪人姓名：{{message.policeuser_name}}</p>
          <p>报警类型：{{message.type}}</p>
          <p>处理意见：{{item.content}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import url(./bj-item.css);
</style>
<script>

export default {
  props: {
    item: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      showmap:false,
      xiangqing:false,
      message:null
    };
  },
  computed: {
    chuli() {
      return this.item.desc ? "yes" : "not";
    },
    text() {
      return this.item.desc ? "已处理" : "未处理";
    }
  },
  methods: {
    closeXiangqing(){
      this.xiangqing=false;
    },
    showMore(item){
      // console.log(item.alarm_info_id)
      this.getXiangqing(item.alarm_info_id)
      
    },
    showNew(arr){     
      this.$emit('showNew',arr)
    },
    showAlert(arr){
      console.log(arr)
      if(!arr[0]&&!arr[1]){
        this.$message({
          type:'warning',
          message:'暂无'
        })
        return
      }
      this.$emit('showAlert',arr)
    },
    
    changeOne(index) {
      this.$emit("changeOneData", index);
    },
    gunCode(s) {
      if (s == 1) {
        return "92式";
      } else if (s == 2) {
        return "95式";
      } else if (s == 3) {
        return "77式";
      } else if (s == 4) {
        return "64式";
      } else if (s == 5) {
        return "92改";
      }
    },
    changeTime(timestamp) {
      var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() + " ";
      var h = date.getHours() + ":";
      var m = date.getMinutes() + ":";
      var s = date.getSeconds();
      return Y + M + D + h + m + s;
    },
    getXiangqing(id){
      var key = this.$store.state.key;
      var objs = {
        alarm_info_id:id
      };
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
     params.append("alarm_info_id", objs.alarm_info_id);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=Home&c=alarm&a=info",
        method: "POST",
        changeOrigin: true,
        data: params
      })
      .then(data => {
        if (data.status == 200) {
          this.xiangqing=true;
          this.message=data.data
          console.log(this.message)
        }
      })
      .catch(error => {
        console.log(error);
      });
    }
  },
  mounted(){
    this.showmap=true
  }
};
</script>
