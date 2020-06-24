<template>
  <div class="wrap" id="wrap">
    <div class="item item1 hover" v-for="(item,index) in iconList" :key="index" @click="toList(item)">
      <div class="icon_bg">
        <div class="icon"></div>
      </div>
      <div class="nums">
        <p>{{item.name}}</p>
        <p>{{item.number}}</p>
        <i>环比{{item.ratio}}%</i>
      </div>
    </div>
   
    <div class="item item5">
      <div class="item_title">
        本单位出勤任务类型
        <i></i>
      </div>
      <div class="item_content" id="content5_left" @click="toXiangQingChart1"></div>
    </div>
    <div class="item item6">
      <div class="item_title">
        枪支借出各类型占比
        <i></i>
      </div>
      <div class="item_content2" id="content5_right" @click="toXiangQingChart2"></div>
    </div>
  </div>
</template>
<script>
import echartLeft from "./echart_left";
import echartRight from "./echart_right";
export default {
  data() {
    return {
      upShow: false,
      loading: null,
      leftT: "",
      max: 0,
      timermove: null,
      iconList: [],
      num: [0, 0, 0, 0],
      numData: {
        area: 111,
        elec: 222,
        litao: 333,
        rutao: 444
      },
      time: "",
      timer: null,
      timer1: null,
      dataRightUp: [],
      dataRight: [],
      chart1Data: {
        legendData: ["报警", "正常", "总量"],
        // xAxisData: ["22", "20", "30", "40", "50", "60", "70"],
        series: [
          {
            name: "报警",
            type: "bar",
            color: "#5dceec"
            // data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6]
          },
          {
            name: "正常",
            type: "bar",
            color: "#ed8a39"
            // data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 135.6]
          }
          // {
          //   name: "总量",
          //   type: "line",
          //   // color: "#5dcae9",
          //   yAxisIndex: 1
          //   // data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3]
          // }
        ]
      }
    };
  },
  methods: {
    echartLeft,
    echartRight,
    toList(type) {
      let roleId = this.$store.state.role_id;
      if (roleId == 3) return;
      this.$router.push({
        name: "Item4Top",
        params: { ...type }
      });
     
    },
    toXiangQingChart1(ev) {
      if(!this.leftT&&!this.mid)return
      this.$router.push({
        name: "Item7XQ",
        params: { tt: this.leftT, mid: this.mid, ip_id: this.ipId }
      });
    },
    toXiangQingChart2() {
      if(!this.leftT&&!this.mid)return
      
      this.$router.push({
        name: "Item8XQ",
        params: { tt: this.leftT, mid: this.mid, ip_id: this.ipId }
      });
    },
    getData_up() {
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
          "/weixin/project/index.php?m=home&c=Index&a=moth_alarm",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.status == 200) {
            this.upShow = true;
            this.iconList = data.data.data;
            this.time = data.data.time;
            
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getData_under_l() {
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
          "/weixin/project/index.php?m=home&c=Index&a=task",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          this.leftT = data.data.tt;
          this.mid = data.data.mid;
          this.ipId = data.data.ip_id;
          let obj = {};
          this.max = data.data.max;
          obj.legendData = data.data.legend.data;
          obj.xAxisData = data.data.time;
          obj.series = data.data.data.map(item => {
            return {
              ...item,
              type: "bar"
            };
          });

          this.chart1Data = Object.assign(this.chart1Data, obj);
          this.echartLeft();
        })
        .catch(error => {
          console.log(error);
        });
    },
    getData_under_r() {
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
          "/weixin/project/index.php?m=home&c=Index&a=lend_gun",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.status == 200) {
            let list = data.data.data.map((item, index) => {
              return {
                value: item.number,
                name: item.gtype,
                gtypes: item.gtypes
              };
            });
            this.dataRight = list;
            this.dataRightUp = data.data.data.map(item => item.gtype);
            this.echartRight();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    zuodonghua() {  
      let that=this   
      let main = $("#wrap");
     
      if(!main)return
      let list = document.querySelectorAll("#wrap .hover");
      let num = -1;
     window.clearInterval(this.timer1);
      this.timer1 = window.setInterval(donghua, 2000);
      function donghua() {
        if(!list.length)return
        num++;
        num %= 4;
        for (let i = 0; i < 4; i++) {
          list[i].classList.remove("active");
        }
        list[num].classList.add("active");
      }
      list.forEach(item=>{
        item.onmouseover = function() {
          for (let i = 0; i < 4; i++) {
            list[i].classList.remove("active");
          }
          window.clearInterval(that.timer1);
          that.timer1=null
        
        };
      })
      
      
    }
  },
  mounted() {
    this.getData_up()
      this.getData_under_l()
      this.getData_under_r()
  },
  beforeDestroy(){
      window.clearInterval(this.timer1)
      this.timer1=null
  }
};
</script>
<style scoped lang="less">
@vw: 38.4vw;
@vh: 21.6vh;

