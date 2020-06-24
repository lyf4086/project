<template>
  <div id="home-child">
    <div class="top-sels">
      <div class="c-title">
        <div class="c-txt">枪支借出各类型占比</div>
        <div class="c-btn hvr-sweep-to-right" v-if="false">
            <div class="icon"></div>
            对比分析
        </div>
        <div class="c-btn c-btn-back hvr-sweep-to-right"  v-if="false">
            <div class="icon"></div>
            返回
        </div>
      </div>
      <div class="c-content c-content-2" >
        <div class="label">查询时间</div>
        <div class="txt">
          <el-date-picker
            v-model="datePicker"
            type="daterange"
            align="right"
            id="time-picker"
            unlink-panels
            value-format="yyyy-MM-dd"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </div>
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
            出勤列表
            <div class="icon"></div>
            <div class="right-line"></div>
            <div class="bottom-line"></div>
        </div>
        <div class="c_title">
            数量统计
            <div class="icon"></div>
            <div class="right-line"></div>
            <div class="bottom-line"></div>
        </div>
        <div class="move-list">
            <div class="tit">
                <span>警员姓名</span>
                <span>枪支编号</span>
                <span>枪支类型</span>
                <span>借出时间</span>
            </div>
            <div class="move-wrap">
                <div class="list" id="list-new">
                    <div class="item"  v-for="(item,index) in dataList" :key="index">
                        <span @click="toPerson(item)">{{item.policeName}}</span>
                        <span>{{item.gun_code}}</span>
                        <span>{{item.gunType}}</span>
                        <span>{{item.optime}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div id="item8_echart_right">
            
        </div>
    </div>
    <!-- <div class="bottom-chart-one-wrap" v-if="false">
        <div id="echart_only">bottom-chart-one-wrap</div>
        <div class="duibi-text"></div>
    </div> -->
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
    toPerson(item){
    
      this.$store.commit('setPoliceId',{
        policeuser_id:item.policeid
      })
     this.$router.push({
       name:"PersonMessage"
     })
    },
    subSearch() {
        if(!this.datePicker){
            this.$message.warning('请选择时间！')
            return
        }
      
      let start = this.datePicker[0];
      let end = this.datePicker[1];
      let selmec = this.mec.filter(e => e.checked);
      if(selmec.length==0){
           this.$message.warning('请选择机构！')
            return
      }
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
      let box = document.getElementById("item8_echart_right");
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
                  { offset: 0, color: "#5298d2" },
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
          "/weixin/project/index.php?m=Home&c=Index&a=gun_lit",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.status == 200) {
            this.dataList = data.data.data;
            if(this.dataList.length==0){
              this.$message('暂无信息')
            }
            this.cou = data.data.cou;
            this.date = data.data.gname;
            this.initEchart();
            this.loading.close()
            if(data.data.data.length>10){
              this.move();
            }
            
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
    this.datePicker=timeArr
    // console.log(par);
    this.getData(mes.mechanism_id, par.mid, par.ip_id, par.tt);
  },
  mounted() {
    this.move()
    this.$store.commit("setStr", {
      str1: "枪支借出",
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
<style lang="less" scoped>
@vw:28.4vw;
@vh:21.6vh;
.tit{
  box-sizing: border-box;
  border:1/@vw solid #5583a7;
  width: 100%;
  height:60/@vh;
  display: grid;
  grid-template-columns: repeat(4,1fr);
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
    grid-template-columns: repeat(4,1fr);
    grid-template-rows: 1fr;
    justify-items: center;
    align-items: center;
  }
}
</style>