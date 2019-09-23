<template>
  <div class="wrap">
    <div class="itemleft">
      <p>各机构枪柜数量</p>
      <div id="char-left"></div>
    </div>
    <div class="itemcenter">
      <p>每日各类型报警数据</p>
      <div id="char-center"></div>
    </div>
    <div class="itemright">
      <div class="cover"></div>
      <p>逾期报警</p>
      <div class="dianwrap">
        <div class="line"></div>
        <div class="diandian" id="diandian">
          <div class="item">
            <span></span>
          </div>
          <div class="item">
            <span></span>
          </div>
          <div class="item">
            <span></span>
          </div>
          <div class="item">
            <span></span>
          </div>
        </div>
      </div>
      <!-- <div id="char-right" >
                <div class="line-box">
                    <ul class="line">
                        <li><span>石家庄<a>+1</a></span></li>
                        <li><span>保定<a>+1</a></span></li>
                        <li class="active"><span>霸州<a>+1</a></span></li>
                        <li><span>雄安<a>+1</a></span></li>
                        <li><span>沧州<a>+1</a></span></li>
                        <li><span>天津<a>+1</a></span></li>
                    </ul>
                    <div class="bg"></div>
                </div>
      </div>-->
      <div class="yuqi" id="wrap">
        <ul class="liebiao">
          <li class="one" v-for="(item,index) in dataList3" :key="index">
            <div>
              <span>{{item.policeName}}</span>
              <span>{{item.type}}</span>
              <h6>{{item.optime}}</h6>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import url(./item6.css);
