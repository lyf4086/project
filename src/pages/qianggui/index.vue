<template>
  <div class="qianggui">
    <div class="tree-menu">
      <h3>枪柜详情</h3>
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
        <breadNav title="枪柜详情" :next="active_title" />
      </div>
      <div class="search-wrap">
        <!--搜索框-->
        <select class="sel" v-model="selValue">
          <option value disabled selected>请选择搜索类型</option>
          <option value="vtype">柜子类型</option>
          <option value="vdevSN">柜子名称</option>
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
    <div class="page-index" >
      <el-pagination
        :page-size="pageSize"
        :pager-count="9"
        layout="total,prev, pager, next"
        @current-change="currentChange"
        :total="pageTotal"
        ref="page"
      ></el-pagination>
    </div>
    
    <div class="new_change_type">
      <button :class="{'active':keshihua}" @click="changeShowType(1)">视图</button>
      <button :class="{'active':!keshihua}" @click="changeShowType(2)">列表</button>
    </div>
    <div class="content" v-show="keshihua">
      <div class="new_nodta" v-if="!dataArr.length">暂时没有数据</div>
      <div class="newdatalist">
        <div class="tit">枪柜总量：{{pageTotal}}</div>
        <div class="data_item hvr-float-shadow" v-for="item in dataArr" :key="item.id">
          <div class="top">{{item.org_name}}</div>
          <div class="con">
            <div class="img_wrap">
              <img src="../../assets/qianggui/guizi1.png" alt="" srcset="">
            </div>
            <div class="text_floor">枪柜名称：<span>{{item.vCaption}}</span></div>
            <div class="text_floor">枪柜类型：<span>{{item.vtype}}</span></div>
            <div class="text_floor">枪柜编号：<span>{{item.vdevSN}}</span></div>
            <!-- <div class="text_floor">弹药数量：<span>{{item.bulletcount}}</span></div> -->
            <div class="look_info" @click="look(item)">查看详情</div>
          </div>
        </div>
        
      </div>
    </div>
    <div class="new_list_wrap" v-show="!keshihua">
      <div class="new_nodta" v-if="!dataArr.length">暂时没有数据</div>
      <div class="tit2">枪柜总量：{{pageTotal}}</div>
      <div class="slot-wrap" v-if="dataArr.length">
        <div class="slot-title" style="grid-template-columns: repeat(4,1fr)">
           <span>单位</span>
          <span>枪柜类型</span>
          <span>枪柜名称</span>
          <span>操作</span>
        </div>
        <div class="slot-item" v-for="item in dataArr" :key="item.id" style="grid-template-columns: repeat(4,1fr)">
          <span >{{item.org_name}}</span>
          <span>{{item.vtype}}</span>
          <span>{{item.vdevSN}}</span>
          <span  style="cursor:pointer;text-decoration: underline;"  @click="look(item)">查看详情</span>
        </div>
      </div>

    </div>
    <div class="xiangqing-wrap" v-show="qiangguishow || vidio">
      
      <div class="new_xiangqing" v-show="qiangguishow">
        <div class="close" @click="close" style="cursor:pointer"></div>
        <div class="quxiao" @click="close">取消</div>
        <div class="new_tit">{{showName}}</div>
        <!-- <div class="new_main">
          <div class="new_item" v-for="(item,index) in xiangqingData" :key="index">
            <div class="full">
              <div class="new_img_wrap">
                <img v-if="item.src" :src="urlBase+item.src" alt="">
                <img v-if="!item.src" src="../../assets/qianggui/empty.png" alt="">
              </div>
              <div class="new_floor">类型：<span>{{item.gtype}}</span></div>
              <div class="new_floor">编号：<span>{{item.gun_code}}</span></div>
              <div class="new_floor">锁位：<span>{{item.vLabel}}</span></div>
              <div class="zaiwei" :class="{'buzaiwei':item.nStauts==2}">{{item.nStauts==1?'在位':'不在位'}}</div>
            </div>
          </div>
        </div> -->
        <div class="edit_mian">
          <div class="edit_item" v-for="(item,index) in xiangqingData" :key="index">
            <div class="edit_full">
              <div class="edit_state" :class="item.nStauts==2?'buzai':''"></div>
              <div class="edit_img_wrap">
                <img v-if="item.src" :src="urlBase+item.src" alt="">
                <img v-if="!item.src" src="../../assets/qianggui/empty.png" alt="">
              </div>
              <div class="edit_floor">
                类型：<i>{{item.gtype}}</i>
              </div>
              <div class="edit_floor">
                编号：<i>{{item.gun_code}}</i>
              </div>
              <div class="edit_number">{{item.vLabel}}号</div>
            </div>
          </div>
        </div>
        <!--  -->
      </div>   
    </div>
   
  </div>
