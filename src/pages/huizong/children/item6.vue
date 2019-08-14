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
      <p>逾期报警</p>
      <div class="diandian">
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
          <li class="one" v-for="item,index in dataList3" :key="index">
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
      dataList3: []
    };
  },
  methods: {
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
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },
        toolbox: {
          feature: {
            dataView: { show: false, readOnly: false },
            magicType: { show: false, type: ["line", "bar"] },
            restore: { show: false },
            saveAsImage: { show: false }
          }
        },
        legend: {
          data: ["报警", "正常", "总量"]
        },
        xAxis: [
          {
            type: "category",
            data: this.citys,
            // data: ["11", "22", "33", "44", "55"],
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "",
            min: 0,
            max: 30,
            interval: 50,
            axisLabel: {
              formatter: " "
            }
          },
          {
            type: "value",
            name: "",
            min: 0,
            max: 10,
            interval: 5,
            axisLabel: {
              formatter: ""
            }
          }
        ],
        // series: this.objArr
        series: [
          {
            name: "数量",
            type: "bar",
            color: "#5dceec",
            data: this.numbers
          }
        ]
      };
      Echart1.setOption(option);
      Echart1.on("click", function(ev) {
        let roleId = that.$store.state.role_id;
        if (roleId == 3) return;
        that.$router.push({
          name: "Pub",
          params: {
            source: "item9",
            time: "",
            orgId: ev.name
          }
        });
      });
    },
    chart2() {
      let box2 = document.getElementById("char-center");
      let Echart2 = this.$echarts.init(box2);
      let option = {
        title: {
          text: "各类型报警数据",
          subtext: "汇总",
          top: 10,
          left: 10
        },
        tooltip: {
          trigger: "item",
          backgroundColor: "rgba(0,0,250,0.2)"
        },
        legend: {
          type: "scroll",
          bottom: 10,
          data: (function() {
            var list = [];
            for (var i = 1; i <= 28; i++) {
              list.push(i + 2000 + "");
            }
            return list;
          })()
        },
        visualMap: {
          top: "middle",
          right: 10,
          color: ["red", "yellow"],
          calculable: true
        },
        radar: {
          indicator: [
            { text: "离套", max: 400 },
            { text: "入套", max: 400 },
            { text: "电量", max: 600 },
            { text: "位置", max: 300 },
            { text: "未知", max: 500 }
          ]
        },
        series: (function() {
          var series = [];
          for (var i = 1; i <= 28; i++) {
            series.push({
              name: "报警类型",
              type: "radar",
              symbol: "none",
              lineStyle: {
                width: 1
              },
              emphasis: {
                areaStyle: {
                  color: "rgba(0,250,0,0.3)"
                }
              },
              data: [
                {
                  value: [
                    (40 - i) * 10,
                    (38 - i) * 4 + 60,
                    i * 5 + 10,
                    i * 9,
                    (i * i) / 2
                  ],
                  name: i + 2000 + ""
                }
              ]
            });
          }
          return series;
        })()
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
          "http://s.tronl.cn/weixin/project/index.php?m=home&c=Index&a=gun_device",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          this.citys = data.data.mname;
          // console.log(this.citys);
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
          "http://s.tronl.cn/weixin/project/index.php?m=home&c=Index&a=days_alarm",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          console.log(data);
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
          "http://s.tronl.cn/weixin/project/index.php?m=home&c=Index&a=early",
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
    this.chart2();
    this.getDataOne();
    this.getDataTwo();
    this.getDataThree();
    this.moveing();
  }
};
</script>
