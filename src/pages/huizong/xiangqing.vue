<template>
  <div class="main">
    <span class="prev" @click="prev"></span>
    <div class="center">
      <div class="time_check">
        <span>查询时间：</span>
        <input type="date" class="s_time" v-model="s_time" />
        <span>致</span>
        <input type="date" class="e_time" v-model="e_time" />
        <button @click="chaxun">查询</button>
      </div>
      <div class="chart">
        <div id="chart"></div>
      </div>
      <div class="grid">
        <div class="title">
          <span>报警日期</span>
          <span>报警数量</span>
          <span>查看详情</span>
        </div>
        <div class="wrap" v-if="dataList.length">
          <div class="item" v-for="(item,index) in dataList" :key="index">
            <span>{{item.datetime}}</span>
            <span>{{item.number}}</span>
            <span class="more" @click="toMore(item.datetime)">查看详情</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import url(./xiangqing.css);
</style>
<script>
export default {
  data() {
    return {
      selected: "",
      echar1_names: [],
      echar_date: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      echar_num: [820, 932, 901, 934, 1290, 1330, 1320],
      list: [],
      dataList: [],
      s_time: "",
      e_time: "",
      obj: null
    };
  },
  methods: {
    prev() {
      this.$router.go(-1);
    },
    chart(arrdate, arrnum) {
      let box1 = document.getElementById("chart");
      let Echart = this.$echarts.init(box1, "macarons");

      let option = {
        title: {
          // text: "堆叠区域图"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          data: this.echar1_names
          // selected: this.selected
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: this.echar_date
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: this.list
      };
      Echart.setOption(option);
    },
    toMore(s) {
      console.log(s);
      this.$router.push({
        name: "List",
        params: { datetime: s }
      });
    },
    getData(timeStr) {
      let objs = { time: timeStr };
      var token = this.$gscookie.getCookie("gun");
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);
      var params = new URLSearchParams();
      params.append("sign", sign);
      params.append("token", token);
      params.append("time", objs.time);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=Index&a=alarm_info",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.status == 200) {
            console.log(data.data);
            this.echar_date = data.data.data.days;
            this.echar_num = data.data.data.value;
            this.echar1_names = data.data.data.mname;
            this.list = data.data.data.series;
            this.selected = data.data.data.selected;
            this.chart();
            this.dataList = data.data.list;
            console.log(data.data.data.selected);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    chaxun() {
      let start = this.s_time;
      let end = this.e_time;
      if (!start && !end) {
        this.$message({
          type: "warning",
          message: "请选择时间"
        });
      } else {
        this.getData(`${start},${end}`);
      }
    }
  },
  created() {
    let item = this.$gscookie.getCookie("message_obj");
    if (item.role_id == 3) {
      this.$router.push({
        name: "HuiZong"
      });
    }
    let obj = this.$route.params;
    this.obj = obj;
    this.getData(`${obj}`);
  },
  mounted() {}
  // activated(){
  //   if(this.obj.length){
  //      let obj=this.obj
  //     this.getData(`${obj}`)
  //   }

  // }
};
</script>