</style>
<script>
export default {
  data() {
    return {
      citys: [],
      numbers: [],
      objArr: [],
      dataList3: [],
      mid: "",
      ip_id: "",
      chart2Names: ["数据1111", "数据2222"],
      chart2Data: [],
      chart2Day: [
        {
          name: "道路结冰",
          max: 88
        },
        {
          name: "暴雪",
          max: 88
        },
        {
          name: "暴雨",
          max: 88
        },
        {
          name: "冰雹",
          max: 88
        }
      ]
    };
  },
  methods: {
    moveDian(){
      this.$methods.listMove('#diandian')
    },
    moveing() {
      var $uList = $("#wrap .liebiao");
      var timer = null;
      //触摸清空定时器
      $uList
        .hover(
          function() {
            clearInterval(timer);
          },
          function() {
            //离开启动定时器
            timer = setInterval(function() {
              scrollList($uList);
            }, 2000);
          }
        )
        .trigger("mouseleave"); //自动触发触摸事件
      //滚动动画
      function scrollList(obj) {
        //获得当前<li>的高度
        var scrollHeight = $(".liebiao .one:first").height();
        //滚动出一个<li>的高度
        $uList.stop().animate(
          {
            marginTop: -scrollHeight
          },
          700,
          function() {
            //动画结束后，将当前<ul>marginTop置为初始值0状态，再将第一个<li>拼接到末尾。
            $uList
              .css({
                marginTop: 0
              })
              .find(".one:first")
              .appendTo($uList);
          }
        );
      }
    },
    char1() {
      // let box1=document.getElementById('char-left')
      // let Echar1=this.$echarts.init(box1)
      let that = this;
      let Echart1 = this.$echarts.init(document.getElementById("char-left"));
      let option = {
        grid: {
          show: "true",
          borderWidth: "0",
          height: "79%",
          width: "74%",
          x: "24%",
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
                barBorderRadius: 30,
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
                barBorderRadius: 20,
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
    },
    chart2() {
      let that = this;
      let box2 = document.getElementById("char-center");
      let Echart2 = this.$echarts.init(box2, true);
      // console.log(this.chart2Names, this.chart2Data, this.chart2Day);
      let ser = [
        {
          name: "入套报警",
          type: "radar",
          symbol: "circle",
          symbolSize: 10,
          areaStyle: {
            normal: {
              color: "rgba(245, 166, 35, 0.4)"
            }
          },

          itemStyle: {
            color: "rgba(245, 166, 35, 1)",
            borderColor: "rgba(245, 166, 35, 0.3)",
            borderWidth: 10
          },
          lineStyle: {
            normal: {
              type: "dashed",

              color: "rgba(245, 166, 35, 1)",
              width: 2
            }
          },
          data: [that.chart2Data[0]]
        },
        {
          name: "离套报警",
          type: "radar",
          symbol: "circle",
          symbolSize: 10,
          itemStyle: {
            normal: {
              color: "rgba(19, 173, 255, 1)",
              borderColor: "rgba(19, 173, 255, 0.4)",
              borderWidth: 10
            }
          },
          areaStyle: {
            normal: {
              color: "rgba(19, 173, 255, 0.5)"
            }
          },
          lineStyle: {
            normal: {
              color: "rgba(19, 173, 255, 1)",
              width: 2,
              type: "dashed"
            }
          },
          data: [that.chart2Data[1]]
        },
        {
          name: "区域报警",
          type: "radar",
          symbol: "circle",
          symbolSize: 10,
          itemStyle: {
            normal: {
              color: "rgba(192, 173, 255, 1)",
              borderColor: "rgba(192, 173, 255, 0.4)",
              borderWidth: 10
            }
          },
          areaStyle: {
            normal: {
              color: "rgba(192, 173, 255, 0.5)"
            }
          },
          lineStyle: {
            normal: {
              color: "rgba(192, 173, 255, 1)",
              width: 2,
              type: "dashed"
            }
          },
          data: [that.chart2Data[2]]
        },
        {
          name: "逾期报警",
          type: "radar",
          symbol: "circle",
          symbolSize: 10,
          itemStyle: {
            normal: {
              color: "rgba(19, 233, 255, 1)",
              borderColor: "rgba(19, 233, 255, 0.4)",
              borderWidth: 10
            }
          },
          areaStyle: {
            normal: {
              color: "rgba(19, 233, 255, 0.5)"
            }
          },
          lineStyle: {
            normal: {
              color: "rgba(19, 233, 255, 1)",
              width: 2,
              type: "dashed"
            }
          },
          data: [that.chart2Data[3]]
        }
      ];
      let option = {
        // backgroundColor:'black',
        normal: {
          top: 200,
          left: 300,
          width: 500,
          height: 400,
          zIndex: 6,
          backgroundColor: ""
        },
        color: ["rgba(245, 166, 35, 1)", "rgba(19, 173, 255, 1)"],
        title: {
          show: true,
          // text: "数据展示图",
          left: "40%",
          top: "1%",
          textStyle: {
            fontSize: 18,
            color: "#fff",
            fontStyle: "normal",
            fontWeight: "normal"
          }
        },
        tooltip: {
          show: false,
          trigger: "item"
        },
        legend: {
          show: true,
          icon: "circle",
          left: "0%",
          top: "93%",
          orient: "horizontal",
          textStyle: {
            fontSize: 14,
            color: "#fff"
          },
          data: ["入套报警", "离套报警", "区域报警", "逾期报警"]
        },
        radar: {
          center: ["50%", "50%"],
          radius: "70%",
          startAngle: 90,
          splitNumber: 4,
          shape: "circle",
          splitArea: {
            areaStyle: {
              color: ["transparent"]
            }
          },
          axisLabel: {
            show: false,
            fontSize: 18,
            color: "#fff",
            fontStyle: "normal",
            fontWeight: "normal"
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#fff" //
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#fff" //
            }
          },
          indicator: that.chart2Day
        },
        series: ser
      };

      Echart2.setOption(option);
    },
    getDataOne() {
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
          "/weixin/project/index.php?m=home&c=Index&a=gun_device",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          this.citys = data.data.mname;
          console.log(data);
          this.mid = data.data.mid;
          this.ip_id = data.data.ip_id;
          this.numbers = data.data.number;
          this.char1();
        })
        .catch(error => {
          console.log(error);
        });
    },
    getDataTwo() {
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
          "/weixin/project/index.php?m=home&c=Index&a=days_alarm",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          // console.log(data);
          this.chart2Names = data.data.tname;
          this.chart2Day = data.data.date.map(item => {
            return {
              name: item
            };
          });
          this.chart2Data = data.data.cou;
          this.chart2();
        })
        .catch(error => {
          console.log(error);
        });
    },
    getDataThree() {
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
          "/weixin/project/index.php?m=home&c=Index&a=early",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.status == 200) {
            this.dataList3 = data.data.data;
          }
          // console.log('逾期',data)
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  mounted() {
    this.char1();
    // this.chart2();
    this.getDataOne();
    this.getDataTwo();
    this.getDataThree();
    this.moveing();
    this.moveDian()
  }
};
</script>
