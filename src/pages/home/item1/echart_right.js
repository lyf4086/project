export default function (){
    let box2 = document.getElementById("content_right");
      let Echar2 = this.$echarts.init(box2);
      let option = {
        title: {
          x: "center"
        },
        // tooltip: {
        //   trigger: "item",
        //   formatter: "{a} <br/>{b} : {c} ({d}%)"
        // },
        legend: {
          orient: "vertical",
          bottom: "bottom",
          data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"]
        },
        series: [
          {
            name: "访问来源",
            color: [
              "#63deff",
              "#1dacd3",
              "#4aa1bc",
              "#3e8aa1",
              "#34778a",
              "#284968"
            ],
            label: {
              normal: {
                show: true,
                color: "#fff",
                position: "outter",
                formatter: function(parms) {
                  return parms.data.legendname;
                }
              }
            },
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: this.echart2_data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };

      Echar2.setOption(option);
      window.addEventListener('resize',() => { Echar2.resize(); });
}