<template>
  <div class="jigou">
    <div class="tree-menu">
      <h3>报警管理</h3>
      <div class="nav-wrap">
        <el-tree
          :data="treeListData"
          :props="defaultProps"
          :highlight-current="true"
          accordion
          node-key="id"
          :current-node-key="currentNodeKey"
          default-expand-all
          @node-click="handleNodeClick"
        ></el-tree>
      </div>
    </div>
    <div class="top-nav">
      <div class="bread-wrap">
        <!--面包屑导航-->
        <breadNav title="报警管理" :next="active_title" :message="message" />
      </div>
      <div class="search-wrap">
        <!--搜索框-->
        <select class="sel" v-model="selValue">
          <option value disabled selected>请选择搜索类型</option>
          <option value="policeuser_name">警员名称</option>
          <option value="gun_code">枪支编号</option>
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
    <div class="page-index">
      <el-pagination
        :page-size="8"
        :pager-count="9"
        layout="prev, pager, next"
        @current-change="currentChange"
        :total="dataTotal"
        ref="page"
      ></el-pagination>
    </div>

    <div class="content">
      <!-- <Content/> -->
      <div class="none-data" v-if="!list.length">暂时没有数据......</div>
      <Item v-for="(item,index) in list" 
        :item="item" :key="index" 
        @changeOneData="changeOneData" 
        @showNew="showNew"
        @showAlert="showAlert"
      />
    </div>
    <div class="check_type">
      <div class="all" @click="dealAll">
        <span></span>
        一键处理
      </div>
      <div class="no" @click="noDeal">
        <span></span>
        未处理
      </div>
      <div class="yes" @click="dealed">
        <span></span>
        已处理
      </div>
      <div>
        <span class="quanbu" @click="quanbu">全部</span>
      </div>
      <button class="goback" @click="outIn">
        <i class="ii"></i>
      </button>
    </div>
    <div class="cover" v-show="rewriteAll">
      <div class="rewrite">
        <span>处理标题：</span>
        <input type="text" class="put" v-model="txt" />
        <span>处理意见：</span>
        <textarea class="text" v-model="textArea" placeholder="请输入您的处理意见"></textarea>
        <button @click="subRewrite">确定</button>
        <i></i>
        <p @click="quxiao">X</p>
      </div>
    </div>
    <GaoDeMap v-if="gaodeshow" :arr="gaodeArr" title="aaa" @closeMap="closeMap"/>
    <!-- <MapMarker v-if="gaodeshow" :arr="gaodeArr" title="aaa" @closeMap="closeMap"/> -->
  </div>
