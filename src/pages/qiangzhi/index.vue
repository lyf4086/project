<template>
  <div class="jigou" v-if="hasData">
    <div class="tree-menu">
      <h3>枪支管理</h3>
      <div class="nav-wrap">
        <el-tree
          :data="treeData"
          :props="defaultProps"
          accordion
          :highlight-current="true"
          node-key="id"
          :current-node-key="currentNodeKey"
          @node-click="handleNodeClick"
          :default-expanded-keys="zhankai"
        ></el-tree>
      </div>
    </div>
    <div class="top-nav">
      <div class="bread-wrap">
        <!--面包屑导航-->
        <breadNav title="枪支管理" :next="active_title" />
      </div>
      <div class="search-wrap">
        <!--搜索框-->
        <select class="sel" v-model="selValue">
          <option value disabled selected>请选择搜索类型</option>
          <option value="gun_code">枪支编号</option>
          <option value="policeuser_id">持枪人</option>
        </select>
        <input
          type="text"
          class="textput"
          v-model="putValue"
          @keyup.13="subSearch"
          placeholder="请输入搜素关键字"
        />
        <button class="sub" @click="subSearch"></button>
      </div>
    </div>
    <div class="page-index" v-show="pageTotal">
      <el-pagination
        :page-size="keshihua?9:19"
        :pager-count="9"
        layout="total,prev, pager, next"
        :current-page="currentPage"
        @current-change="currentChange"
        :total="pageTotal"
        ref="page"
      ></el-pagination>
    </div>
    <div class="message-box" v-show="false">
      <p>当前显示 *** {{active_title}} *** 下的枪支信息</p>
    </div>
    <div class="add-del" v-show="active_title" v-if="sync !=1">
      <button @click="addGun">添加枪支</button>
      <button @click="deleteGun">删除枪支</button>
      <button @click="modify">修改枪支</button>
    </div>
    <div class="content" v-show="keshihua">
      <Content
        :data="activeDataList"
        :activeJigouId="activeJiGouId"
        @updataView="updataView"
        :isRemoving="isRemoving"
        ref="myChild"
        :activeYeMa="active_yema"
      />
    </div>
    <div class="change_type">
      <button title="可视化" :class="{'active':keshihua}" @click="changeShowType(1)"></button>
      <button title="列表" :class="{'active':!keshihua}" @click="changeShowType(2)"></button>
    </div>
    <div class="content2" v-show="!keshihua">
      <div class="none-data" v-if="!activeDataList.length">暂时没有数据</div>
      <!-- <div class="item" v-for="(item,index) in activeDataList" :key="index">
        <input type="checkbox"  v-model="item.checked">
        <span><i>枪支编号:</i>{{item.gun_code}}</span>
        <span><i>枪支类型：</i>{{item.gtype||"暂无"}}</span>
        <span><i>所属机构：</i>{{item.mechanism_name}}</span>
        <span><i>枪柜编号：</i>{{item.guncabinet_code||'无'}}</span>
        <span><i>枪锁位：</i>{{item.gposition || '无'}}</span>
        <span><i>枪瞄编号：</i>{{item.jm}}</span>
        <span><i>持枪警员：</i>{{item.policeuser_name ||"暂无"}}</span>
      </div>-->
      <div class="list-title" v-show="activeDataList.length">
        <input type="checkbox" v-model="checkAll" />
        <span>枪支编号</span>
        <span>枪支类型</span>
        <span>所属机构</span>
        <span>枪柜编号</span>
        <span>枪锁位</span>
        <span>枪瞄编号</span>
        <span>持枪警员</span>
        <span>绑定/解绑</span>
        <span>详情</span>
      </div>
      <div class="list-item" v-for="(item,index) in activeDataList" :key="index">
        <input type="checkbox" v-model="item.checked" />
        <span>{{item.gun_code}}</span>
        <span>{{item.gtype||"暂无"}}</span>
        <span>{{item.mechanism_name}}</span>
        <span>{{item.guncabinet_code||'无'}}</span>
        <span>{{item.gposition || '无'}}</span>
        <span>{{item.IMEI}}</span>
        <span @click="toPersonMessage(item)" style="cursor:pointer">{{item.policeuser_name ||"暂无"}}</span>
        <span v-if="!item.IMEI" style="cursor:pointer" @click="bangding(item)">绑定</span>
        <span v-if="item.IMEI" style="color:red;cursor:pointer" @click="jiebang(item)">解绑</span>
        <span style="cursor:pointer;text-decoration:underline" @click="showXiangQing(item)">详情</span>
      </div>
    </div>
    <div class="alert" v-show="alert||xiugai">
      <div class="text-wrap" v-show="alert">
        <div class="text-title">新增枪支</div>
        <div class="text-content">
          <div>
            枪支编号：
            <input type="text" v-model="add_gun.gun_type" />
          </div>
          <div>
            枪支类型：
            <!--<input type="text" v-model="add_gun.gun_number"/>-->
            <select v-model="add_gun.gun_number" v-html="optionStr">
              <!-- <option value="1">92式</option>
              <option value="2">95式</option>
              <option value="3">77式</option>
              <option value="4">64式</option>
              <option value="5">92改</option>-->
            </select>
          </div>
          <div>
            所属警员：
            <input
              type="text"
              v-model="checkPerson"
              @focus="putFocus"
              @blur="putBlur"
              placeholder="请输入警员ID"
            />
            <div class="check-person" v-show="noCheckPerson">
              <p v-if="!allPersonList.length" style="text-align:center">该机构下暂无警员</p>
              <div
                class="p-item"
                @click="onePersonClick(item)"
                v-for="(item,index) in allPersonList"
                :key="index"
              >{{item.policeuser_name}}，&nbsp;&nbsp;警员ID：{{item.policeuser_id}}</div>
            </div>
          </div>
        </div>
        <div class="submit" @click="subAddGun">确认</div>
        <i @click="del">X</i>
      </div>
      <div class="xiugai" v-show="xiugai" v-if="xiugaiData">
        <button class="del" @click="xiugai=false">X</button>
        <div class="change-type">
          <span>原信息</span>
          <span>修改信息</span>
        </div>
        <div class="change-type">
          <span>枪支类型：{{xiugaiData.gtype}}</span>
          <select class="sel-type" v-model="changedGtype" v-html="optionStr" @change="change11">
            <!-- <option value="1">92式</option>
            <option value="2">95式</option>
            <option value="3">77式</option>
            <option value="4">64式</option>
            <option value="5">92改</option>-->
          </select>
        </div>
        <div class="change-type">
          <span>枪支编号：{{xiugaiData.gun_code}}</span>
          <input type="text" v-model="changedCode" />
        </div>

        <button class="sub-wrap" @click="subChange">确认修改</button>
      </div>
      <!--  <div class="bingbox" v-show="bindalert">
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
      </div>-->
    </div>
    <!-- 详情弹窗 -->
    <div class="cover" v-if="tan4">
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
          <div class="r2">
              <img class="r2Type" :src="urlBase+guns.src" alt="">
          </div>
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
      
    </div>
    <div class="bind-cover" v-if="bindalert">
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
@import url(./index.css);
</style>
<script>
import LeftNav from "@/components/leftnav";
import Content from "./children/content";
import breadNav from "@/components/breadnav";
import { setTimeout } from "timers";
export default {
  components: { LeftNav, Content, breadNav },
  data() {
    return {
      urlBase:this.$store.state.baseURL,
      activeGunId: "",
      bindalert: false,
      activeMiaoId: "",
      activeJigouId: "",
      allMiaoList: [],
      hasData: false,
      alert: false,
      treeData: "",
      xiugai: false,
      xiugaiData: null, //....即将要修改的这条数据
      changedGtype: "", //..修改后的枪支类型
      changedCode: "", //.....修改后的枪支编号
      active_jigou: "", //当前显示哪个机构的数据
      activeJiGouId: "",
      currentNodeKey: "",
      active_title: "", //当前显示谁的数据
      activeDataList: [], //当前显示的数据
      defaultProps: {
        children: "child",
        label: "mechanism_name"
      },
      add_gun: {
        gun_type: "",
        gun_number: ""
      },
      optionStr: "",
      selValue: "",
      putValue: "",
      pageTotal: null, //........页码总数
      active_yema: "", //..........记录当前是第几页数据
      currentPage: 1,
      checkPerson: "", //.........新增枪支被选中的人员拼接字符串
      checkedPersonData: "", //.........新增枪支被选中的人员整条数据
      noCheckPerson: false,
      allPersonList: "",
      isRemoving: false,
      sync: 0, //判断动静态，默认静态
      keshihua: "",
      loading: null,
      zhankai: [],
      tan4: false,
      listShow: false,
      xiangqingList: [1, 2]
    };
  },
  computed: {
    checkAll: {
      get() {
        return this.activeDataList.every(e => e.checked);
      },
      set(b) {
        return this.activeDataList.forEach(e => (e.checked = b));
      }
    }
  },
  methods: {
    showXiangQing(item) {
      this.xiangqing(item.gun_id);
    },
    close4() {
      this.tan4 = false;
      this.listShow = false;
    },
    showList() {
      this.listShow = !this.listShow;
    },
    toPersonMessage(item) {
      if (!item.policeuser_id) return;
      this.$store.commit("setPoliceId", {
        policeuser_id: item.policeuser_id,
        yeMa: this.active_yema || 1,
        jiGouId: this.activeJiGouId
      });
      this.$router.push({
        name: "PersonMessage"
      });
    },
    bindclose() {
      this.bindalert = false;
      this.allMiaoList.forEach(e => (e.opacity = "0.3"));
    },
    subBind() {
      //...............确认绑定枪支和枪瞄
      let gun_id = this.activeGunId;
      let miao_id = this.activeMiaoId;
      let bl = this.allMiaoList.find(e => e.gunaiming_id == this.activeMiaoId);
      if (!bl) {
        this.$message.error("没有该枪瞄，请重新输入");
        return;
      }
      this.bind(gun_id, miao_id);
      setTimeout(() => {
        this.updataView();
        this.bindalert = false;
        this.getMiaoList(this.activeJiGouId);
      }, 1000);
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
            this.guns = data.data.guns;
            this.tan4 = true;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    bangding(item) {
      this.activeGunId = item.gun_id;
      this.bindalert = true;
      this.getMiaoList(this.activeJiGouId);
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
      this.blys(val, list);
    },
    blys(val, list) {
      var v = val;
      for (let i = 0; i < list.length; i++) {
        var ind = list[i]["gunaiming_id"].indexOf(v);
        if (ind == -1) {
          this.allMiaoList[i]["opacity"] = "0.3";
        } else {
          this.allMiaoList[i]["opacity"] = "1";
        }
      }
    },
    jiebang(item) {
      let that = this;
      this.$confirm("您正在解除绑定关系, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          that.unbind(item.gun_id, item.gunaiming_id);
          that.updataView();
          that.getMiaoList(that.activeJiGouId);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消解绑"
          });
        });
    },
    changeShowType(n) {
      this.activeDataList = [];
      if (n === 1) {
        this.keshihua = true;
      } else {
        this.keshihua = false;
      }
      localStorage.setItem("setKeShiHua", this.keshihua);
      this.getDataList(this.activeJiGouId, 1);
      this.$refs.page.internalCurrentPage = 1;
    },
    change11(e) {},
    putFocus() {
      this.noCheckPerson = true;
    },
    putBlur() {
      let that = this;
      setTimeout(function() {
        that.noCheckPerson = false;
      }, 200);
    },
    onePersonClick(item) {
      this.checkPerson = `名字：${item.policeuser_name} , 警员ID：${item.policeuser_id}`;
      this.checkedPersonData = item; //..................被选中的这条数据
    },
    updataView() {
      //..............更新视图
      this.getDataList(this.active_jigou.mechanism_id, this.active_yema);
    },
    currentChange(n) {
      //..........页码点击
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.activeDataList = [];
      this.active_yema = n;
      this.getDataList(this.activeJiGouId, n);
    },
    subSearch() {
      if (!this.selValue) {
        this.$message({ message: "请选择搜索条件", type: "error" });
        return;
      } else if (!this.putValue) {
        this.$message.error("请输入您要搜索的内容");
        return;
      }
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.search(1, this.putValue);
    },
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
        })
        .catch(error => {
          console.log(error);
        });
    },
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
          }
        })
        .catch(error => {
          console.log(error);
        });
    }, //..........................解绑end
    getOptionStr() {
      var objs = {};
      var token = this.$gscookie.getCookie("gun");
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);
      var params = new URLSearchParams();
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=gun&a=gun_type",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          let str = data.data.gtype.map(item => {
            return `<option value=${item.id}>${item.type_name}</option>`;
          });
          this.optionStr = str;
        })
        .catch(error => {
          console.log(error);
        });
    },
    search(n = 1, val = "", state = false, gun_id) {
      var objs = {
        p: n,
        ps: "6"
      };
      var token = this.$gscookie.getCookie("gun");
      let name_code = this.selValue;
      objs[name_code] = val;
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);
      var params = new URLSearchParams();
      params.append("p", objs.p);
      params.append("ps", objs.ps);
      params.append(name_code, objs[name_code]);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=search&a=guns",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200 && data.data.data.length != 0) {
            this.activeDataList = data.data.data.list;

            if (state) {
              //...判断是否从其他页面跳转过来的
              this.$refs.myChild.childClick(gun_id);
            }
          }
          this.selValue = "";
          this.putValue = "";
          this.pageTotal = null;
          this.loading.close();
        })
        .catch(error => {
          console.log(error);
        });
    },
    modify() {
      //......................修改枪支,选出修改要修改的数据
      let modifyArr = this.activeDataList.filter(e => e.checked);
      if (modifyArr.length == 0) {
        this.$message("请选择要修改的枪支");
        return;
      } else if (modifyArr.length > 1) {
        this.$message({
          message: "一次只能修改一条数据",
          type: "warning"
        });
        return;
      }
      this.xiugai = true;
      this.xiugaiData = modifyArr[0];
    },
    subChange() {
      //.......................确定修改枪支信息
      let t = this.changedGtype ? this.changedGtype : this.xiugaiData.gtype;
      let c = this.changedCode || this.xiugaiData.gun_code;
      let id = this.active_jigou.mechanism_id;
      var key = this.$store.state.key;
      var objs = {
        mechanism_id: id,
        gun_id: this.xiugaiData.gun_id,
        gun_code: c,
        gtype: t
      };

      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("mechanism_id", objs.mechanism_id);
      params.append("gun_id", objs.gun_id);
      params.append("gun_code", objs.gun_code);
      params.append("gtype", objs.gtype);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=gun&a=rewrite",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            let text1 = t;

            this.$message({ message: "修改枪支成功", type: "success" });
            this.xiugai = false;
            // this.activeDataList.forEach(e => {
            //   if (e.gun_id == this.xiugaiData.gun_id) {
            //     e.checked = false;
            //     e.gtype = text1;
            //     e.gun_code = c;
            //   }
            // });
            this.getDataList(this.active_jigou.mechanism_id, this.active_yema); //...........更新视图
            this.changedGtype = "";
            this.changedCode = "";
          }
          if (data.data.code == 402) {
            this.$message({
              message: data.data.msg,
              type: "error"
            });
            return;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    addGun() {
      //.....这里要获取该机构下了警员信息
      this.alert = true;
      var key = this.$store.state.key;
      var objs = {
        mechanism_id: this.active_jigou.mechanism_id,
        p: 1,
        ps: 666666
      };
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("p", objs.p);
      params.append("ps", objs.ps);
      params.append("mechanism_id", objs.mechanism_id);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=policeuser&a=policeusers",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          this.allPersonList = data.data.data.list;
        })
        .catch(error => {
          console.log(error);
        });
    },
    subAddGun() {
      //.............确定添加枪支
      let t1 = this.add_gun.gun_type;
      let t2 = this.add_gun.gun_number;
      let ownP = this.checkedPersonData.policeuser_id || ""; //........所属警员ID，可能为空
      let ownN = this.checkedPersonData.policeuser_name || ""; //..........所属警员名字
      let id = this.active_jigou.mechanism_id;
      if (!t1 || !t2.trim()) {
        this.$message.error("有未填选项");
        return;
      }

      this.addData(id, t1, t2, ownP, ownN); //..........添加数据
      this.getDataList(id, this.active_yema); //..............更新视图
      this.add_gun.gun_type = this.add_gun.gun_number = "";
    },
    deleteGun() {
      //.............删除枪支
      let has = this.activeDataList.some(e => e.checked);
      if (!has) {
        this.$message.error("请选择需要删除的选项");
        return;
      }
      this.$confirm("确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let idStr = this.activeDataList
            .filter(e => e.checked)
            .map(e => e.gun_id)
            .join(",");

          this.deleteData(idStr);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    del() {
      this.alert = false;
    },
    handleNodeClick(item) {
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.activeDataList = [];
      this.$refs.page.internalCurrentPage = 1;
      this.currentNodeKey = item.mechanism_id;
      this.active_jigou = item;
      this.activeJiGouId = item.mechanism_id;
      this.active_title = item.mechanism_name;
      this.getDataList(item.mechanism_id);
      // this.getMiaoList(item.mechanism_id)//弃用，影响速度
    },
    getTreeData(isCreate = true) {
      // ......................该组件默认加载树形菜单数据
      var key = this.$store.state.key;
      var objs = { p: 1, ps: 10 };
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("p", objs.p);
      params.append("ps", objs.ps);
      // params.append('mechanism_id', objs.mechanism_id);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=mechanism&a=mechanisms_tree",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          this.zhankai.push(data.data.data.list[0].id);
          this.zhankai.push(data.data.data.list[0].child[0].id || "");
          if (data.data.data.list[0].child[0].child) {
            this.zhankai.push(data.data.data.list[0].child[0].child[0].id);
          }
          this.treeData = data.data.data.list;
          this.active_title = data.data.data.list[0].mechanism_name;
          this.active_jigou = data.data.data.list[0];
          this.hasData = true;
          if (isCreate) {
            this.currentNodeKey = data.data.data.list[0].id;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getDataList(jigou_id, active_p = 1) {
      //................获取列表信息函数
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      var key = this.$store.state.key;
      var objs = {
        mechanism_id: jigou_id,
        p: active_p,
        ps: this.keshihua ? 9 : 19
      };
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("mechanism_id", objs.mechanism_id);
      params.append("p", objs.p);
      params.append("ps", objs.ps);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=gun&a=guns",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          this.loading.close();
          if (data.data.code == 200) {
            let dataArr = data.data.data.list.map(e => {
              return {
                ...e,
                checked: false
              };
            });
            this.activeDataList = dataArr;
            this.pageTotal = data.data.data.psum * 1;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    addData(jigou_id, gun_code, gtype, ownPerson, ownName) {
      //.....................添加枪支

      var key = this.$store.state.key;
      var objs = {
        mechanism_id: jigou_id,
        gun_code: gun_code,
        gtype: gtype,
        policeuser_id: ownPerson,
        policeuser_name: ownName
      };
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("mechanism_id", objs.mechanism_id);
      params.append("gun_code", objs.gun_code);
      params.append("gtype", objs.gtype);
      params.append("policeuser_id", objs.policeuser_id);
      params.append("policeuser_name", objs.policeuser_name);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=gun&a=rewrite",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            this.alert = false;
            this.$message({ message: "添加枪支成功", type: "success" });
            this.checkPerson = "";
          }
        })
        .catch(error => {
          console.log(error);
        });
    }, //...............添加枪支end
    deleteData(idStr) {
      //..................删除枪支
      var key = this.$store.state.key;
      var objs = { gun_id: idStr };
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("gun_id", objs.gun_id);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=gun&a=del",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            this.$message({ message: "删除成功", type: "success" });

            if (
              this.activeDataList.filter(e => e.checked).map(e => e.gun_id)
                .length == this.activeDataList.length
            ) {
              this.getDataList(
                this.active_jigou.mechanism_id,
                this.active_yema - 1
              ); //...........更新视图
            } else {
              this.getDataList(
                this.active_jigou.mechanism_id,
                this.active_yema
              ); //...........更新视图
            }
          }
          if (data.data.code == 401) {
            this.$message({
              message: "删除失败！请先解除绑定",
              type: "error"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }, //......................删除枪支end
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
            this.$message("绑定成功");
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
            this.$message("解除绑定成功");
          }
        })
        .catch(error => {
          console.log(error);
        });
    } //..........................解绑end
  },
  created() {
    let keshi = localStorage.getItem("setKeShiHua");
    this.keshihua = JSON.parse(keshi);

    let treeData = JSON.parse(sessionStorage.getItem("tree-list"));
    this.zhankai.push(treeData[0].id);
    if (!!treeData[0].child.length) {
      this.zhankai.push(treeData[0].child[0].id || "");
      if (!!treeData[0].child[0].child.length) {
        this.zhankai.push(treeData[0].child[0].child[0].id);
      }
    }
    this.treeData = treeData;
    this.active_title = treeData[0].mechanism_name;
    this.active_jigou = treeData[0];
    this.hasData = true;
    this.currentNodeKey = treeData[0].id;
    this.getDataList(this.active_jigou.id, 1);

    this.getOptionStr();
    this.sync = this.$gscookie.getCookie("sync");
    this.activeJiGouId = this.$gscookie.getCookie("mechanism_id");
    let item = this.$gscookie.getCookie("message_obj");
    let zaixian = this.$store.state.zaixian;
    if (item.role_id == 3) {
      if (zaixian) {
        this.$router.push({
          name: "GuiJi"
        });
      } else {
        this.$router.push({
          name: "Map"
        });
      }
    }

    let jiGouId = this.$store.state.jiGouId;
    let yeMa = this.$store.state.yeMa;

    let str = this.$gscookie.getCookie("gun");
    if (JSON.stringify(str) == "{}") {
      this.$router.push("/loginput");
      return;
    }
    if (jiGouId || yeMa) {
      this.currentNodeKey = jiGouId;
      this.activeJiGouId = jiGouId;
      this.currentPage = yeMa - 0;
      this.getTreeData(false);
      this.getDataList(jiGouId, 1);
      this.$store.commit("emptyNumber");
    }
  },
  mounted() {
    this.$store.commit("setStr", {
      str1: "枪支列表",
      str2: "情况汇总"
    });
  },
  destroyed() {
    this.$store.commit("huanyuanStr");
  }
};
</script>
