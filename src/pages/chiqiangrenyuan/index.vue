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
        :page-size="pageSize"
        :pager-count="9"
        layout="total,prev, pager, next"
        @current-change="currentChange"
        :total="pageTotal"
        ref="page"
      ></el-pagination>
    </div>

    <div class="content" v-if="dataList" v-show="keshihua">
      <div class="new_nodta" v-if="!dataList.length">暂时没有数据</div>
      <onePerson
        v-for="item in dataList"
        :key="item.id"
        :oneDate="item"
        @toNew="toNew"
        @toHistory="toHistory"
        @openalert="openalert"
      />
    </div>
    
    <div class="new_change_type" >
      <button :class="{'active':keshihua}" @click="changeShowType(1)">视图</button>
      <button :class="{'active':!keshihua}" @click="changeShowType(2)">列表</button>
    </div>
    <div class="new_list_wrap" v-show="!keshihua">
     <div class="new_nodta" v-if="!dataList.length">暂时没有数据</div>
      <div class="slot-wrap" v-show="dataList.length">
        <div class="slot-title" style="grid-template-columns: repeat(7,1fr)">
            <span>警员姓名</span>
            <span>警号</span>
            <span>持枪证号</span>
            <span>单位</span>
            <span>枪支编号</span>
            <span>持枪类型</span>
            <span>操作</span>
        </div>
        <div class="slot-item" v-for="(item,index) in dataList" :key="index" style="grid-template-columns: repeat(7,1fr)">
            <span>{{item.policeName}}</span>
            <span>{{item.policeNum}}</span>
            <span>{{item.permitid}}</span>
            <span>{{item.mechanism_name}}</span>
            <span>{{item.gunNum}}</span>
            <span>{{item.bulletType}}</span>
            <span >
              <i @click="lookXQ(item,index)" style="cursor:pointer;text-decoration:underline">查看详情</i>
              <i @click="lookLS(item,index)" style="cursor:pointer;text-decoration:underline">历史轨迹</i>
              <i @click="lookNEW(item,index)" style="cursor:pointer;text-decoration:underline">最新位置</i>
            </span>
        </div>
    </div>
      <!--  -->
    </div>
    <div class="alert1" v-show="mapShow">
      <div class="map_wrap">
        <div id="map-content"></div>
        <button class="del" @click="mapOff">取消</button>
        <div class="del2" @click="mapOff">X</div>
      </div>
    </div>
    <div class="cover" v-show="xiangqingalert"></div>
    <div class="alert" v-if="xiangqingalert">
        <button class="del" @click="close">X</button>
        <div class="leftwrap">
          <div class="box-l">
            <div class="imgwrap">
              <img v-if="oneDate.icon" :src="oneDate.icon" alt="警员" />
              <img v-if="!oneDate.icon" src="../../assets/img/head-icon.png" alt />
            </div>
            <div class="btnwrap">
              <button @click="toNew(oneDate)">最新轨迹</button>
              <button @click="toHistory(oneDate)">历史轨迹</button>
              <button>枪瞄状态{{xiangqingData.heart}}</button>
            </div>
            <div class="iconwrap1">
              
            </div>
            <div class="iconwrap2">
              
            </div>
          </div>
          <div class="box-r">
            <div class="text1">
              <p><i>警员</i><i>：{{oneDate.policeName}}</i></p>
              <p><i>IMEI</i><i>：{{oneDate.IMEI}}</i></p>
              <p><i>手机号</i><i>：{{oneDate.phoneNum}}</i></p>
              <p><i>单位</i><i>：{{oneDate.mechanism_name}}</i></p>
            </div>
            <div class="text2">
              <p><i>警号</i><i>：{{oneDate.policeNum}}</i></p>
              <p><i>持枪证</i><i>：{{oneDate.permitid}}</i></p>
              <p><i>枪支编号</i><i>：{{oneDate.gunNum}}</i></p>
              <p><i>枪支类型</i><i>：{{oneDate.bulletType}}</i></p>
            </div>
            <div class="text3">
              <p>本月出勤数量：{{xiangqingData.btoal}}条</p>
              <p>出勤任务总量：{{xiangqingData.toal}}条</p>
            </div>
            <div class="text4">
              <p>离套报警数量：{{xiangqingData.litao}}条</p>
              <p>区域报警数量：{{xiangqingData.quyu}}条</p>
            </div>
          </div>
        </div>
        <div class="mes mes1">
          <p><i>出库时间：</i><i>{{xiangqingData.optime}}</i></p>
          <p><i>归还时间：</i><i>{{xiangqingData.planreturntime}}</i></p>
        </div>
        <div class="mes mes2">
          <p><i>所属枪柜：</i><i>{{xiangqingData.guncabinet_code}}</i></p>
          <p><i>枪锁位：</i><i>{{xiangqingData.gposition}}</i></p>
        </div>
        <div class="mes mes3">
          <p><i>枪支编号：</i><i>{{xiangqingData.gun_code}}</i></p>
          <p><i>枪支类型：</i><i>{{xiangqingData.gunType}}</i></p>
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
      oneDate:{},
      xiangqingData:{},
      xiangqingalert:false,
      keshihua:false,
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
      zhankai:[],
      pageSize:4
    };
  },
  methods: {
    openalert(item){
      this.oneDate=item
      this.getXiangqing(item.id)
    },
    close(){
      this.xiangqingalert=false
    },
    lookXQ(item,index){
      this.oneDate=item
      this.getXiangqing(item.id)
    },
    lookLS(item,index){
      this.toHistory(item)
    },
    lookNEW(item,index){
      this.toNew(item)
    },
    changeShowType(n){
     
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.dataList.length=0
      if(n===1){
        this.keshihua=true
        this.pageSize=4
        this.getDataList(this.activeItem.id, 1,4);
       
      }else{
        this.keshihua=false
        this.pageSize=19
        this.getDataList(this.activeItem.id, 1,19);
        
      }
      localStorage.setItem('setKeShiHua',this.keshihua)
      
      this.$refs.page.internalCurrentPage = 1;
    },
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
    getXiangqing(id) {
      //................获取持枪人员列表信息函数
      var key = this.$store.state.key;
      var objs = { id: id };
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("id", objs.id);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=Home&c=Gunlibrary&a=gunlibrary",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.status == 200) {
            this.xiangqingalert=true
            this.xiangqingData=data.data
          }
        })
        .catch(error => {
          console.log(error);
        });
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
     
      let zaixian=this.$store.state.zaixian
      if(zaixian){
        //高德地图
        this.mapShow = true;
        this.mapInit(obj);
      }else{
        // 打开离线地图
        this.lixianMap=true
        this.lixianArr=[obj.latitude-0,obj.longitude-0]
        this.lixianTitle=obj.policeName
      }
  
    },
    toHistory(obj) {
      if (!obj.longitude) {
        this.$message({
          type: "error",
          message: "该人员暂无轨迹信息"
        });
        return;
      }
      let zaixian=this.$store.state.zaixian
      if(zaixian){
        //高德地图
        this.$router.push({
          name: "GuiJi",
          params: obj
        });
      }else{
        // 打开离线地图
        this.$router.push({
          name: "Map",
          params: obj
        });
      }
      
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
      this.getDataList(item.id,1,this.pageSize);
    },
    getDataList(jigou_id, active_p = 1,ps=this.pageSize) {
      //................获取持枪人员列表信息函数
      if (!jigou_id) {
        jigou_id = this.$gscookie.getCookie("mechanism_id");
      }
      var key = this.$store.state.key;
      var objs = { id: jigou_id, page: active_p ,ps};
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("id", objs.id);
      params.append("page", objs.page);
      params.append("ps", objs.ps);
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
      let treeData=JSON.parse(sessionStorage.getItem('tree-list'))
    this.zhankai.push(treeData[0].id)
    if(!!treeData[0].child.length){
       this.zhankai.push(treeData[0].child[0].id || "")
       if(!!treeData[0].child[0].child.length){
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
     
    let keshi=localStorage.getItem('setKeShiHua')
     this.keshihua=JSON.parse(keshi) 
     this.pageSize=this.keshihua?4:19
     this.handleNodeClick( this.treeListData[0],this.pageSize,1)
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
