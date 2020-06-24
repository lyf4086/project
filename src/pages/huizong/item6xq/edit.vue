<template>
  <div id="home-child">
    <div class="top-sels">
      <div class="c-title">
        <div class="c-txt">全部枪支历史记录</div>
        <div class="c-btn hvr-sweep-to-right" v-if="false">
          <div class="icon"></div>对比分析
        </div>
        <div class="c-btn c-btn-back hvr-sweep-to-right" v-if="false">
          <div class="icon"></div>返回
        </div>
      </div>
      <div class="c-content c-content-2 c-content-3">
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
          <div
            class="sel2"
            :class="{checked:item.checked}"
            v-for="(item,index) in mec"
            :key="index"
            @click="jigouSelect(index)"
          >
            <div class="icon"></div>
            {{item.mechanism_name}}
          </div>
          
        </div>
      </div>
      <div class="btn-wrap" @click="subSearch">确定</div>
    </div>

    <div class="bottom-list-wrap">
      <div class="t">
        <span>机构名称</span>
        <span>持枪人员</span>
        <span>枪支编号</span>
        <span>用途</span>
        <span>借出时间</span>
        <span>预计归还时间</span>
      </div>
      <div class="l">
        <div class="i"  v-for="(item,index) in dataList" :key="index">
          <span>{{item.mechanism_name}}</span>
          <span @click="toPerson(item)">{{item.policeName}}</span>
          <span>{{item.gun_code}}</span>
          <span>{{item.taskType}}</span>
          <span>{{item.optime}}</span>
          <span>{{item.planreturntime}}</span>
        </div>
      </div>
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
      mec: [],
      ip_id: "",
      mid: "",
      tt: "",
      t_mechanism_id: "",
      timeStart: "",
      timeEnd: "",
      dataList: [],
      loading: null
    };
  },
  methods: {
    toPerson(item) {
      this.$store.commit("setPoliceId", {
        policeuser_id: item.policeid
      });
      this.$router.push({
        name: "PersonMessage"
      });
    },
    subSearch() {
       if(!this.datePicker){
            this.$message.warning('请选择时间！')
            return
        }
      
      let start = this.datePicker[0];
      let end = this.datePicker[1];
   
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });

      let selmec = this.mec.filter(e => e.checked);
      let mid = selmec.map(e => e.id).join();
      let ip_id = selmec.map(e => e.ip_id).join();
      let time = start + "," + end;
      let t_mechanism_id = this.t_mechanism_id;
      if (mid != "" && start != "" && end != "") {
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
            // console.log(111);
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
          "/weixin/project/index.php?m=Home&c=Index&a=history_info",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.status == 200) {
            console.log(data.data.data);
            this.dataList = data.data.data;
          
            this.loading.close();
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
    if (!par.mid) {
      this.$router.push({
        name: "HuiZong"
      });
      return;
    }
    let timearr = par.tt.split(",");
    this.datePicker=timearr
    this.mid = par.mid;
    this.timeStart = timearr[0];
    this.timeEnd = timearr[1];
    this.getTypes();
    this.getData(par.mid, par.mid, par.ip_id, par.tt);
  },
  mounted() {
    this.$store.commit("setStr", {
      str1: "全部枪支",
      str2: "历史记录"
    });
  },
  destroyed() {
    this.$store.commit("huanyuanStr");
    this.loading.close();
  }
};
</script>
<style lang="less" scoped>
@vw: 38.4vw;
@vh: 21.6vh;
#home-child .bottom-list-wrap {
  box-sizing: border-box;
  height: 988 / @vh;
  padding-top: 68 / @vh;
  .t {
    box-sizing: border-box;
    width: 100%;
    height: 80 / @vh;
    border: 1 / @vw solid #5588b1;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: repeat(6, 1fr);
    justify-items: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.15);
  }
  .l {
    box-sizing: border-box;
    width: 100%;
    max-height: 840 / @vh;
    overflow: auto;
    .i {
      box-sizing: border-box;
      width: 100%;
      height: 80 / @vh;
      border: 1 / @vw solid #5588b1;
      border-top: none;
      display: grid;
      grid-template-rows: 1fr;
      grid-template-columns: repeat(6, 1fr);
      justify-items: center;
      align-items: center;
    }
  }
  .l::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 2px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
  }
  .l::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(34, 8, 83, 0.5);
    background: rgba(55, 29, 126, 0.8);
  }
  .l::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(221, 213, 213, 0.6);
  }
}
</style>