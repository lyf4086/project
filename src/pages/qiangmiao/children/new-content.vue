<template>
  <div class="main" ref="main">
    <div class="none-data" v-if="!data.length">暂时没有数据......</div>
    <div class="item_miao" v-for="(item,index) in data" :key="item.IMEI">
      <div class="content">
        <div class="item" :title="item.IMEI" @click="showOne(item)">
          <p>{{item.IMEI}}</p>
        </div>
        <div class="item" title="枪瞄状态">{{item.heart==1 ? "在线":"不在线"}}</div>
        <div class="item" title="电量" @click="tanchuang2(item.electricity)">{{item.electricity}}%</div>
        <div class="item" title="充电状态">{{item.ischarging}}</div>
        <div class="item" title="所属警员" @click="lookPerson(item)">{{item.policeuser_name || '暂无'}}</div>
        <div class="item" title="所属机构">
          <p>{{item.mechanism_name}}</p>
        </div>
        <div class="item" title="绑定解绑">
          <span @click="tanchuang3(item)" v-if="item.gun_id==0">绑定</span>
          <span
            v-if="item.gun_id>0"
            class="jiebang"
            @click="jiebang(item)"
            style="color:red;"
            :title="item.gun_code"
          >解绑</span>
        </div>
        <div class="item" title="最后定位时间">{{item.created}}</div>
      </div>
      <input type="checkbox" id="checkbox" class="check" v-model="item.checked" />
    </div>
    <div class="zhezhao" v-show="tan1||tan2||tan3||map">
      <div class="alert1" v-show="tan1" v-if="OneMessage">
        <p>设备号码：{{OneMessage.IMEI}}</p>
        <p>创建时间：{{OneMessage.created}}</p>
        <p>所绑枪支ID：{{OneMessage.gun_id}}</p>
        <p>枪瞄ID：{{OneMessage.gunaiming_id}}</p>
        <p>所属机构：{{OneMessage.mechanism_name}}</p>
        <p>所属警员：{{OneMessage.policeuser_name || '暂无'}}</p>
        <!-- <el-button type="text" @click="open">点击打开 Message Box</el-button> -->
        <button class="close" @click="close1">X</button>
      </div>
      <div class="map_wrap" v-show="map">
        <div id="map_content"></div>
        <button class="close" @click="mapClose">取消</button>
      </div>
      <div class="alert2" v-show="tan2">
        <p v-show="false">我是电量的弹窗</p>
        <div class="fensug">
          <div class="wavenum">
            <b id="denfenjs">{{active_dianliang}}%</b>
          </div>
          <div class="waven">
            <div class="wave" style="height: 60%;">&nbsp;</div>
          </div>
        </div>
        <button class="close" @click="close2">取消</button>
      </div>
      <div class="alert3" v-show="tan3">
        <p class="t">选择要绑定的枪支</p>
        <button class="close" @click="close3">X</button>
        <input @input="putChange" class="put1" v-model.trim="xuanZhongGunId" placeholder="输入枪支ID" />
        <div class="list" ref="list">
          <div class="no-data" v-if="allGunList.length==0">该机构下暂时没有枪支信息,请前往添加</div>
          <div
            :style="{'opacity':e.opacity}"
            class="item"
            :id="key"
            v-for="e,key in allGunList"
            @click="gunListClick(e,key)"
          >
            枪支编号:{{e.gun_code}} ，类型：{{e.gtype || "无"}}
            <!-- <input type="checkbox" v-model="e.checked" /> -->
          </div>
        </div>
        <input type="submit" class="btn" @click="submitBt" value="确认绑定" />
      </div>
    </div>
  </div>
