<template>
  <div class="wrap">
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
          <div class="sub" v-if="false">查询</div>
        </div>
      </div>
      <div class="items">
        <div class="title">
          <span></span>
          报警类型
        </div>
        <div class="type-wrap">
          <div
            class="item"
            :class="{'selected':item.checked}"
            v-for="item,index in warnTypes"
            :key="index"
            @click="typeChange(index)"
          >
            <i></i>
            {{item.name}}
          </div>
        </div>
      </div>

      <div class="sub-wrap">
        <div class="sub" @click="subSearch">确定</div>
      </div>
    </div>
    <div class="list">
      <div class="title">
        <span>
          <i></i>人员姓名
        </span>
        <span>
          <i></i>枪支编号
        </span>
        <span>
          <i></i>所属机构
        </span>
        <span>
          <i></i>剩余电量
        </span>
        <span>
          <i></i>报警时间
          <i @click="paixu"></i>
        </span>
        <span>
          <i></i>报警类型
        </span>
        <!-- <span>历史轨迹</span> -->
      </div>
      <div class="scroll">
        <div class="item" v-for="item,index in dataList" :key="index">
          <span>{{item.policeuser_name}}</span>
          <span>{{item.gun_code}}</span>
          <span>{{item.mechanism_name}}</span>
          <span>{{item.elec}}%</span>
          <span>{{item.datetime}}</span>
          <span>{{item.type_name}}</span>
          <!-- <span>历史轨迹</span> -->
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import url(./xiangqingnew-list.css);
</style>
<script>
export default {
  data() {
    return {
      par: null,
      timeStart: "",
      timeEnd: "",
      warnTypes: [],
      dataList: [],
      showFenXi: false,
      b: true
    };
  },
  methods: {
    paixu() {
      if (this.b) {
        let list = this.dataList.sort((m, n) => m.dateStr - n.dateStr);
      } else {
        this.dataList.sort((m, n) => n.dateStr - m.dateStr);
      }
      this.b = !this.b;
    },
    subSearch() {
      let { par, timeStart, timeEnd, warnTypes } = this._data;
      let types = warnTypes
        .filter(e => e.checked)
        .map(e => e.id)
        .join();
      let timeStr = timeStart + "," + timeEnd;
      console.log(par.mechanism_id, par.ip_id, timeStr, types);
      this.getData(par.mechanism_id, par.ip_id, timeStr, types);
    },
    typeChange(index) {
      let { checked } = this.warnTypes[index];
      this.warnTypes[index].checked = !checked;
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
          "http://s.tronl.cn/weixin/project/index.php?m=Home&c=Index&a=basic",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.status == 200) {
            this.warnTypes = data.data.types.map(item => {
              return {
                ...item,
                checked: true
              };
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getData(jigou, ip_id, timeStr, types) {
      let objs = {
        mechanism_id: jigou,
        ip_id: ip_id,
        time: timeStr,
        types: types
      };
      var token = this.$gscookie.getCookie("gun");
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);
      var params = new URLSearchParams();
      params.append("sign", sign);
      params.append("token", token);
      params.append("time", objs.time);
      params.append("types", objs.types);
      params.append("mechanism_id", objs.mechanism_id);
      params.append("ip_id", objs.ip_id);
      this.$axios({
        url:
          "http://s.tronl.cn/weixin/project/index.php?m=Home&c=Index&a=alarm_infos",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.status == 200) {
            let list = !!data.data.data ? data.data.data.flat() : [];
            // console.log(this.dataList.length);
            let arr1 = list.map(item => {
              let t1 = item.datetime;
              let t2 = new Date(t1);
              let str = t2.getTime(t2);
              return {
                ...item,
                dateStr: str
              };
            });
            this.dataList = arr1;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created() {
    let str = this.$gscookie.getCookie("gun");
    if (JSON.stringify(str) == "{}") {
      this.$router.push("/loginput");
    }
    let item = this.$gscookie.getCookie("message_obj");

    if (item.role_id == 3) {
      this.$router.push({
        name: "HuiZong"
      });
    }
    this.getTypes();
    this.par = this.$route.params;
    // console.log(this.par);
    let {
      mechanism_id,
      ip_id,
      datetime,
      types,
      timeStart,
      timeEnd
    } = this.$route.params;
    this.timeStart = timeStart;
    this.timeEnd = timeEnd;
    let timestr = timeStart + "," + timeEnd;
    this.getData(mechanism_id, ip_id, timestr, types);
  },
  mounted() {
    this.$store.commit("setStr", {
      str1: "报警类型",
      str2: "趋势详情"
    });
  },
  destroyed() {
    this.$store.commit("huanyuanStr");
  }
};
</script>