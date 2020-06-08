export default function (){
    let that = this;
    let Echart1 = this.$echarts.init(document.getElementById("item6_left"));
    let option = {
      grid: {
        show: "true",
        borderWidth: "0",
        height: "79%",
        width: "74%",
        x: "20%",
        y: "8%"
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        },
        formatter: "{b0}: {c0}"
        /*formatter: function(params) {
          var result = '';
          params.forEach(function (item) {
              result += item.marker + " " + item.seriesName + " : " + item.value +"</br>";
          });
          return result;
      }*/
      },
      // backgroundColor: "#121B2C", //背景色
      xAxis: {
        show: false, //是否显示x轴
        type: "value"
      },
      yAxis: {
        type: "category",
        inverse: true, //让y轴数据逆向
        axisLabel: {
          show: true,
          textStyle: {
            color: "#666" //y轴字体颜色
          },
          formatter: function(value, index) {
            return [
              "{lg|" + (index + 1) + "}" + "{title|" + value + "} "
            ].join("\n");
          },
          //定义富文本标签
          rich: {
            lg: {
              fontWeight: "bold",
              fontSize: 12, //字体默认12
              color: "#fff",
              padding: [0, 5, 0, 0]
            },
            title: {
              color: "#fff",
              fontWeight: "lighter"
              // borderWidth: 1,
              // borderColor: '#08c'
              // textareaBorderColor: '#08c',
            }
          }
        },
        splitLine: { show: false }, //横向的线
        axisTick: { show: false }, //y轴的端点
        axisLine: { show: false }, //y轴的线
        data: that.citys
      },
      series: [
        {
          name: "数据内框",
          type: "bar",
          itemStyle: {
            normal: {
              barBorderRadius:'0 30',
              color: "#00b5eb"
            }
          },
          /*label: {
              normal: {
                  show: true,
                  position: 'right',
                  color: 'red',
                  fontSize: 14,
                  formatter: 
                  function(param) {
                      // return 'xx';
                  },
              }
          },*/
          barWidth: 20,
          data: that.numbers
        },
        {
          name: "外框",
          type: "bar",
          itemStyle: {
            normal: {
              barBorderRadius:20,
              color: "rgba(255, 255, 255, 0.14)" //rgba设置透明度0.14
            }
          },
          barGap: "-100%",
          z: 0,
          barWidth: 20,
          data: [100, 100, 100, 100, 100]
        }
      ]
    };

    Echart1.setOption(option);
    window.addEventListener('resize',() => { Echart1.resize(); });
    Echart1.on("click", function(ev) {
      let roleId = that.$store.state.role_id;
      if (roleId == 3) return;
      that.$router.push({
        name: "Item9XQ",
        params: {
          mid: that.mid,
          ip_id: that.ip_id
        }
      });
    });
}