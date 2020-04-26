<template>
  <div class="wrap">
      <div id="pie">
   
     </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    init() {
      let box1 = document.getElementById("pie");
      let myChart = this.$echarts.init(box1);
      let option = {
        title: {
          text: "各省总量占比图",
          textStyle: {
                align: 'center',
                color: '#fff',
                fontSize: 14,
            },
        },
        series: [
          {
            type: "pie",
            data: [
              {
                name: "国内",
                value: 60
              },
              {
                name: "国外",
                value: 40
              }
            ],
            label: {
              position: "inside"
            },
            radius: [0, 59],
            itemStyle: {
              borderWidth: 1,
              borderColor: "#FFFFFF"
            },
            clockwise: true,
            animation: false
          },
          {
            type: "pie",
            data: [
              {
                name: "北京",
                value: 20
              },
              {
                name: "天津",
                value: 20
              },
              {
                name: "上海",
                value: 20
              },
              {
                name: "广州",
                value: 20
              },
              {
                name: "深圳",
                value: 20
              }
            ],
            label: {
              position: "inside"
            },
            radius: [60, 110],
            itemStyle: {
              borderWidth: 1,
              borderColor: "#FFFFFF"
            },
            animation: true
          }
        ],
        backgroundColor: "transparent"
      };
      myChart.setOption(option)
    }
  },
  mounted(){
      this.init()
  }
};
</script>
<style lang="less" scoped>
@vw:38.4vw;
@vh:21.6vh;
.wrap{
  box-sizing: border-box;
    padding: 30/@vw;
  flex: 1;
  height: 90%;
}
#pie {
  width:100%;
  height: 100%;
}
</style>