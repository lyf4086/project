<template>
  <div class="danyaoxiaohao">
    <div class="tree-menu">
      <h3>弹药消耗</h3>
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
        <breadNav title="弹药消耗" :next="active_title" />
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
    <div class="page-index" v-if="false">
      <el-pagination :page-size="20" :pager-count="11" layout="prev, pager, next" :total="1000"></el-pagination>
    </div>
    <!-- <div class="add-del">
            <button>新增人员</button>
            <button>删除人员</button>
    </div>-->
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
      loading:null,
      zhankai:[]
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
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.dataList=[]
      this.search(this.activeMechanismId);
    },

    getDataList(jigou_id) {
      //................弹药消耗列表信息函数

      var key = this.$store.state.key;
      var objs = {};
      if (jigou_id) {
        objs.id = jigou_id;
      }
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      if (jigou_id) {
        params.append("id", objs.id);
      }
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
            console.log(data.data.data)
            this.liebiao = data.data.dat;
            this.loading.close()
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    search(MechanismId) {
      let selV = this.selValue;
      let putV = this.putValue;
      var key = this.$store.state.key;
      var objs = { mechanism_id: MechanismId };
      objs[selV] = putV;

      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append(selV, objs[selV]);

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
            this.loading.close()
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getTreeList() {
      // ......................该组件默认加载树形菜单数据
      var key = this.$store.state.key;
      var objs = { p: 1, ps: 6, mechanism_id: 1 };
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
          this.zhankai.push(data.data.data.list[0].id)
          this.zhankai.push(data.data.data.list[0].child[0].id || "")
          if(data.data.data.list[0].child[0].child){
            this.zhankai.push(data.data.data.list[0].child[0].child[0].id)
          }
          this.treeListData = data.data.data.list;
        })
        .catch(error => {
          console.log(error);
        });
      this.hasData = true;
    },
    handleNodeClick(item) {
      //树形菜单点击
      this.dataList=[]
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.activeMechanismId = item.id;
      this.activeItem = item; //记录当前激活的树形菜单子项
      this.active_title = item.mechanism_name;
      this.getDataList(item.id);
    }
  },
  created() {
    let treeData=JSON.parse(sessionStorage.getItem('tree-list'))
    this.zhankai.push(treeData[0].id)

    if(!!treeData[0].child.length){
            this.zhankai.push(treeData[0].child[0].id || "")
            if(!!treeData[0].child[0].child){
                this.zhankai.push(treeData[0].child[0].child[0].id)
              }
          }
    this.treeListData = treeData;

    this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    let item = this.$gscookie.getCookie("message_obj");
    let jigou = this.$gscookie.getCookie("mechanism_id");
    this.currentNodeKey = this.$gscookie.getCookie("mechanism_id");
    this.activeMechanismId = jigou;
    if (item.role_id == 3) {
      this.$router.push({
        name: "GuiJi"
      });
    }
    // this.getTreeList();
    this.getDataList();
    let str = this.$gscookie.getCookie("gun");
    if (JSON.stringify(str) == "{}") {
      this.$router.push("/loginput");
    }
  },
  mounted() {
    this.$store.commit('setStr',{
      str1:'弹药管理',
      str2:'消耗列表'
    })
  },
  destroyed(){
    this.$store.commit('huanyuanStr')
  }
};
</script>