.wrap {
  box-sizing: border-box;
  padding: 0 35 / @vw;
  display: grid;
  grid-template-rows: 380 / @vh 460 / @vh;
  grid-template-columns: repeat(4, 1fr);
  grid-template-areas:
    "a b c d"
    "e e f f";
  align-content: space-around;
  align-content: space-around;
  .item {
    position: relative;
    .icon_bg {
      position: relative;
      left: 50%;
      top: 140 / @vh;
      transform: translateX(-50%) translateY(-50%);
      width: 280 / @vw;
      height: 282 / @vw;
      background: url(../../../assets/homepic/kong3.png) no-repeat center;
      background-size: 100% 100%;
      .icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-55%);
        width: 120 / @vw;
        height: 120 / @vw;
      }
    }
    .nums {
      width: 180 / @vw;
      height: 150 / @vw;
      text-align: center;
      p:nth-child(1) {
        font-size: 35 / @vw;
        line-height: 50 / @vw;
        color: #fff;
      }
      p:nth-child(2) {
        font-size: 47 / @vw;
        line-height: 60 / @vw;
        font-weight: bold;
        color: #fff;
      }
      i:nth-child(3) {
        font-size: 24 / @vw;
        line-height: 36 / @vw;
        color: #71d5ff;
      }
    }
    .icon_bg:hover {
      background: url(../../../assets/homepic/kong2.png) no-repeat center;
      background-size: 100% 100%;
    }
  }
  .hover {
    position: relative;
    .nums {
      position: absolute;
      left: 50%;
      top: 260 / @vh;
      transform: translateX(-50%);
    }
  }
  .hover:hover {
    .nums {
      p {
        color: #e58022;
      }
    }
  }
  .item:nth-child(1) .icon {
    background: url(../../../assets/homepic/right_icon1.png) no-repeat center;
    background-size: 100% 100%;
  }
  .item:nth-child(1):hover .icon {
    background: url(../../../assets/homepic/right_icon1_hover.png) no-repeat
      center;
    background-size: 100% 100%;
  }
  .item:nth-child(2) .icon {
    background: url(../../../assets/homepic/right_icon2.png) no-repeat center;
    background-size: 100% 100%;
  }
  .item:nth-child(2):hover .icon {
    background: url(../../../assets/homepic/right_icon2_hover.png) no-repeat
      center;
    background-size: 100% 100%;
  }
  .item:nth-child(3) .icon {
    background: url(../../../assets/homepic/right_icon3.png) no-repeat center;
    background-size: 100% 100%;
  }
  .item:nth-child(3):hover .icon {
    background: url(../../../assets/homepic/right_icon3_hover.png) no-repeat
      center;
    background-size: 100% 100%;
  }
  .item:nth-child(4) .icon {
    background: url(../../../assets/homepic/right_icon4.png) no-repeat center;
    background-size: 100% 100%;
  }
  .item:nth-child(4):hover .icon {
    background: url(../../../assets/homepic/right_icon4_hover.png) no-repeat
      center;
    background-size: 100% 100%;
  }
  .item5 {
    box-sizing: border-box;
    padding-right: 30 / @vw;
    grid-area: e;
  }
  .item6 {
    box-sizing: border-box;
    padding-left: 30 / @vw;
    grid-area: f;
  }
}
.item_title {
  position: relative;
  box-sizing: border-box;
  padding-left: 50 / @vw;
  font-size: 28 / @vw;
  color: #fff;
  line-height: 42 / @vh;
  width: 100%;
  height: 48 / @vh;
  background: url(../../../assets/homepic/s_title_left.png) no-repeat center
    bottom;
  background-size: 100% 80%;
  i {
    position: absolute;
    right: 20 / @vw;
    top: 15 / @vh;
    width: 160 / @vw;
    height: 10 / @vh;
    background: url(../../../assets/homepic/s_title_right.png) no-repeat;
    background-size: 100% 100%;
  }
}
.item_content {
  box-sizing: border-box;
  padding:20/@vw;
  position: relative;
  z-index: 9;
  width: 1050 / @vw;
  height: 700 / @vw;
  transform: translateX(-22%) translateY(-22%) scale(0.55);
}
.item_content2 {
  box-sizing: border-box;
  padding:30/@vw 50/@vw;
  position: relative;
  z-index: 9;
  width: 1100 / @vw;
  height: 760 / @vw;
  transform: translateX(-23%) translateY(-24%) scale(0.5);
}
.item_content:hover {
  box-sizing: border-box;
  z-index: 12;
  padding: 10px;
  // background-color: #042846;
  background-image: url(../../../assets/homepic/item_show.png);
  background-size: 100% 100%;
  transition: 0.3s;
  transform: translateX(-22%) translateY(-19%) scale(1);
}
.item_content2:hover {
  box-sizing: border-box;
  // background-color: #042846;
  background-image: url(../../../assets/homepic/item_show.png);
  background-size: 100% 100%;
  transition: 0.3s;
  transform: translateX(-35%) translateY(-28%) scale(1);
}

  .item.hover.active .icon_bg{
    background: url(../../../assets/homepic/kong2.png) no-repeat center;
    background-size: 100% 100%;
  }
 
 
</style>