</template>
<style scoped>
@import url(./new-content.css);
</style>
<script>
export default {
  props: {
    data: {
      type: Array,
      default: function() {
        return [];
      }
    },
    allGunList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    activefujigou: {
      type: String,
      default: function() {
        return "";
      }
    },
    activeyema: {
      type: Number,
      default: function() {
        return 1;
      }
    }
  },
  data() {
    return {
      tan1: false,
      tan2: false,
      tan3: false,
      map: false,
      xuanZhongGunId: "",
      active_qiangmiao: "", //.............当前激活的枪瞄id
      OneMessage: null,
      active_dianliang: ""
    };
  },

  methods: {
    lookPerson(item) {
      if (!item.policeuser_id) {
        this.$message({
          type: "error",
          message: "暂无"
        });
        return;
      }
      this.$store.commit("setPoliceId", {
        policeuser_id: item.policeuser_id,
        yeMa: this.activeyema,
        jiGouId: this.activefujigou
      });
      this.$router.push({
        name: "PersonMessage"
      });
    },
    mapClose() {
      this.map = false;
    },
    showOne(item) {
      if (!item.longitude) {
        this.$message({
          type: "warning",
          message: "没有定位数据"
        });
        return;
      }
      this.map = true;
      this.mapInit(item);
    },
    mapInit(obj) {
      let map = new AMap.Map("map_content", {
        center: [obj.longitude, obj.latitude],
        resizeEnable: true,
        zoom: 13
      });
      var marker = new AMap.Marker({
        position: new AMap.LngLat(obj.longitude, obj.latitude), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        title: obj.policeName
      });
      map.add(marker);
      map.setFitView([...marker]);
    },
    IEMI_alert(n) {
      this.tan1 = true;
      this.tan2 = false;
      this.tan3 = false;
      this.OneMessage = this.data[n];
    },
    tanchuang2(n) {
      this.active_dianliang = n;
      this.tan1 = false;
      this.tan2 = true;
      this.tan3 = false;
    },
    tanchuang3(item) {
      //.......绑定枪瞄弹窗
      this.tan1 = false;
      this.tan2 = false;
      this.tan3 = true;
      this.active_qiangmiao = item.gunaiming_id;
    },
    close1() {
      this.tan1 = false;
    },
    close2() {
      this.tan2 = false;
    },
    close3() {
      this.tan3 = false;
    },
    putChange(e) {
      var val = e.target.value;
      var list = this.allGunList;
      this.blys(val, list);
    },
    blys(val, list) {
      var v = val;
      for (let i = 0; i < list.length; i++) {
        var ind = list[i]["gun_id"].indexOf(v);
        if (ind == -1) {
          //  this.list[i]['opacity']='0.3';
          this.allGunList[i]["opacity"] = "0.3";
        } else {
          // this.list[i]['opacity']='1';
          this.allGunList[i]["opacity"] = "1";
        }
      }
    },
    gunListClick(e, key) {
      this.allGunList.forEach(e => (e.opacity = "0.3"));
      // this.allGunList[key].checked=true
      this.xuanZhongGunId = e.gun_id;
      this.allGunList[key].opacity = "1";
    },
    submitBt() {
      // let xuanzhong=this.allGunList.filter(e=>e.checked)
      if (this.xuanZhongGunId == "") {
        this.$message("请输入要绑定的枪支ID");
        return;
      }

      this.bind(this.xuanZhongGunId, this.active_qiangmiao);
      this.xuanZhongGunId = "";
      this.active_qiangmiao = "";
    },
    jiebang(item) {
      // if (!confirm("确定要解除绑定吗？")) return;

      this.$confirm("确定要解除绑定吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.unbind(item.gun_id, item.gunaiming_id); //...............解绑枪支枪瞄
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消解绑"
          });
        });
    },
    bind(gun_id, miao_id) {
      //....................绑定枪支和枪瞄
      var key = this.$store.state.key;
      var objs = { gun_id: gun_id, gunaiming_id: miao_id };
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("gun_id", objs.gun_id);
      params.append("gunaiming_id", objs.gunaiming_id);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=gunaiming&a=bind",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            this.$message({ message: "绑定成功", type: "success" });
            this.tan3 = false;
            this.$emit("updataView");
          } else {
            this.$message({ message: "绑定失败！请重新绑定", type: "warning" });
            this.tan3 = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }, //......................绑定end
    unbind(gun_id, miao_id) {
      //....................解除绑定
      var key = this.$store.state.key;
      var objs = { gun_id: gun_id, gunaiming_id: miao_id };
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("gun_id", objs.gun_id);
      params.append("gunaiming_id", objs.gunaiming_id);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=gunaiming&a=unbind",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            this.$message({ message: "解除绑定成功", type: "success" });
            this.$emit("updataView");
          }
        })
        .catch(error => {
          console.log(error);
        });
    } //..........................解绑end
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.main.addEventListener("mouseover", ev => {
        if (ev.target.className == "item_miao") {
          ev.target.lastElementChild.style.display = "block";
          ev.target.onmouseout = function() {
            let b = $(this)[0].querySelector(".check");
            b.onmouseover = function() {
              b.style.display = "block";
            };
            if (!b.checked) {
              $(this)[0].querySelector(".check").style.display = "none";
            }
          };
        }
      });
    });
  },
  updated() {
    // console.log(this.activefujigou, this.activeyema);
  }
};
</script>
