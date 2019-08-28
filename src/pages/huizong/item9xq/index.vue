<template>
  <div class="wrap">
    <!-- <div id="echart" ></div> -->
    <div id="sel">
      <i class="jiao"></i>
      <i class="jiao"></i>
      <i class="jiao"></i>
      <i class="jiao"></i>
      <div class="items" v-if="false">
        <div class="title">
          <span></span>
          查询时间
        </div>
        <div class="sel-wrap">
          查询时间：
          <input type="date" v-model="timeStart" />
          至
          <input type="date" v-model="timeEnd" />
          <div class="sub" @click="sub" v-if="false">查询</div>
        </div>
      </div>
      <div class="items">
        <div class="title">
          <span></span>
          机构名称
        </div>
        <div class="jg-wrap">
          <div
            class="item"
            :class="{selected:item.checked}"
            v-for="item,index in mec"
            :key="index"
            @click="jigouSelect(index)"
          >
            <i></i>
            {{item.mechanism_name}}
          </div>
        </div>
      </div>
      <div class="sub-wrap">
        <div class="sub" @click="subSearch">确定</div>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <div class="title">枪支列表</div>
        <div class="c">
          <div class="tit">
            <span>机构名称</span>
            <span>枪柜编号</span>
            <span>枪支编号</span>
            <span>枪支类型</span>
            <span>枪锁位</span>
          </div>
          <div class="awrap">
            <div class="list-new" id="list-new">
              <div class="item" v-for="item,index in dataList" :key="index">
                <span>{{item.mname}}</span>
                <span>{{item.vdevSN}}</span>
                <span>{{item.gun_code}}</span>

                <span>{{item.type}}</span>
                <span>{{item.gposition}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="title">数量统计</div>
        <div id="chart2"></div>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import url(./index.css);
</style>
<script>
export default {
  data() {
    return {
      ip_id: "",
      mid: "",
      tt: "",
      t_mechanism_id: "",
      timeStart: "",
      timeEnd: "",
      dataList: [],
      mec: [],
      cou: [],
      date: []
    };
  },
  methods: {
    subSearch() {
      let selmec = this.mec.filter(e => e.checked);
      let mid = selmec.map(e => e.id).join();
      let ip_id = selmec.map(e => e.ip_id).join();

      if (mid != "") {
        this.getData(mid, ip_id);
      } else {
        this.$message({
          type: "warning",
          message: "信息不全"
        });
      }
    },
    jigouSelect(index) {
      this.mec[index].checked = !this.mec[index].checked;
    },
    move() {
      var $uList = $("#list-new");
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
            }, 2600);
          }
        )
        .trigger("mouseleave"); //自动触发触摸事件
      //滚动动画
      function scrollList(obj) {
        //获得当前<li>的高度
        var scrollHeight = $("#list-new .item:first").height();
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
              .find(".item:first")
              .appendTo($uList);
          }
        );
      }
    },
    sub() {
      let str = this.timeStart + "," + this.timeEnd;
      this.getData(str);
    },
    initEchart() {
      let that = this;
      let box = document.getElementById("chart2");
      let Echart = this.$echarts.init(box);
      let res = {
        xAxisData: this.date,
        seriesData: this.cou
      };
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function(params) {
            var tar = params[0];
            return tar.name + " : " + tar.value + tar.seriesName;
          }
        },
        grid: {
          left: "1%",
          right: "2%",
          bottom: "1%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          splitLine: { show: false },
          axisLabel: {
            interval: 0,
            rotate: 40,
            textStyle: {
              color: "#fff"
            }
          },
          data: res.xAxisData
        },
        yAxis: {
          name: "",
          type: "value",
          axisLabel: {
            interval: 0,
            rotate: 0,
            textStyle: {
              color: "#fff"
            }
          }
        },
        series: [
          {
            name: "",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                color: "#fff",
                show: true,
                position: "top"
              }
            },
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#00feff"
                  },
                  {
                    offset: 0.5,
                    color: "#027eff"
                  },
                  {
                    offset: 1,
                    color: "#0286ff"
                  }
                ])
              }
            },
            data: res.seriesData
          }
        ]
      };

      Echart.setOption(option);
    },
    initEchartRight() {
      let that = this;
      let box = document.getElementById("chart2");
      let Echart = this.$echarts.init(box);

      Echart.setOption(option);
    },
    getTypes() {
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
          "/weixin/project/index.php?m=Home&c=Index&a=basic",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.status == 200) {
            // console.log(data);
            this.mec = data.data.mec.map((item, index) => {
              if (index == 0) {
                return {
                  ...item,
                  checked: true
                };
              } else {
                return {
                  ...item,
                  checked: false
                };
              }
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getData(mid, ip_id) {
      let objs = {
        mid,
        ip_id
      };
      console.log(objs);
      var token = this.$gscookie.getCookie("gun");
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);
      var params = new URLSearchParams();
      params.append("sign", sign);
      params.append("token", token);
      params.append("mid", objs.mid);
      params.append("ip_id", objs.ip_id);

      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=Home&c=Index&a=device_lit",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.status == 200) {
            console.log(data);
            this.dataList = data.data.data;
            this.cou = data.data.cou;
            this.date = data.data.lname;
            this.initEchart();
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created() {
    this.getTypes();
    let par = this.$route.params;
    let mes = this.$gscookie.getCookie("message_obj");
    this.ip_id = par.ip_id;
    this.mid = par.mid;

    this.getData(par.mid, par.ip_id);
  },
  mounted() {
    this.move();
    this.$store.commit("setStr", {
      str1: "枪柜详情",
      str2: "数据分析"
    });
    this.initEchart();
  },
  destroyed() {
    this.$store.commit("huanyuanStr");
  }
};
</script>