<template>
  <div class="qiangmiao-content" ref="main">
    <div class="none-data" v-if="!data.length">暂时没有数据......</div>
    <div class="item_list" v-if="data.length">
      <div
        class="item_gun"
        v-for="(item,index) in data"
        :key="item.gun_id"
        ref="item"
        :class="{'dou':isRemoving}"
      >
        <input class="check" type="checkbox" v-model="item.checked" v-show="item.checked" />
        <div class="del_one" v-show="false">X</div>
        <div class="left">
          <div class="btn" title="枪支编号">
            <p>{{item.gun_code}}</p>
          </div>
          <div class="btn" title="枪支类型">{{item.gtype||"暂无"}}</div>
          <div class="btn" title="所属机构">{{item.mechanism_name}}</div>
          <div class="btn text" title="枪柜编号" @click="toXiangQing(item)">
            <p>{{item.guncabinet_code||'无'}}</p>
          </div>
        </div>
        <div class="center">
          <div class="bg"></div>
          <div class="bg2"></div>
          <div class="gun"></div>
        </div>
        <div class="right">
          <div class="btn" title="枪锁位">枪锁位：{{item.gposition || '无'}}</div>
          <div class="btn text" title="枪瞄编号">
            <p
              v-if="item.gunaiming_id!=0"
              class="jiebang"
              :title="'IMEI号为：'+item.IMEI+'，点击可解绑'"
              @click="deleteBind(item)"
            >{{item.IMEI}}</p>
            <p
              v-else="item.gunaiming_id==0"
              style="color:#3492c9;text-decoration: underline;"
              @click="bindshow(item)"
            >去绑定枪瞄</p>
          </div>
          <div class="btn" title="持枪警员，点击查看该人员详情">
            <span v-if="item.policeuser_name" @click="al3(item)">{{item.policeuser_name}}</span>
            <span v-if="!item.policeuser_name">-----</span>
          </div>
          <div
            class="btn"
            title="点击查看该枪支详情"
            @click="al4(item.gun_id)"
            style="color:#3492c9;text-decoration: underline;"
          >详情</div>
        </div>
      </div>
    </div>

    <div class="zhezhao" v-show="tan1||tan2||tan3||tan4||bindalert">
      <div class="alert alert1" v-show="tan1">
        <p v-show="false">我是枪柜名称弹窗</p>
        <button class="close" @click="close1">X</button>
      </div>
      <div class="alert alert2" v-show="tan2">
        <p v-show="false">我是枪瞄编号弹窗</p>
        <button class="close" @click="close2">X</button>
      </div>
      <div class="alert alert3" v-show="tan3">
        <p v-show="false">我是所属警员弹窗</p>
        <button class="close" @click="close3">X</button>
      </div>
      <!--
      <div class="alert alert4" v-if="tan4">
        <div class="del" @click="close4">X</div>
        <button class="close" @click="close4">取消</button>
        <div class="contentwrap">
          <div class="top"></div>
          <div class="bottom">
            <div class="down"></div>
            <div class="up"></div>
          </div>
        </div>
        <div class="text" v-if="xiangqingList.length">
          <div class="title">
            <span></span>
            <span>用枪人</span>
            <span>警员编号</span>
            <span>枪支类型</span>
            <span>借出时间</span>
            <span>归还时间</span>
            <span>用途类型</span>
          </div>
          <div class="list_wrap">
            <div class="list" v-for="(item,index) in xiangqingList" :key="index">
              <span>{{index+1}}</span>
              <span>{{item.usrename}}</span>
              <span>{{item.policeNum}}</span>
              <span>{{item.gtype}}</span>
              <span>{{item.oprtime}}</span>
              <span>{{item.planTime}}</span>
              <span>{{item.tasktype}}</span>
            </div>
          </div>
        </div>
      </div>
      -->
 <!--改写后  -->
      <div class="alert alert4" v-if="tan4">
         <div class="del" @click="close4">X</div>
        <button class="close" @click="close4">取消</button>
        <div class="content">
          <div class="t t1">机构名称:{{guns.mechanism_name}}</div>
          <div class="t t2">用枪人:{{guns.policeName}}</div>
          <div class="t t3">枪支类型:{{guns.gname}}</div>
          <div class="t t4">枪柜编号:{{guns.guncabinet_code}}</div>
          <div class="t t5">枪锁位：{{guns.gposition}}</div>
          <div class="t t6" title="枪瞄编号">{{guns.IMEI}}</div>
          <div class="t t7">枪支编号：{{guns.gun_code}}</div>
          <div class="t t8" @click="showList">历史记录</div>
          <div class="r1"></div>
          <div class="r2"></div>
        </div>
        <div class="m-list" v-show="listShow">
          <div class="text" v-if="xiangqingList.length">
            <div class="title">
              <span></span>
              <span>用枪人</span>
              <span>警员编号</span>
              <span>枪支类型</span>
              <span>借出时间</span>
              <span>归还时间</span>
              <span>用途类型</span>
            </div>
          <div class="list_wrap">
            <div class="list" v-for="(item,index) in xiangqingList" :key="index">
              <span>{{index+1}}</span>
              <span>{{item.usrename}}</span>
              <span>{{item.policeNum}}</span>
              <span>{{item.gtype}}</span>
              <span>{{item.oprtime}}</span>
              <span>{{item.planTime}}</span>
              <span>{{item.tasktype}}</span>
            </div>
          </div>
        </div>
        </div>
      </div>
 <!--改写后  -->
      <div class="bingbox" v-show="bindalert">
        <button class="close" @click="bindclose">X</button>
        <p style="display:none">{{activeJigouId}}</p>
        <input
          type="text"
          class="text"
          placeholder="请输入枪瞄ID"
          v-model="activeMiaoId"
          @input="putChange"
        />
        <div class="m-item-wrap">
          <div class="no-data" v-if="allMiaoList.length==0">该机构下暂时没有枪瞄数据</div>
          <div
            class="m-item"
            v-for="(item,index) in allMiaoList"
            :key="index"
            :style="{'opacity':item.opacity}"
          >
            <span @click="miaoSpanClick(item,index)" title="IMEI">{{item.IMEI}}</span>
          </div>
        </div>
        <button class="sub" @click="subBind">确认绑定</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import url(./content2.css);
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
    activeJigouId: {
      type: String,
      default: function() {
        return "";
      }
    },
    activeYeMa: {
      type: [String, Number],
      default: function() {
        return "";
      }
    },
    gun_xiangqing: {
      type: Array,
      default: function() {
        return [];
      }
    },
    isRemoving: {
      type: Boolean,
      default: function() {
        return false;
      }
    }
  },
  data() {
    return {
      tan1: false,
      tan2: false,
      tan3: false,
      tan4: false,
      bindalert: false,
      allMiaoList: "",
      activeGunId: "", //.........当前正要绑定的枪支id
      activeMiaoId: "",
      xiangqingList: [],
      guns:null,
      listShow:false
    };
  },
  computed: {
    allDataChecked: {
      get() {
        return this.data.length ? this.data.every(e => e.checked) : false;
      },
      set(v) {
        return this.data.forEach(e => (e.checked = v));
      }
    }
  },
  methods: {
    showList(){
      this.listShow=!this.listShow
    },
    childClick(id) {
      this.al4(id);
    },
    toXiangQing(item) {
      return;
      this.$router.push({
        name: "QiangGui",
        params: item
      });
    },
    al2() {
      this.tan2 = true;
    },
    al3(item) {
      this.$store.commit("setPoliceId", {
        policeuser_id: item.policeuser_id,
        yeMa: this.activeYeMa,
        jiGouId: this.activeJigouId
      });
      this.$router.push({
        name: "PersonMessage"
      });
    },
    al4(gun_id) {
      this.tan4 = true;
      console.log(gun_id)
      this.xiangqing(gun_id);
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
    close4() {
      this.tan4 = false;
    },
    miaoSpanClick(item, index) {
      this.activeMiaoId = item.gunaiming_id;
      this.allMiaoList.forEach(e => (e.opacity = "0.3"));
      this.allMiaoList[index].opacity = "1";
    },
    putChange(e) {
      //..........绑定枪瞄输入框输入事件

      var val = e.target.value;
      var list = this.allMiaoList;
      // console.log(list)
      this.blys(val, list);
    },
    blys(val, list) {
      var v = val;
      for (let i = 0; i < list.length; i++) {
        var ind = list[i]["gunaiming_id"].indexOf(v);
        if (ind == -1) {
          //  this.list[i]['opacity']='0.3';
          // console.log('不包含')
          this.allMiaoList[i]["opacity"] = "0.3";
        } else {
          // this.list[i]['opacity']='1';
          this.allMiaoList[i]["opacity"] = "1";
          // console.log('包含啦')
        }
      }
    },
    bindshow(item) {
      //绑定枪支函数

      // console.log(item)
      this.bindalert = true;
      this.activeGunId = item.gun_id; //.........记录挡墙要绑定的枪支

      this.getMiaoList(this.activeJigouId); //........获取所有未绑定的枪瞄
    },
    subBind() {
      //...............确认绑定枪支和枪瞄
      let gun_id = this.activeGunId;
      let miao_id = this.activeMiaoId;
      // console.log(this.allMiaoList,this.activeMiaoId)
      // return
      let bl = this.allMiaoList.find(e => e.gunaiming_id == this.activeMiaoId);
      if (!bl) {
        this.$message.error("没有该枪瞄，请重新输入");
        return;
      }
      this.bind(gun_id, miao_id);
      this.$emit("updataView"); //.....................更新视图
    },
    deleteBind(item) {
      //...............解绑
      let that = this;
      this.$confirm("确认要解除绑定吗？请三思?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          that.unbind(item.gun_id, item.gunaiming_id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消解绑"
          });
        });
      // if (!confirm("确认要解除绑定吗？请三思")) return;
      // console.log(item)
    },
    bindclose() {
      this.bindalert = false;
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
          // console.log('绑定枪支和枪瞄',data)
          if (data.data.code == 200) {
            this.$message({ message: "绑定成功", type: "success" });
            this.bindalert = false;
            this.activeMiaoId = "";
            this.$emit("updataView"); //...........通知父级更新视图
          } else {
            this.$message({
              type: "error",
              message: data.data.msg
            });
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
          // console.log('解除绑定关系',data)
          if (data.data.code == 200) {
            this.$message({ message: "解除绑定成功", type: "success" });
            this.$emit("updataView"); //...........通知父级更新视图
          }
        })
        .catch(error => {
          console.log(error);
        });
    }, //..........................解绑end
    getMiaoList(jigou_id = 1, p = 1, ps = 1000) {
      //.............................获取枪瞄列表数据函数
      var key = this.$store.state.key;
      var objs = { mechanism_id: jigou_id, p: p, ps: ps, isbind: 1 };
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("mechanism_id", objs.mechanism_id);
      params.append("p", objs.p);
      params.append("ps", objs.ps);
      params.append("isbind", objs.isbind);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=gunaiming&a=gunaimings",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          let newArr = data.data.data.list.map(e => {
            return {
              ...e,
              opacity: 1,
              checked: false
            };
          });
          this.allMiaoList = newArr; //.............返回数据之后赋值给allMiaoList
          console.log("allMiaoList", this.allMiaoList);
        })
        .catch(error => {
          console.log(error);
        });
    },
    xiangqing(gun_id) {
      var key = this.$store.state.key;
      var objs = { id: gun_id };
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("id", objs.id);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=Gun&a=gun_info",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            this.xiangqingList = data.data.history;
            this.guns=data.data.guns
            console.log(data.data.guns);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.$refs.main.addEventListener("mouseover", ev => {
        if (ev.target.className == "item_gun") {
          ev.target.firstElementChild.style.display = "block";
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
   
    
  }
  
};
</script>
