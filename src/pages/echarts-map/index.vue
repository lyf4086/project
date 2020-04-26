<template>
  <div class="wrap">
    <div id="echarts-map"></div>
    <div id="charts"></div>
  </div>
</template>
<style scoped>
@import url(./index.css);
</style>
<script>
export default {
  data() {
    return {
      myChart: null
    };
  },
  methods: {
    initMap() {
        let that=this
      var jiangsu = {
        name: "江苏省",
        link: './jiangsu.json',
        children: {
          宿迁市: require('./suqian.json'),
          泰州市: require('./taizhou.json'),
          镇江市: require('./zhenjiang.json'),
          扬州市: require('./yangzhou.json'),
          盐城市: require('./yancheng.json'),
          淮安市: require('./ha.json'),
          连云港市: require('./lianyungang.json'),
          南通市: require('./nantong.json'),
          苏州市: require('./suzhou.json'),
          常州市: require('./changzhou.json'),
          徐州市: require('./xuzhou.json'),
          无锡市: require('./wuxi.json'),
          南京市:require('./nanjing.json')
        }
      };
        let geoJson=require('./jiangsu.json');
    //   $.getJSON('jiangsu.link', function(geoJson) {
          
        this.$echarts.registerMap("jiangsu", geoJson);
        console.log("geoJson", geoJson);

        let data = [];
        geoJson.features.map(v => {
          data.push({
            name: v.properties.name,
            value: v.properties.cp
          });
        });

        // console.log("data : ", data);
        let box = document.getElementById("charts");
        this.myChart = this.$echarts.init(box);
        let option = {
          backgroundColor: 'transparent',
          title: {
            text: "中国地图",
            textStyle: {
              color: "#fff"
            }
          },
          animationDuration: 1000,
          animationEasing: "cubicOut",
          animationDurationUpdate: 1000,
          series: [
            {
              name: "江苏省地图",
              width: "40%",
              left: 20,
              top: "center",
              type: "map",
              mapType: "jiangsu", // 自定义扩展图表类型
              data: data,
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    color: "#fff"
                  },
                  areaColor: "rgb(19, 91, 153)",
                  borderColor: "rgb(9, 54, 95)"
                },
                emphasis: {
                  label: {
                    color: "#80c4ff"
                  },
                  areaColor: "rgb(10, 105, 187)"
                }
              }
            }
          ]
        };

        this.myChart.setOption(option);
        // loadMap("南京市");
    //   });

      this.myChart.on("click", function(params) {
        console.log("params : ", params);
        if (params.seriesIndex === 0) {
          loadMap(params.name);
        } else {
          //
        }
      });

      function loadMap(name) {
        // $.getJSON(jiangsu.children[name], function(geoJson) {
            console.log(name)
            that.$message(`${name}`)
        let geoJson=jiangsu.children[name]
          that.$echarts.registerMap(name, geoJson);
          let data = [];
          geoJson.features.map(v => {
            data.push({
              name: v.properties.name,
              value: v.properties.cp
            });
          });

          option.series[1] = {
            name: name,
            width: "40%",
            top: "center",
            left: "55%",
            type: "map",
            mapType: name, // 自定义扩展图表类型
            data: data,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  color: "#fff"
                },
                areaColor: "rgb(19, 91, 153)",
                borderColor: "rgb(9, 54, 95)"
              },
              emphasis: {
                label: {
                  color: "#80c4ff"
                },
                areaColor: "rgb(10, 105, 187)"
              }
            }
          };

          that.myChart.setOption(option);
        // });
      }
    }
  },
  mounted() {
    this.initMap();
  }
};
</script>