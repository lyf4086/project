<template>
  <div class="wrap">
    <div class="item_left">
      <div class="item_title">
        各机构枪柜数量
        <i></i>
      </div>
      <div class="item_content1" id="item6_left"></div>
    </div>
    <div class="item_center">
      <div class="item_title">
        每日各类型报警数量
        <i></i>
      </div>
      <div class="item_content2" id="item6_center"></div>
    </div>
    <div class="item_right">
      <div class="item_title">
        逾期报警
        <i></i>
      </div>
      <div class="move_list" >
        <div id="move_list">
          <div class="item" :class="'item'+index%3" v-for="(item,index) in dataList3" :key="index">
              <div class="icon"></div>
              <div class="text">
                <p><span>{{item.policeName}}</span>
                <strong>{{item.type}}</strong></p>
                <span>{{item.optime}}</span>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import echartLeft from "./item6_left";
import echartCenter from "./item6_center";
import { getDataOne, getDataTwo, getDataThree } from "./apis";
export default {
  data() {
    return {
      timer1: null,
      citys: [],
      numbers: [],
      objArr: [],
      dataList3: [],
      mid: "",
      ip_id: "",
      chart2Names: ["数据1111", "数据2222"],
      chart2Data: [],
      chart2Day: []
    };
  },
  methods: {
    echartLeft,
    echartCenter,
    getDataOne,
    getDataTwo,
    getDataThree,
    startMove() {
      this.$methods.listMove("#move_list");
    }
  },
  created() {
    this.getDataOne();
    this.getDataTwo();
    this.getDataThree()
  },
  mounted() {
    
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
  grid-template-columns: 680 / @vw 530 / @vw 540 / @vw;
  grid-template-rows: 1fr;
  justify-content: space-between;
}
.item_left {
  height: 600 / @vw;
}
.item_center {
  height: 600 / @vw;
}
.item_right {
  height: 600 / @vw;
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
.item_content1 {
  box-sizing: border-box;
  padding-right: 20px;
  position: relative;
  width: 1200 / @vw;
  height: 800 / @vw;

  transform: translateX(-22%) translateY(-20%) scale(0.5);
}
.item_content1:hover {
  box-sizing: border-box;
  z-index: 12;
  padding: 10px;
  background-color: #042846;
  transition: 0.3s;
  transform: translateX(-22%) translateY(-29%) scale(1);
}
.item_content2 {
  box-sizing: border-box;
  padding-bottom: 20px;
  position: relative;
  width: 1100 / @vw;
  height: 800 / @vw;
  transform: translateX(-25%) translateY(-20%) scale(0.5);
}
.item_content2:hover {
  box-sizing: border-box;
  z-index: 12;
  //   padding: 20px;
  background-color: #042846;
  transition: 0.3s;
  transform: translateX(-22%) translateY(-29%) scale(1);
}
.move_list {
  width: 520 / @vw;
  height: 450 / @vh;
  margin-top: 50 / @vw;
  overflow: hidden;
  position: relative;
  #move_list {
    position: absolute;
    top: 0;
    left: 0;
  }
  
  .item {
    
    width: 512 / @vw;
    height: 155 / @vw;
    background: url(../../../assets/homepic/baojing_list.png) no-repeat center;
    background-size: 100% 125/@vw;
    display: grid;
    grid-template-columns: 116 / @vw auto;
    grid-template-rows: 1fr;
    justify-items: center;
    align-items: center;
    .icon {
      width: 60 / @vw;
      height: 60 / @vw;
      background: url(../../../assets/homepic/red_y1.png) no-repeat;
      background-size: 100% 100%;
    }
    .icon2 {
      width: 60 / @vw;
      height: 60 / @vw;
      background: url(../../../assets/homepic/yellow_y1.png) no-repeat;
      background-size: 100% 100%;
    }
    .icon3 {
      width: 60 / @vw;
      height: 60 / @vw;
      background: url(../../../assets/homepic/blue_y1.png) no-repeat;
      background-size: 100% 100%;
    }
    .text{
        width: 100%;
        p{
            width: 100%;
            line-height: 70/@vw;
            strong{
                color: #fa6400;
                margin-left: 30/@vw;
                font-size: 36/@vw;
            }
        }
    }
  }
   .item1{
     .icon {
      width: 60 / @vw;
      height: 60 / @vw;
      background: url(../../../assets/homepic/yellow_y1.png) no-repeat;
      background-size: 100% 100%;
    }
    .text p strong{
      color:#70ffff
    }
   }
   .item2{
     .icon {
      width: 60 / @vw;
      height: 60 / @vw;
      background: url(../../../assets/homepic/blue_y1.png) no-repeat;
      background-size: 100% 100%;
    }
    .text p strong{
      color:#f9df35
    }
   }
}
</style>