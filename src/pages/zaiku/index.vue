<template>
  <div class="danyao">
    <div class="tree-menu">
      <h3>弹药管理</h3>
      <div class="nav-wrap">
        <el-tree
          :data="treeListData"
          :props="defaultProps"
          :highlight-current="true"
          accordion
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
        <breadNav title="弹药在库" :next="active_title" />
      </div>
      <div class="search-wrap">
        <!--搜索框-->
        <select class="sel" v-model="selValue">
          <option value disabled selected>请选择搜索类型</option>
          <option value="vtype">弹柜类型</option>
          <option value="vdevSN">弹柜名称</option>
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
    <div class="page-index" style="display:none">
      <el-pagination :page-size="20" :pager-count="11" layout="prev, pager, next" :total="1000"></el-pagination>
    </div>

    <div class="content">
      <Content :dataArr="dataList" :list="liebiao" />
    </div>
    <div class="alert" style="display:none">
      <div class="text-wrap">
        <div class="text-title">新增人员</div>
        <div class="text-content">
          <span>名称:</span>
          <input type="text" />

          <span>编号:</span>
          <input type="text" />

          <span>枪支数量:</span>
          <input type="text" />

          <span>警员数量:</span>
          <input type="text" />

          <span>所属单位:</span>
          <input type="text" />

          <span>创建日期:</span>
          <input type="text" />
        </div>
        <div class="submit">确认</div>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import url(./index.css);
</style>
<script>
import breadNav from "@/components/breadnav";
import Content from "./children/content";
export default {
  components: { breadNav, Content },
  data() {
    return {
      active_title: "",
      activeMechanismId: "",
      currentNodeKey: "",
      selValue: "",
      putValue: "",
      treeListData: [],
      dataList: [],
      liebiao: [],
      activeItem: "",
      defaultProps: {
        children: "child",
        label: "mechanism_name"
      },
      zhankai: [],
      loading: null
    };
  },
  methods: {
    subSearch() {
      if (!this.selValue) {
        this.$message({ message: "请选择搜索条件", type: "warning" });
        return;
      } else if (!this.putValue) {
        this.$message({ message: "请输入您要搜索的内容", type: "warning" });
        return;
      }
      this.search(this.activeMechanismId);
    },
    getTreeList(id) {
      // ......................该组件默认加载树形菜单数据
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
          // this.loading.close()
          if (data.data.code == 200) {
            this.zhankai.push(data.data.data.list[0].id);
            this.zhankai.push(data.data.data.list[0].child[0].id || "");
            if (data.data.data.list[0].child[0].child) {
              this.zhankai.push(data.data.data.list[0].child[0].child[0].id);
            }
            this.treeListData = data.data.data.list;
          }
        })
        .catch(error => {
          console.log(error);
        });
      this.hasData = true;
    },
    handleNodeClick(item) {
      //树形菜单点击
      this.activeItem = item; //记录当前激活的树形菜单子项
      this.activeMechanismId = item.id;
      this.active_title = item.mechanism_name;
      this.getDataList(item.id);
    },
    getDataList(jigou_id) {
      //................弹药在库列表信息函数
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      var key = this.$store.state.key;
      var objs = { page: 1 };
      if (jigou_id) {
        objs.id = jigou_id;
      }
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      if (jigou_id) {
        params.append("id", objs.id);
      }

      params.append("page", objs.page);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=GetDeviceList&a=index",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          this.loading.close();
          if (data.data.code == 200) {
            this.dataList = data.data.data;
            this.liebiao = data.data.dat;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    search(MechanismId) {
      var key = this.$store.state.key;
      var objs = {
        mechanism_id: MechanismId,
        page: 1
      };
      let selV = this.selValue;
      objs[selV] = this.putValue;
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append(selV, objs[selV]);
      params.append("page", objs.page);
      params.append("mechanism_id", objs.mechanism_id);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=GetDeviceList&a=index",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            this.dataList = data.data.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },

  created() {
    let treeData = JSON.parse(sessionStorage.getItem("tree-list"));
    this.zhankai.push(treeData[0].id);

    if (!!treeData[0].child.length) {
      this.zhankai.push(treeData[0].child[0].id || "");
      if (!!treeData[0].child[0].child) {
        this.zhankai.push(treeData[0].child[0].child[0].id);
      }
    }
    this.treeListData = treeData;

    let item = this.$gscookie.getCookie("message_obj");
    this.currentNodeKey = this.$gscookie.getCookie("mechanism_id");
    if (item.role_id == 3) {
      this.$router.push({
        name: "GuiJi"
      });
    }
    let jigou = this.$gscookie.getCookie("mechanism_id");
    this.activeMechanismId = jigou;
    this.getDataList(jigou);
    let str = this.$gscookie.getCookie("gun");
    if (JSON.stringify(str) == "{}") {
      this.$router.push("/loginput");
    }
  },
  mounted() {
    this.$store.commit("setStr", {
      str1: "弹药在库",
      str2: "情况汇总"
    });
  },
  destroyed() {
    this.$store.commit("huanyuanStr");
  }
};
</script>