</template>
<style scoped>
@import url(./index.css);
</style>
<script>
import breadNav from "@/components/breadnav";
import Item from "./children/bj-item";
import MapMarker from '@/components/map-marker.vue'//此为离线地图弹窗
import GaoDeMap from '@/components/mapalertgaode.vue'
export default {
  components: { breadNav, Item ,GaoDeMap,MapMarker},
  data() {
    return {
      currentNodeKey: "",
      rootId: "",
      treeListData: [],
      activeItem: "",
      activeMechanismId: "",
      defaultProps: {
        children: "child",
        label: "mechanism_name"
      },
      active_title: "",
      message: "",
      selValue: "", //搜索状态
      putValue: "", //搜索状态
      state: "", //已处理未处理状态
      dataTotal: 0, //......一共有多少跳数据
      activeYeMa: 0, //......当前显示第几页数据
      search: false, //是否在搜索状态
      checkType: true,
      beiYongList: [],
      list: [],
      rewriteAll: false,
      textArea: "",
      txt: "",
      currentPage: 3,
      policeuser_id: "",
      gaodeshow:false,
      gaodeArr:[39.90923,116.397428]
    };
  },
  methods: {
    showNew(){
      this.gaodeshow=true
    },
    closeMap(){
      this.gaodeshow=false
    },
    showAlert(){
      this.gaodeshow=true
    },
    currentChange(n) {
      //页码点击事件

      if (this.search) {
        this.getDataList(
          this.activeMechanismId,
          n,
          8,
          this.selValue,
          this.putValue,
          this.state
        );
      }
      this.activeYeMa = n;
      this.message = "";
      this.getDataList(
        this.activeMechanismId,
        n,
        8,
        this.selValue,
        this.putValue,
        this.state
      );
    },
    outIn() {
      if (this.checkType) {
        $(".check_type").animate({ right: "-1.8rem" }, function() {
          $(".goback").animate({ right: "1.48rem" });
          $(".ii").css("transform", "rotateY(180deg)");
        });
      } else {
        $(".goback").animate({ right: "0" }, function() {
          $(".check_type").animate({ right: "-0.33rem" });
          $(".ii").css("transform", "rotateY(0deg)");
        });
      }
      this.checkType = !this.checkType;
    },
    changeOneData(index) {
      this.list[index].checked = !this.list[index].checked;
    },
    dealAll() {
      let b = this.list.some(e => e.checked);

      if (!b) {
        this.$message("请先选择要处理的项目");
        return;
      }
      this.rewriteAll = true;
    },
    quxiao() {
      this.rewriteAll = false;
      this.textArea = "";
    },
    noDeal() {
      this.message = "";
      this.state = 1; //未处理
      this.getDataList(
        this.activeItem.mechanism_id,
        1,
        8,
        this.selValue,
        this.putValue,
        this.state
      );
    },
    dealed() {
      this.message = "";
      this.state = 2; //已处理
      this.getDataList(
        this.activeItem.mechanism_id,
        1,
        8,
        this.selValue,
        this.putValue,
        this.state
      );
    },
    subRewrite() {
      this.message = "";
      if (this.txt.trim() == "" || this.textArea.trim() == "") {
        this.$message("请输入您的标题和处理意见");
        return;
      }
      this.rewriteAll = false;

      let ids = this.list.filter(e => e.checked).map(e => e.alarm_info_id);

      this.chuLi(ids, this.txt, this.textArea);

      this.textArea = "";
    },
    quanbu() {
      this.message = "";
      this.state = "";
      this.getDataList(this.activeItem.mechanism_id, 1, 8);
    },
    getTreeList(isCreate = true) {
      // ......................该组件默认加载树形菜单数据
      let id = this.$gscookie.getCookie("mechanism_id");
      var key = this.$store.state.key;
      var objs = { p: 1, ps: 6, mechanism_id: id };
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
          "/weixin/project/index.php?m=home&c=mechanism&a=mechanisms_tree",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          this.treeListData = data.data.data.list;
          this.rootId = data.data.data.list[0].root_id;
          this.activeItem = data.data.data.list[0];
          if (isCreate) {
            this.getDataList(this.activeItem.id, 1, 8);
          }
        })
        .catch(error => {
          console.log(error);
        });
      this.hasData = true;
    },

    getDataList(mechanismId, p = 1, ps = 8, selValue, putValue, state) {
      // ......................获取报警列表
      if (!mechanismId) {
        mechanismId = this.$gscookie.getCookie("mechanism_id");
      }

      var key = this.$store.state.key;
      var objs = { p: p, ps: ps, mechanism_id: mechanismId };
      if (selValue) {
        objs[selValue] = putValue;
      }
      if (state) {
        objs.state = state;
      }
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("p", objs.p);
      params.append("ps", objs.ps);
      params.append("mechanism_id", objs.mechanism_id);
      if (selValue) {
        params.append(selValue, putValue);
      }
      if (state) {
        params.append("state", objs.state);
      }

      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=alarm&a=alarms",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            this.list = data.data.data.list.map((e, i) => {
              return {
                ...e,
                checked: false,
                index: i
              };
            });
            this.beiYongList = this.list;
            this.dataTotal = data.data.data.psum * 1;

          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    chuLi(ids, desc, content = "") {
      // ......................该组件默认加载树形菜单数据

      var key = this.$store.state.key;
      var objs = {
        alarm_info_ids: ids.join(","),
        desc: desc,
        content: content,
        policeuser_id: this.policeuser_id
      };
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("alarm_info_ids", objs.alarm_info_ids);
      params.append("desc", objs.desc);
      params.append("content", objs.content);
      params.append("sign", sign);
      params.append("token", token);
      params.append("policeuser_id", objs.policeuser_id);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=alarm&a=alarm_processing",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            this.$message({
              type: "success",
              message: "处理完成"
            });
            let yeMa = this.activeYeMa || 1;
            this.getDataList(this.activeItem.mechanism_id, yeMa, 8);
          }
        })
        .catch(error => {
          console.log(error);
        });
      this.hasData = true;
    },
    handleNodeClick(item) {
      //树形菜单点击
      this.list.length ? (this.$refs.page.internalCurrentPage = 1) : null;
      this.activeMechanismId = item.mechanism_id;
      this.message = "";
      this.search = false;
      this.state = "";
      this.selValue = "";
      this.putValue = "";
      this.active_title = item.mechanism_name;
      this.activeItem = item; //记录当前激活的树形菜单子项
      this.getDataList(item.mechanism_id, 1, 8);
    },
    subSearch() {
      if (!this.selValue) {
        this.$message({
          type: "warning",
          message: "请先选择搜索类型"
        });
      }
      if (!this.putValue) {
        this.$message({
          type: "warning",
          message: "请输入搜索关键字"
        });
      }
      this.serach = true;
      this.message = this.putValue;
      this.list.length ? (this.$refs.page.internalCurrentPage = 1) : null;
      this.getDataList(
        this.activeMechanismId,
        1,
        8,
        this.selValue,
        this.putValue,
        this.state
      );
    }
  },
  created() {
    this.currentNodeKey = this.$gscookie.getCookie("mechanism_id");
    let obj = this.$route.params;
    let str = this.$gscookie.getCookie("gun");
    let item = this.$gscookie.getCookie("message_obj");
    // console.log(item);
    this.policeuser_id = item.id;
    if (item.role_id == 3) {
      this.$router.push({
        name: "GuiJi"
      });
    }
    if (JSON.stringify(str) == "{}") {
      this.$router.push("/loginput");
      return;
    }

    if (obj.one) {
      //....单个人的报警信息跳转过来的
      this.getTreeList(false);
      this.getDataList(
        obj.org_id || obj.mechanism_id,
        1,
        8,
        "policeuser_name",
        obj.policeName || obj.policeuser_name,
        1
      );
      return;
    }
    if (obj.mechanism_id) {
      this.search = true;

      this.activeMechanismId = obj.mechanism_id;
      this.state = "";
      this.selValue = "policeuser_name";
      this.putValue = obj.policeuser_name;
      this.currentNodeKey = obj.mechanism_id;
      this.getTreeList(false);
      this.subSearch();
      // this.getDataList(obj.mechanism_id,1,8,"policeuser_name",obj.policeuser_name)
    } else {
      this.getTreeList();
    }
  },
  watch: {}
};
</script>
