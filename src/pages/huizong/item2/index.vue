<template>
  <div class="main">
    <div class="prev" @click="prev"></div>
    <div class="center">
      <div class="time_check">
        <span>查询时间：</span>
        <input type="date" class="s_time" v-model="s_time" />
        <span>至</span>
        <input type="date" class="e_time" v-model="e_time" />
        <button @click="chaxun">查询</button>
      </div>
      <div class="chart">
        <div id="chart"></div>
      </div>
      <div class="grid">
        <div class="title">
          <span>报警类型</span>
          <span>数量</span>
          <span>查看详情</span>
        </div>
        <div class="wrap" v-if="dataList.length">
          <div class="item" v-for="item,index in dataList" :key="index">
            <span>{{item.name}}</span>
            <span>{{item.number}}</span>
            <span class="more" @click="toMore(item)">查看详情</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import url(../xiangqing.css);
@import url(./item2.css);
</style>
<script>
export default {
  data() {
    return {
      echar_date: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      echar_num: [820, 932, 901, 934, 1290, 1330, 1320],
      dataList: [],
      s_time: "",
      e_time: "",
      obj: null,
      echart_data: [
        { value: 335, name: "直接访问" },
        { value: 310, name: "邮件营销" },
        { value: 234, name: "联盟广告" },
        { value: 135, name: "视频广告" },
        { value: 1548, name: "搜索引擎" }
      ]
    };
  },
  methods: {
    prev() {
      this.$router.go(-1);
    },
    char2() {
      let box2 = document.getElementById("chart");
      let Echar2 = this.$echarts.init(box2);
      let option = {
        title: {
          x: "center"
        },
        // tooltip : {
        //     trigger: 'item',
        //     formatter: "{a} <br/>{b} : {c} ({d}%)"
        // },
        // legend: {
        //     orient: 'vertical',
        //     bottom: 'bottom',
        //     data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
        // },
        series: [
          {
            name: "访问来源",
            color: [
              "#63deff",
              "#57c4e3",
              "#4aa1bc",
              "#3e8aa1",
              "#34778a",
              "#284968"
            ],
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: this.echart_data,
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
    },
    toMore(item) {
      this.$router.push({
        name: "List2",
        params: this.obj
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
          "/weixin/project/index.php?m=home&c=Index&a=alarm_type_lit",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.status == 200) {
            this.echart_data = data.data.data;
            this.char2();
            this.dataList = data.data.data;
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
      }

      this.getData(`${start},${end}`);
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
    // this.getData(`${obj}`);
    this.getData();
  },
  mounted() {},
  activated() {
    if (this.obj.length) {
      let obj = this.obj;
      this.getData(`${obj}`);
    }
  }
};
</script>
