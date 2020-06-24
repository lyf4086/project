<template>
  <div id="home-child">
    <div class="top-sels">
      <div class="c-title">
        <div class="c-txt">各机构枪柜数量</div>
      </div>
      <div class="c-content c-content-only">
        <div class="label">机构名称</div>
        <div class="txt-list">
          <div class="sel2" :class="{checked:item.checked}" v-for="(item,index) in mec"
            :key="index" @click="jigouSelect(index)">
            <div class="icon"></div>{{item.mechanism_name}}
          </div>
        </div>
      </div>
      <div class="btn-wrap" @click="subSearch">
          确定
      </div>
    </div>
    <div class="bottom-chart-two-wrap">
        <div class="c_title">
            报警对比
            <div class="icon"></div>
            <div class="right-line"></div>
            <div class="bottom-line"></div>
        </div>
        <div class="c_title">
            同比增长
            <div class="icon"></div>
            <div class="right-line"></div>
            <div class="bottom-line"></div>
        </div>
       <div class="move-list">
            <div class="tit">
               <span>机构名称</span>
                <span>枪柜编号</span>
                <span>枪支编号</span>
                <span>枪支类型</span>
                <span>枪锁位</span>
            </div>
            <div class="move-wrap">
                <div class="list" id="list-new">
                    <div class="item" v-for="(item,index) in dataList" :key="index">
                        <span>{{item.mname}}</span>
                        <span>{{item.vdevSN}}</span>
                        <span>{{item.gun_code}}</span>
                        <span>{{item.type}}</span>
                        <span>{{item.gposition}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div id="item9-echart_right">rrr</div>
    </div>
 
  </div>
</template>
<script>
export default {
  data() {
    return {
      datePicker: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
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
       subSearch() {
      let selmec = this.mec.filter(e => e.checked);
      let mid = selmec.map(e => e.id).join();
      let ip_id = selmec.map(e => e.ip_id).join();

      if (mid != "") {
        this.loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
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
    //   let str = this.timeStart + "," + this.timeEnd;
    //   this.getData(str);
    },
    initEchart() {
      let that = this;
      let box = document.getElementById("item9-echart_right");
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
              let selmec = this.mec.filter(e => e.checked);
              let mid = selmec.map(e => e.id).join();
              let ip_id = selmec.map(e => e.ip_id).join();
              this.getData(mid, ip_id);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getData(mid, ip_id) {
        this.loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
        });
      let objs = {
        mid,
        ip_id
      };
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
              console.log(data)
            this.dataList = data.data.data||[];
            this.cou = data.data.cou;
            this.date = data.data.lname;
            this.initEchart();
            this.loading.close()
            this.loading=null
            this.$nextTick(()=>{
                if(this.dataList.length>13){
                    this.move();
                }
            })
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

  },
  mounted() {
    // 
    this.$store.commit("setStr", {
      str1: "枪柜详情",
      str2: "数据分析"
    });
    // this.initEchart();
  },
  destroyed() {
    this.$store.commit("huanyuanStr");
    this.loading?this.loading.close():null
  }
};
</script>
<style lang="less" scoped>
@vw:28.4vw;
@vh:21.6vh;
.tit{
  box-sizing: border-box;
  border:1/@vw solid #5583a7;
  width: 100%;
  height:60/@vh;
  display: grid;
  grid-template-columns: repeat(5,1fr);
  grid-template-rows: 1fr;
  justify-items: center;
  align-items: center;
}
.move-wrap{
  width: 100%;
  height:570/@vh;
 overflow: hidden;
}
.list{
  .item{
    color: rgb(186, 187, 184);
    box-sizing: border-box;
    border:1/@vw solid #5583a7;
    border-top: none;
    width: 100%;
    height:60/@vh;
    display: grid;
    grid-template-columns: repeat(5,1fr);
    grid-template-rows: 1fr;
    justify-items: center;
    align-items: center;
  }
}
</style>