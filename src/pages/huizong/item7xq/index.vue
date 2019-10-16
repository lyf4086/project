<template>
  <div class="wrap">
    <!-- <div id="echart" ></div> -->
    <div id="sel">
      <i class="jiao"></i>
      <i class="jiao"></i>
      <i class="jiao"></i>
      <i class="jiao"></i>
      <div class="items">
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
            v-for="(item,index) in mec"
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
        <div class="title">出勤列表</div>
        <div class="c">
          <div class="tit">
            <span>警员姓名</span>
            <span>警号</span>

            <span>持枪类型</span>
            <span>用途</span>
            <span>借出时间</span>
            <span>预计归还时间</span>
          </div>
          <div class="awrap">
            <div class="list-new" id="list-new">
              <div class="item" v-for="(item,index) in dataList" :key="index">
                <span @click="toPerson(item)">{{item.policeName}}</span>
                <span>{{item.policeNum}}</span>

                <span>{{item.gunType}}</span>
                <span>{{item.taskType}}</span>
                <span>{{item.optime}}</span>
                <span>{{item.planreturntime}}</span>
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
      date: [],
      loading:null
    };
  },
  methods: {
    toPerson(item){
    
      this.$store.commit('setPoliceId',{
        policeuser_id:item.policeid
      })
     this.$router.push({
       name:"PersonMessage"
     })
    },
    subSearch() {
      let start = this.timeStart;
      let end = this.timeEnd;
      let selmec = this.mec.filter(e => e.checked);
      let mid = selmec.map(e => e.id).join();
      let ip_id = selmec.map(e => e.ip_id).join();
      let time = start + "," + end;
      let t_mechanism_id = this.t_mechanism_id;
      if (mid != "" && start != "" && end != "") {
        this.loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.getData(t_mechanism_id, mid, ip_id, time);
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
            rotate: 60,
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
                  { offset: 0, color: "#007ce1" },
                  { offset: 1, color: "#00b782" }
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
    getData(t_mechanism_id, mid, ip_id, time) {
      let objs = {
        t_mechanism_id,
        mid,
        ip_id,
        time
      };
      // console.log(objs);
      var token = this.$gscookie.getCookie("gun");
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);
      var params = new URLSearchParams();
      params.append("sign", sign);
      params.append("token", token);
      params.append("t_mechanism_id", objs.t_mechanism_id);
      params.append("mid", objs.mid);
      params.append("ip_id", objs.ip_id);
      params.append("time", objs.time);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=Home&c=Index&a=task_lit",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.status == 200) {
            // console.log(data.data.data);
            this.dataList = data.data.data;
            this.cou = data.data.cou;
            this.date = data.data.date;
            this.initEchart();
            this.loading.close()
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created() {
    this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    let par = this.$route.params;
    if(!par.mid){
      this.$router.push({
        name:"HuiZong"
      })
      return
    }
    this.getTypes();
    let mes = this.$gscookie.getCookie("message_obj");
    this.ip_id = par.ip_id;
    this.t_mechanism_id = mes.mechanism_id;
    this.mid = par.mid;
    this.tt = par.tt;

    let timeArr = par.tt.split(",");
    this.timeStart = timeArr[0];
    this.timeEnd = timeArr[1];

    // console.log(par);
    this.getData(mes.mechanism_id, par.mid, par.ip_id, par.tt);
  },
  mounted() {
    this.move();
    this.$store.commit("setStr", {
      str1: "出勤任务",
      str2: "数据对比"
    });
    this.initEchart();
  },
  destroyed() {
    this.$store.commit("huanyuanStr");
    this.loading.close()
  }
};
</script>