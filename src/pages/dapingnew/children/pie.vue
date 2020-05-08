<template>
  <div class="wrap">
      <div id="pie">
   
     </div>
  </div>
</template>
<script>
export default {
  props:{
    data1:{
      type:Object,
      required:true
    }
  },
  data() {
    return {};
  },
  methods: {
    init(data) {
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
        tooltip: {
            trigger: 'item',
            formatter: " <br/>{b}: {c} ({d}%)"
        },
        series: [
          {
            type: "pie",
            data: data.data1,
            // [
            //   {
            //     name: "国内",
            //     value: 60
            //   },
            //   {
            //     name: "国外",
            //     value: 40
            //   }
            // ],
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
            data: data.data2,
            // [
            //   {
            //     name: "北京",
            //     value: 20
            //   },
            //   {
            //     name: "天津",
            //     value: 20
            //   },
            //   {
            //     name: "上海",
            //     value: 20
            //   },
            //   {
            //     name: "广州",
            //     value: 20
            //   },
            //   {
            //     name: "深圳",
            //     value: 20
            //   }
            // ],
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
  created(){

  },
  mounted(){
      setTimeout(()=>{
        this.init(this.data1)
      },100)
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
  width:300px;
  height: 100%;
}
</style>