<template>
  <div class="main">
    <div class="itemleft">
      <p>枪支出勤热力图</p>
      <div id="echar1" @click="chart1XQ"></div>
    </div>
    <div class="itemcenter" v-if="arr.length">
      <p>出勤TOP5</p>
      <div id="echar2">
        <h6>
          <span>地区</span>
          <!-- <span>出勤数量</span> -->
          <span>出勤数量</span>
        </h6>
        <div class="item" v-for="item,index in arr" :key="index">
          <h3>{{item.mechanism_name}}</h3>
          <!-- <h3>{{e.c}}</h3> -->
          <h3>{{item.number}}</h3>
        </div>
      </div>
    </div>
    <div class="itemright">
      <p>出入库占比情况</p>
      <div id="echar3"></div>
    </div>
  </div>
</template>
<style scoped>
@import url(./item7.css);
</style>
<script>
export default {
  data() {
    return {
      arr: [],
      leftDataArr: [
        {
          type: "bar",
          data: [1, 2, 3, 4, 3, 5, 1],
          coordinateSystem: "polar",
          name: "入套",
          stack: "a"
        },
        {
          type: "bar",
          data: [2, 4, 6, 1, 3, 2, 1],
          coordinateSystem: "polar",
          name: "离套",
          stack: "a"
        },
        {
          type: "bar",
          data: [1, 2, 3, 4, 1, 2, 5],
          coordinateSystem: "polar",
          name: "电量",
          stack: "a"
        },
        {
          type: "bar",
          data: [1, 2, 3, 4, 1, 2, 5],
          coordinateSystem: "polar",
          name: "位置",
          stack: "a"
        }
      ],
      chart3: null,
      rightData: {
        in: [320, 302, 341, 374, 390, 450, 420],
        out: [-120, -132, -101, -134, -190, -230, -290],
        time: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
      }
    };
  },
  methods: {
    chart1XQ() {
      this.$router.push({
        name: "RightBottomXQ1"
      });
    },
    char1() {
      let that = this;
      let box1 = document.getElementById("echar1");
      let Echar1 = this.$echarts.init(box1);
      let option = {
        angleAxis: {
          type: "category",
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
          z: 10
        },
        radiusAxis: {},
        polar: {},
        series: this.leftDataArr,
        legend: {
          show: true,
          data: ["入套", "离套", "电量", "位置"]
        }
      };
      Echar1.setOption(option);
      Echar1.on("click", function(ev) {
        console.log(ev);
        that.$router.push({
          name: "RightBottomXQ1"
        });
      });
    },
    char2() {
      let that = this;
      let box3 = document.getElementById("echar3");
      let Echar3 = this.$echarts.init(box3);
      let option = {
        color: ["#ec8938", "#63deff"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["入库", "出库"]
        },
        grid: {
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "value"
          }
        ],
        yAxis: [
          {
            type: "category",
            axisTick: { show: false },
            data: this.rightData.time
          }
        ],
        series: [
          {
            name: "入库",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true
              }
            },
            data: this.rightData.in
          },
          {
            name: "出库",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "left"
              }
            },
            data: this.rightData.out
          }
        ]
      };

      Echar3.setOption(option);
    },
    getDataLeft() {
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
          "/weixin/project/index.php?m=home&c=Index&a=last_week",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          let newData = data.data.data;
          this.leftDataArr.forEach((item, index) => {
            Object.assign(item, newData[index]);
          });
          this.char1();
        })
        .catch(error => {
          console.log(error);
        });
    },
    getDataCenter() {
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
          "/weixin/project/index.php?m=home&c=Index&a=out_work",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          this.arr = data.data.data;
          // console.log('center',data)
        })
        .catch(error => {
          console.log(error);
        });
    },
    getDataRight() {
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
          "/weixin/project/index.php?m=home&c=Index&a=out_device",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.status == 200) {
            let input = data.data.data.map((item, index) => {
              return item.input;
            });
            let out = data.data.data.map((item, index) => {
              return item.out;
            });
            let time = data.data.data.map((item, index) => {
              return item.time;
            });
            this.rightData.in = input;
            this.rightData.out = out;
            this.rightData.time = time;
            this.char2();
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  mounted() {
    // this.char1()
    // this.char2()
    this.getDataLeft();
    this.getDataCenter();
    this.getDataRight();
  }
};
</script>