</template>
<style scoped>
@import url(./index.css);
@import url(./info_edit.css);
@import url(../xiaohao/newstyle.css);
</style>
<script>
import breadNav from "@/components/breadnav";
// import Content from './children/content'
export default {
  components: { breadNav },
  data() {
    return {
      urlBase:this.$store.state.baseURL,
      keshihua:false,
      active_title: "",
      activeMechanismId: "",
      currentNodeKey: "",
      selValue: "",
      putValue: "",
      treeListData: [],
      activeItem: "",
      defaultProps: {
        children: "child",
        label: "mechanism_name"
      },
      dataArr: [],
      xiangqingindex: 0,
      qiangguishow: false,
      xiangqingData: [],
      fromQiangZhi: false,
      vidio: false,
      loading: null,
      zhankai:[],
      pageTotal:0,
      page:1,
      pageSize:0,
      showName:''
    };
  },
  methods: {
    currentChange(n){
      this.getDataList(this.activeItem.id,n,this.pageSize);
    },
    changeShowType(n){
     
      
      this.dataArr.length=0
      if(n===1){
        this.keshihua=true
        this.pageSize=12
        this.getDataList(this.activeItem.id, 1,12);
      }else{
        this.keshihua=false
        this.pageSize=19
        this.getDataList(this.activeItem.id, 1,19);
      }
      localStorage.setItem('setKeShiHua',this.keshihua)
      
      this.$refs.page.internalCurrentPage = 1;
     
    },
    juese(n) {
      if (n == 1) {
        return "系统管理员";
      } else if (n == 2) {
        return "枪支管理员";
      } else if (n == 3) {
        return "用枪员";
      } else {
        return "领导";
      }
    },

    openVidio() {
      this.vidio = true;
    },
    closeVidio() {
      this.vidio = false;
    },
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
    getDataList(id,page=1,ps=this.pageSize) {
      //................获取枪柜列表信息函数
      console.log(ps)
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      var objs = {
        state: 1,
        page,
        ps
      };
      if (id) {
        objs.id = id;
      }
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      if (id) {
        params.append("id", objs.id);
      }
      params.append("page", objs.page);
      params.append("ps", objs.ps);
      params.append("sign", sign);
      params.append("token", token);
      params.append("state", objs.state);
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
            console.log( data.data.data)
            this.dataArr = data.data.data;
            this.loading.close();
            this.pageTotal = data.data.total - 0;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    search(MechanismId) {
      let selV = this.selValue;
      let putV = this.putValue;
      var objs = {
        mechanism_id: MechanismId,
        state: 1
      };
      objs[selV] = putV;

      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append(selV, objs[selV]);
      params.append("mechanism_id", objs.mechanism_id);
      params.append("state", objs.state);
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
            this.dataArr = data.data.data;
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
         if(data.status==200){
           this.zhankai.push(data.data.data.list[0].id)
           this.zhankai.push(data.data.data.list[0].child[0].id || "")
           if(data.data.data.list[0].child[0].child){
              this.zhankai.push(data.data.data.list[0].child[0].child[0].id)
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
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.activeMechanismId = item.id;
      this.activeItem = item; //记录当前激活的树形菜单子项
      this.active_title = item.mechanism_name;
      this.getDataList(item.id,1,this.pageSize);
    },
    look(index) {
      console.log(index)
      this.showName=index.vdevSN
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      // this.qiangguishow=true
      this.xiangqingindex = index;
      this.getXiangQing(index.id);
    },
    close() {
      this.qiangguishow = false;
      this.gunXQ = false;
      this.xiangqingindex = 0;
      if (this.fromQiangZhi) {
        this.fromQiangZhi = false;
        this.$router.go(-1);
      }
    },
    getXiangQing(id) {
      //................详情信息函数

      var key = this.$store.state.key;
      var objs = { device_id: id };

      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();

      params.append("device_id", objs.device_id);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=GetDeviceList&a=devicegun",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            this.loading.close();
            this.xiangqingData = data.data.data.sort((a,b)=>a.vLabel-b.vLabel);
            console.log( this.xiangqingData)
            if (!this.xiangqingData.length) {
              this.$message("暂无数据");
              this.qiangguishow = false;
            } else {
              this.qiangguishow = true;
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created() {

    //公用树形菜单数据
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
    let item = this.$gscookie.getCookie("message_obj");
    let jigou = this.$gscookie.getCookie("mechanism_id");
    this.currentNodeKey = this.$gscookie.getCookie("mechanism_id");
    this.activeMechanismId = jigou;
    if (item.role_id == 3) {
      this.$router.push({
        name: "GuiJi"
      });
    }
    // this.getTreeList();//放弃树形菜单请求函数，优化
    
    let str = this.$gscookie.getCookie("gun");
    if (JSON.stringify(str) == "{}") {
      this.$router.push("/loginput");
    }
    let obj = this.$route.params;
    if (obj.guncabinet_id) {
      this.qiangguishow = true;
      this.fromQiangZhi = true;
      this.getXiangQing(obj.guncabinet_id);
    }
  },
  mounted() {
    let keshi=localStorage.getItem('setKeShiHua')
     this.keshihua=JSON.parse(keshi) 
    
     this.pageSize=this.keshihua?12:19
     this.getDataList(null,1,this.pageSize);
    this.$store.commit('setStr',{
      str1:'各机构',
      str2:'枪柜列表'
    })

  },
  destroyed(){
    this.$store.commit('huanyuanStr')
  }
};
</script>
