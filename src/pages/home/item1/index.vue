<template>
  <div class="wrap">
    <div class="left-content1">
      <div class="item_title">
        报警趋势图
        <i></i>
      </div>
      <div class="item_content11" id="content_left" @click="chart1XiangQing"></div>
    </div>
    <div class="right-content">
      <div class="item_title">
        报警类型占比
        <i></i>
      </div>
      <div class="item_content2" id="content_right" @click="chart2XiangQing"></div>
    </div>
  </div>
</template>
<script>
import echart_left from "./echart_left";
import echart_right from "./echart_right";
export default {
  data() {
    return {
        echar1_names: [],
      echar1_date: [],
      echar1_num: [],
      selected: [],
      dataList: [],
      list: [],
      echart2_data: [
        // { value: 335, name: "直接访问" },
        // { value: 310, name: "邮件营销" },
        // { value: 234, name: "联盟广告" },
        // { value: 135, name: "视频广告" },
        // { value: 1548, name: "搜索引擎" }
      ],
      timeObj: null,
      mid: "",
      hasData:0,
      loading:null
    };
  },
  methods: {
    echart_left,
    echart_right,
    dataReturn(){
      this.hasData+=1
      if(this.hasData==2){
        this.loading.close()
        this.loading=null
      }
    },
    getDataChart1() {
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
          "/weixin/project/index.php?m=home&c=Index&a=alarm",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.status == 200) {
            this.dataReturn()
            this.timeObj = data.data.time;
            this.mid = data.data.mid;
            this.echar1_date = data.data.data.days;
            this.echar1_num = data.data.data.value;
            this.list = data.data.data.series;
            this.echar1_names = data.data.data.mname;
            this.selected = data.data.data.selected;
            this.echart_left();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getData_chart2() {
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
          "/weixin/project/index.php?m=home&c=Index&a=alarm_type",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.status == 200) {
            this.dataReturn()
            this.echart2_data = data.data.data.map(item => {
              return {
                ...item,
                name: `${item.name} ( ${item.value} )`
              };
            });
            this.echart_right();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    chart1XiangQing() {
      let roleId = this.$store.state.role_id;
      if (roleId == 3) return;
      if (!this.timeObj) {
        return;
      }

      this.$router.push({
        // name: "NewXiangQing",
        name:"Item1Left",
        params: { timeObj: this.timeObj, mid: this.mid }
      });
    },
    chart2XiangQing() {
      let roleId = this.$store.state.role_id;
      if (roleId == 3) return;
      if (!this.timeObj) {
        return;
      }
      this.$router.push({
        name: "Item1Right",
        params: this.timeObj
      });
    }
  },
  mounted() {
    this.loading=this.$loading({
      background:'rgba(0,0,0,0.7)'
    })
      this.getDataChart1()
     this.getData_chart2()
    
  }
};
</script>
<style lang="less" scoped>
@vw: 38.4vw;
@vh: 21.6vh;
.wrap {
  box-sizing: border-box;
  padding: 35 / @vh 35 / @vw;
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 530 / @vw 400 / @vw;
  justify-content: space-between;
  .left-content1 {
    height: 420 / @vw;
  }
  .right-content {
    height: 420 / @vw;
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
.right {
  .item_title {
    i {
      width: 120 / @vw;
    }
  }
}
.item_content11 {
  position: relative;

  z-index: 9;
  width: 1000 / @vw;
  height: 600 / @vw;
  transform: translateX(-22%) translateY(-22%) scale(0.5);
}

.item_content11:hover {
  box-sizing: border-box;
  z-index: 12;
  padding: 2px;
  background-image: url(../../../assets/homepic/item_show.png);
  background-size: 100% 100%;
  // background-color: #042846;
  transition: 0.3s;
  transform: translateX(-25%) translateY(-25%) scale(1);
}
.item_content2 {
  position: relative;
  z-index: 9;
  width: 1000 / @vw;
  height: 600 / @vw;
  transform: translateX(-30%) translateY(-25%) scale(0.5);
}
.item_content2:hover {
  box-sizing: border-box;
  padding: 2px;
  // background-color: #042846;
  background: url(../../../assets/homepic/item_show.png) no-repeat;
  background-size: 100% 100%;
  transition: 0.3s;
  transform: translateX(-30%) translateY(-25%) scale(1);
}
</style>