<template>
  <div class="main">
    <div id="box"></div>
    <div class="content" v-if="message">
      <div class="text">
        <div class="box1">
          <div class="title">| 基本信息</div>
          <p>
            <i class="iconfont icon-ren"></i>
            姓名：{{message.uname}}
          </p>
          <p>
            <i class="iconfont icon-xingbie"></i>
            性别：男
          </p>
          <p>
            <i class="iconfont icon-dianhua"></i>
            手机号：{{message.mobile}}
          </p>
          <p>
            <i class="iconfont icon-ren"></i>
            角色：{{message.role_name}}
          </p>
          <p>
            <i class="iconfont icon-jingcha"></i>
            警号：{{message.police_number}}
          </p>
          <p>
            <i class="iconfont icon-danweijuese"> </i>
            所属机构：{{message.mechanism_name}}
          </p>
          <p>
            <i class="iconfont icon-qiangzhi"></i>
            是否持枪：{{message.gunstate}}
          </p>
          <p>
            <i class="iconfont icon-yduibianxie"></i>
            持枪证号：{{message.robcode}}
          </p>
        </div>
        <div class="box2">
          <div class="title">| 数据统计</div>
          <!-- <div id="chart33"></div> -->
        </div>

      </div>
      <div class="img_wrap">
        <img src="../../assets/img/head-icon.png" alt v-if="!message.icon" />
        <img v-if="message.icon" :src="message.icon" alt />
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
            <div class="list" v-for="(item,index) in xiangqingList" :key="index">
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
      xiangqingList: [],
      names:["用户撞车", "SQL注入检测", "机器人登录",
                  "账号盗用", "web高频攻击", "端口扫描", "内网连接…",
                  "邮件外发"],
      data:[110, 20, 36, 10, 50, 80, 100, 60]
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
    initChart(){
      let that=this
      let box1 = document.getElementById("box");
      let Echart = this.$echarts.init(box1);
    
      let option = {
          // backgroundColor:'#000',
          grid: {
              left: '2%',
              right: '2%',
              top: '12%',
              bottom: '1%',
              containLabel: true
          },
          xAxis: {
              type: 'value',
              axisTick: {
                  show: false
              },
              axisLabel: {
                  show: false
              },
              axisLine: {
                  show: false
              },
              splitLine: {
                  lineStyle:{
                      type: 'dashed'
                  }
              },
          },
          yAxis: {
              axisTick: {
                  show: false
              },
              axisLine: {
                  lineStyle:{
                      color: '#00D3BC'
                  }
              },
              axisLabel:{
                  color:'#ddd'
              },
              data: that.names
          },

          series: {
              name: '',
              color:'#00D3BC',
              type: 'pictorialBar',
              symbol: 'rect',
              symbolRepeat: true,
              symbolClip: true,
              symbolSize: [8,20],
              label: {
                  show: true,
                  position: 'right'
              },
              data: that.data
          }
      };
      
      Echart.setOption(option);
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
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=Policeuser&a=info",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            this.data=data.data.number
            this.names=data.data.tname
            this.message = data.data.data;
            this.gunList = data.data.guns;
            this.initChart()
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
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=Gun&a=gun_info",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            this.xiangqingList = data.data.history;
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
    if(!policeuser_id){
      this.$router.go(-1)
    }
    this.getData(policeuser_id);
  },
  mounted(){
  }
  
};
</script>
