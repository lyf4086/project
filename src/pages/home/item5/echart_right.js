export default function (){
    let that = this;
      let Echart2 = this.$echarts.init(
        document.getElementById("content5_right"),
        "macarons"
      );
      let option2 = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          x: "left",
          textStyle:{
              color:"#fff",
            fontSize:"16"
          },
          // data:['一级用枪','二级用枪','三级用枪','四级用枪','五级用枪','六级用枪']
          data: this.dataRightUp
        },
        series: [
          {
            name: "型号及数量",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            color: [
              "#63deff",
              "#57c4e3",
              "#4ba2bd",
              "#3e8aa1",
              "#4176a8",
              "#335f86"
            ],
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: false,
                textStyle: {
                  fontSize: "12",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.dataRight
          }
        ]
      };

      Echart2.setOption(option2);
      window.addEventListener('resize',() => { Echart2.resize(); });
}