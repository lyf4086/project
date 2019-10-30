<template>
  <div class="wrap">
    <div id="sel">
      <i class="jiao"></i>
      <i class="jiao"></i>
      <i class="jiao"></i>
      <i class="jiao"></i>
      <div class="items">
        <div class="title1">
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
        <div class="title1">
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
    <div id="content">
      <div class="title">
        <span>
          <i></i>机构名称
        </span>
        <span>
          <i></i>持枪人员
        </span>
        <span>
          <i></i>枪支编号
        </span>
        <span>
          <i></i>用途
        </span>
        <span>
          <i></i>借出时间
        </span>
        <span>
          <i></i>预计归还时间
        </span>
      </div>
      <div class="list">
        <div class="item" v-for="(item,index) in dataList" :key="index">
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
<style scoped>
@import url(./index.css);
</style>
<script>
export default {
  data() {
    return {
      mec: [],
      ip_id: "",
      mid: "",
      tt: "",
      t_mechanism_id: "",
      timeStart: "",
      timeEnd: "",
      dataList: [],
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
      if(new Date(start).getTime() >new Date(end).getTime()){
        this.$message({
          type:"error",
          message:"时间选择有误"
        })
        return 
      }
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
        // console.log(t_mechanism_id, mid, ip_id, time);
        // return;
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
            // this.cou = data.data.cou;
            // this.date = data.data.date;
            // this.initEchart();
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
    let timearr = par.tt.split(",");
    this.mid = par.mid;
    this.timeStart = timearr[0];
    this.timeEnd = timearr[1];
    this.getTypes();
    this.getData(par.mid, par.mid, par.ip_id, par.tt);
  },
  mounted() {
    this.$store.commit("setStr", {
      str1: "全国枪支",
      str2: "历史记录"
    });
  },
  destroyed() {
    this.$store.commit("huanyuanStr");
    this.loading.close()
  }
};
</script>