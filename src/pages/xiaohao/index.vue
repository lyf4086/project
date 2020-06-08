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
    <!-- <div class="add-del">
            <button>新增人员</button>
            <button>删除人员</button>
    </div>-->
    <div class="content" v-show="keshihua">
      <Content :dataArr="dataList" :list="liebiao" >
        {{pageTotal}}
      </Content>
    </div>
    <div class="change_type">
      <button title="可视化" :class="{'active':keshihua}" @click="changeShowType(1)"></button>
      <button title="列表" :class="{'active':!keshihua}" @click="changeShowType(2)"></button>
    </div>
    <div class="content2" v-show="!keshihua">
      <div class="none-data" v-if="!dataList.length">暂时没有数据</div>
      <div class="list-title" v-if="dataList.length">
        <span>单位</span>
        <span>弹柜名称</span>
        <span>弹柜类型</span>
        <span>弹柜编号</span>
        <span>弹药数量</span>
        <span>操作</span>
      </div>
      <div class="list-item" v-for="(item,index) in dataList" :key="index">
        <span>{{item.org_name}}</span>
        <span>{{item.vdevSN}}</span>
        <span>{{item.vtype}}</span>
        <span>{{item.vCaption}}</span>
        <span>{{item.bulletcount}}</span>
        <span @click="showinfo(item)" style="cursor:pointer;text-decoration:underline">详情</span>
      </div>
      
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
    <div class="xiangqing-wrap" v-show="xiangqingshow">
      <div class="xiangqing">
        <p class="title">弹药详情</p>
        <div class="content">
          <div class="cabinet">
            <div class="item item1" v-for="(item,index) in xiangqingData" :key="index">
              <div class="text">
                <!-- <p>弹药详情</p> -->
                <p>弹药名称：{{item.bullname}}</p>
                <p>弹药类型：{{item.bulletType}}</p>
                <p>消耗数量：{{item.bulletConsumeCount}}</p>
                <div class="line">
                  <div class="dian"></div>
                </div>
              </div>
            </div>
            <!-- <div class="item item2">
                        <div class="text">
                          弹药详情
                          <div class="line">
                            <div class="dian"></div>
                          </div>
                        </div>
                      </div>
                      <div class="item item3">
                        <div class="text">
                          弹药详情
                          <div class="line">
                            <div class="dian"></div>
                          </div>
                        </div>
            </div>-->
          </div>
          <div class="chassis">
            <div class="up"></div>
            <div class="down"></div>
          </div>
        </div>
        <button class="close" @click="close">取消</button>
        <button class="del" @click="close">X</button>
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
      keshihua:false,
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
      zhankai:[],
      pageSize:10,
      pageTotal:0,
      xiangqingshow:false,
      xiangqingData:{}
    };
  },
  methods: {
    close(){
      this.xiangqingshow = false;
    },
    showinfo(index){
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.xiangqingindex = index;
      // this.xiangqingshow=true
      this.getXiangQing(index.id);
    },
    currentChange(n){
       this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.getDataList(this.activeItem.id, n,this.pageSize);
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
        this.pageSize=10
        this.getDataList(this.activeItem.id,1,this.pageSize);
      }else{
        this.keshihua=false
        this.pageSize=19
        this.getDataList(this.activeItem.id,1,this.pageSize);
      }
      localStorage.setItem('setKeShiHua',this.keshihua)
      
      this.$refs.page.internalCurrentPage = 1;
    },
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
    getXiangQing(id) {
      var key = this.$store.state.key;
      var objs = { vdeid: id };
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("vdeid", objs.vdeid);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL+"/weixin/project/index.php?m=home&c=Bulletlist&a=consumes",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            this.xiangqingData = data.data.data;
            if (this.xiangqingData.length) {
              this.xiangqingshow = true;
            } else {
              this.$message("暂无数据");
            }
            this.loading.close()
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getDataList(jigou_id,page=1,ps=this.pageSize) {
      //................弹药消耗列表信息函数

      var key = this.$store.state.key;
      var objs = {page,ps};
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
      params.append("ps", objs.ps);
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
            this.pageTotal=data.data.total
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
      this.getDataList(item.id,1,this.pageSize);
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
    this.getDataList(null,1,this.pageSize);
    let str = this.$gscookie.getCookie("gun");
    if (JSON.stringify(str) == "{}") {
      this.$router.push("/loginput");
    }
  },
  mounted() {
    let keshi=localStorage.getItem('setKeShiHua')
     this.keshihua=JSON.parse(keshi) 
     this.pageSize=this.keshihua?10:19
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
