<template>
  <div class="chiqiang">
    <div class="tree-menu">
      <h3>持枪人员</h3>
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
        <breadNav title="持枪人员" :next="active_title" />
      </div>
      <div class="search-wrap">
        <!--搜索框-->
        <select class="sel" v-model="selValue">
          <option value disabled selected>请选择搜索类型</option>
          <option value="uname">警员姓名</option>
          <option value="police_number">警员编号</option>
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
        :page-size="4"
        :pager-count="9"
        layout="total,prev, pager, next"
        @current-change="currentChange"
        :total="pageTotal"
        ref="page"
      ></el-pagination>
    </div>

    <div class="content" v-if="dataList">
      <div class="none-data" v-if="!dataList.length">暂时没有数据......</div>
      <onePerson
        v-for="item in dataList"
        :key="item.id"
        :oneDate="item"
        @toNew="toNew"
        @toHistory="toHistory"
      />
    </div>
    <div class="alert" v-show="mapShow">
      <div class="map_wrap">
        <div id="map-content"></div>
        <button class="del" @click="mapOff">取消</button>
        <div class="del2" @click="mapOff">X</div>
      </div>
    </div>
    <MapMarker v-if="lixianMap" :arr="lixianArr" :title="lixianTitle"  @closeMap="closeMap"/>
  </div>
</template>
<style scoped>
@import url(./index.css);
</style>
<script>
import breadNav from "@/components/breadnav";
import onePerson from "./children/onePerson";
import MapMarker from '@/components/map-marker.vue'
import GaoDe from '@/components/mapalertgaode.vue'
export default {
  components: { breadNav, onePerson,MapMarker },
  data() {
    return {
      mapShow: false,
      active_title: "",
      currentNodeKey: "",
      selValue: "",
      putValue: "",
      treeListData: [],
      dataList: [],
      activeItem: "",
      pageTotal: 0,
      defaultProps: {
        children: "child",
        label: "mechanism_name"
      },
      lixianMap:false,
      lixianArr:[],
      lixianTitle:'',
      loading:null,
      zhankai:[]
    };
  },
  methods: {
    closeMap(){
      this.lixianMap=false
    },
    subSearch() {
      if (!this.selValue) {
        this.$message("请选择搜索的条件");
        return;
      }
      if (!this.putValue.trim()) {
        this.$message("请输入关键字！");
      }
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.search();
    },
    mapInit(obj) {
      let that=this
      let map = new AMap.Map("map-content", {
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
      marker.on('click',function (){
        that.$message({
          message:`警员姓名：${obj.policeName}, 时间：${obj.time}`,
          duration:4000
        })
      })
    },
    mapOff() {
      this.mapShow = false;
      this.hasTime = false;
    },
    searchByTime() {
      this.hasTime = false;
    },
    toNew(obj) {
      if (!obj.longitude) {
        this.$message({
          type: "error",
          message: "该人员暂无轨迹信息"
        });
        return;
      }
     

      // 打开离线地图
      // this.lixianMap=true
      // this.lixianArr=[obj.latitude-0,obj.longitude-0]
      // this.lixianTitle=obj.policeName

      this.mapShow = true;
      this.mapInit(obj);
    },
    toHistory(obj) {
      if (!obj.longitude) {
        this.$message({
          type: "error",
          message: "该人员暂无轨迹信息"
        });
        return;
      }

      this.$router.push({
        name: "GuiJi",
        params: obj
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
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$refs.page.internalCurrentPage = 1;
      this.activeItem = item; //记录当前激活的树形菜单子项
      this.active_title = item.mechanism_name;
      this.getDataList(item.id);
    },
    getDataList(jigou_id, active_p = 1) {
      //................获取持枪人员列表信息函数
      if (!jigou_id) {
        jigou_id = this.$gscookie.getCookie("mechanism_id");
      }
      var key = this.$store.state.key;
      var objs = { id: jigou_id, page: active_p };
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("id", objs.id);
      params.append("page", objs.page);

      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=Gunlibrary&a=index",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            console.log(data.data.data)
            this.loading.close()
            this.dataList = data.data.data;
            this.pageTotal = data.data.total - 0;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    currentChange(n) {
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.getDataList(this.activeItem.id, n);
    },
    search() {
      let sel = this.selValue;
      let val = this.putValue;
      var key = this.$store.state.key;
      var objs = { state: 1 };
      objs[sel] = val;

      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append(sel, objs[sel]);
      params.append("state", objs.state);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=Gunlibrary&a=index",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            this.loading.close()
            this.dataList = data.data.data;
            this.pageTotal = data.data.total - 0;
            this.selValue = "";
            this.putValue = "";
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
    this.getTreeList();
    this.getDataList();
    this.currentNodeKey = this.$gscookie.getCookie("mechanism_id");
    let item = this.$gscookie.getCookie("message_obj");
    if (item.role_id == 3) {
      this.$router.push({
        name: "GuiJi"
      });
    }
    let str = this.$gscookie.getCookie("gun");
    if (JSON.stringify(str) == "{}") {
      this.$router.push("/loginput");
      return;
    }
  },
  mounted() {
    this.$store.commit('setStr',{
      str1:'持枪人员',
      str2:'数据列表'
    })
  },
  destroyed(){
    this.$store.commit('huanyuanStr')
  }
};
</script>
