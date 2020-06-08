<template>
  <div class="wrap">
    <div class="person_list">
      <div class="item" v-for="(item,index) in personList" :key="index">
        <div class="icon"></div>
        <div class="text">
          <span>姓名:{{item.uname}}</span>
          <span>电话:{{item.mobile}}</span>
        </div>
        <div class="text">
          <span title="警员角色">{{item.job}}</span>
          <span title="枪支类型">{{item.gtype}}</span>
          <span style="cursor:pointer" @click.stop="goPersonMessage(item)">其他信息</span>
        </div>
      </div>
    </div>
    <div class="chart_number">
      <div class="round_wrap">
        <div style="cursor:pointer;text-decoration:underline" @click="toXiangQing" class="num">{{total}}</div>
      </div>
      <p>重要任务枪支出口总量</p>
    </div>
  </div>
</template>
<script>
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
      let zaixian = this.$store.state.zaixian;
      if (zaixian) {
        this.$router.push({
          name: "Item5XQ"
        });
      } else {
        this.$router.push({
          name: "Item5XQ_LX"
        });
      }
    },
    goPersonMessage(item) {
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
          if (data.status == 200) {
            this.personList = data.data.data;
            this.total = data.data.total;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
   created() {
    this.getData();
  },
};
</script>
<style scoped lang="less">
@vw: 38.4vw;
@vh: 21.6vh;
.wrap {
  box-sizing: border-box;
  padding: 18 / @vw 0 20 / @vw 20 / @vw;
  display: grid;
  grid-template-columns: 660 / @vw 380 / @vw;
  grid-template-rows: 1fr;
  justify-items: center;
  overflow: hidden;
}
.chart_number {
  width: 290 / @vw;
  height: 390 / @vw;
  .round_wrap {
    position: relative;
    margin-left: 50%;
    transform: translateX(-50%);
    width: 276 / @vw;
    height: 276 / @vw;
    background: url(../../../assets/homepic/leida.png) no-repeat;
    background-size: 100% 100%;
    .num {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      width: 130 / @vw;
      height: 70 / @vw;
      line-height: 70 / @vw;
      text-align: center;
      font-size: 55 / @vw;
      font-weight: bold;
      color: #e58022;
    }
  }
  p {
    box-sizing: border-box;
    padding: 0 23px;
    color: #b1dbff;
    font-size: 30 / @vw;
    line-height: 50 / @vw;
    text-align: center;
  }
}
.person_list {
  width: 100%;
  overflow-y: auto;
  .item {
    box-sizing: border-box;
    background-image: linear-gradient(
      180deg,
      rgba(46, 179, 255, 0.12) 0%,
      rgba(20, 103, 212, 0.06) 100%
    );
    border: 1 / @vw solid rgba(55, 184, 233, 0.5);
    width: 100%;
    height: 110 / @vw;
    margin-bottom: 20 / @vw;
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 110 / @vw 530 / @vw;
    grid-template-areas:
      "a b"
      "a c";
    .icon {
      grid-area: a;
      box-sizing: border-box;
      background: #237aa5 url(../../../assets/homepic/menu_icon4.png) no-repeat
        center;
      background-size: 80% 80%;
    }
    .text {
      font-size: 24 / @vw;
      color: #fff;
      display: flex;
      justify-content: space-around;
      align-items: center;
      span{
          box-sizing: border-box;
          padding: 0 2px;
          max-width: 50%;
          white-space: nowrap;
          overflow: hidden;
      }
    }
    .text:nth-child(2) span:nth-child(1) {
      max-width: 40%;
    }
    .text:nth-child(2) span:nth-child(2) {
      max-width: 60%;
    }
    .text:nth-child(3) {
      color: #e58022;
    }
  }
}
.person_list::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
.person_list::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(233, 241, 114, 0.5);
  background: rgba(28, 121, 241, 0.8);
}
.person_list::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(45, 13, 223, 0.2);
  border-radius: 0;
  background: rgba(221, 213, 213, 0.6);
}
</style>