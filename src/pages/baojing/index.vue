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
          @node-click="handleNodeClick"
          :default-expanded-keys="zhankai"
        ></el-tree>
      </div>
    </div>
    <div class="top-nav">
      <div class="bread-wrap">
        <!--面包屑导航-->
        <breadNav title="报警管理" :next="active_title" :message="message" />
      </div>
      <div class="check-type">
        <select name="" id="" v-html="warningOption" v-model="warningType" @change="changeType">
          <!-- <option value="1">全部</option>
          <option value="2">在线</option>
          <option value="3">离线</option> -->
        </select>
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
        :page-size="keshihua ? 15:19"
        :pager-count="9"
        layout="total,prev, pager, next"
        @current-change="currentChange"
        :total="dataTotal"
        ref="page"
      ></el-pagination>
    </div>
    <!-- <div class="change_type">
      <button title="可视化" :class="{'active':keshihua}" @click="changeShowType(1)"></button>
      <button title="列表" :class="{'active':!keshihua}" @click="changeShowType(2)"></button>
    </div> -->
    <div class="new_change_type">
      <button :class="{'active':keshihua}" @click="changeShowType(1)">视图</button>
      <button :class="{'active':!keshihua}" @click="changeShowType(2)">列表</button>
    </div>
    <div class="new_bar">
      <div class="left">
        <div class="icon"></div>
        消息总数：{{dataTotal}}
      </div>
      <div v-if="!showBtn"></div>
      <div class="right" v-if="showBtn">
        <div class="ck_box" :class="{checked:selectAll}" @click="piliangchuli">
          <div class="icon"></div>
          批量选择
        </div>
        <div class="sel_box">
          <select v-model="chulistate" @change="changeSate">
            <option value="1">全部</option>
            <option value="2">未处理</option>
            <option value="3">已处理</option>
          </select>
        </div>
        <div class="chuli hvr-sweep-to-right" @click="dealAll">
          <div class="icon"></div>
          一键处理
        </div>
      </div>
    </div>
    <div class="content" v-show="keshihua">
      <!-- <Content/> -->
      <div class="new_nodta" v-if="!list.length">暂时没有数据</div>
      <!-- <Item v-for="(item,index) in list" 
        :item="item" :key="index" 
        @changeOneData="changeOneData" 
        @showNew="showNew"
        @showAlert="showAlert"
        @chulihuidiao="chulihuidiao"
        @showxiangqing="showxiangqing"
      /> -->
        <new-content :list="list"
          @showNew="showNew"
          @showAlert="showAlert"
          @showxiangqing="showxiangqing"
        ></new-content>
    </div>
    <div class="new_list_wrap" v-show="!keshihua" >
      <div class="new_nodta" v-if="!list.length">暂时没有数据</div>
      
      <div class="slot-wrap" v-show="list.length">
        <div class="slot-title" style="grid-template-columns:40px repeat(11,1fr)">
            <span style=""><input type="checkbox" v-show="false"/></span>
            <span>姓名</span>
            <span>警号</span>
            <span>所属机构</span>
            <span>时间</span>
            <span>报警类型</span>       
            <span>枪支编号</span>
            <span>枪瞄编号</span>
            <span>是否处理</span>
            <span>最新位置</span>
            <span>报警位置</span>
            <span>详情</span>
        </div>
        <div class="slot-item" v-for="(item,index) in list" :key="index" style="grid-template-columns:40px  repeat(11,1fr)">
            <span><input type="checkbox" v-model="item.checked" :disabled="!!item.desc ||item.types=='001'" /></span>
            <span>{{item.policeuser.policeuser_name}}</span>
            <span>{{item.policeuser.police_number}}</span>
            <span>{{item.mechanism_name}}</span>
            <span>{{changeTime(item.created)}}</span>
            <span>{{item.type}}</span>
            <span>{{item.gun.gun_code}}</span>
            <span>{{item.IMEI}}</span>
            <span>{{item.desc? "已处理" : "未处理"}}</span>
            <span style="cursor:pointer;text-decoration:underline" @click="showNew(item)">最新位置</span>
            <span style="cursor:pointer;text-decoration:underline"  @click="showAlert({id:item.alarm_info_id,name:item.policeuser.policeuser_name,type:item.type})">报警位置</span>
            <span style="cursor:pointer;text-decoration:underline"  @click="showMore(item)">详情 </span>
        </div>
    </div>
    <!--  -->
    </div>
    <div class="check_type" v-if="false">
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
    <div v-if="this.$store.state.zaixian">
      <!-- 高德地图 -->
      <GaoDeMap v-if="gaodeshow" :arr="gaodeArr" :mes="this.alertMessage" title="" @closeMap="closeMap"/>
      <GaoDeMarkers v-if="alarmMarkArr" :arr="alarmArr" :title="alarmMarkTitle" @closeMap="closeMap"/>
    </div>
    <div class="cover" v-if="mes.IMEI">
      <div class="alert" v-if="mes.IMEI">
         <button class="close" @click="closeXiangqing">取消</button>
        <div class="del"  @click="closeXiangqing">X</div>
        <button class="chuli" v-show="mes.desc=='无'"  @click="kaishichuli">处理</button>
        <div class="txt">
          <div class="text">{{mes.mname}}</div>
          <div class="text imei" :title="mes.IMEI">{{mes.IMEI}}</div>
          <div class="text">{{mes.policeuser_name}}</div>
          <div class="text">{{mes.mobile}}</div>
          <div class="text">{{mes.gun_code}}</div>
          <div class="text">{{mes.gtype}}</div>
          <div class="text">{{mes.police_number}}</div>
          <div class="text">{{mes.type}}</div>
          <div class="text">{{mes.created}}</div>
          <div class="text" :class="`${mes.desc=='无'?' red':' green'}`">{{mes.desc=='无'?"未处理":"已处理"}}</div>
          <div class="yijian">
            <p class="tit" v-if="mes.desc=='极速处理' ||mes.desc!='无'">{{mes.desc}}</p>
            <input  v-if="mes.desc=='无'" type="text" v-model="titleStr" placeholder="请输入处理标题" />
          </div>
          <div class="biaoti">
            <!-- /v-if="content" -->
            <p >{{mes.content}}</p>
            <textarea v-if="mes.desc=='无'" v-model="textarea"  
              placeholder="请输入处理意见"  cols="24" rows="2"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!this.$store.state.zaixian">
      <!-- 离线地图 -->
      <LiXianMarkers v-if="alarmMarkArr" :arr="alarmArr" :title="alarmMarkTitle" @closeMap="closeMap"/>
      <MapMarker v-if="gaodeshow" :arr="gaodeArr" :mes="this.alertMessage" :title="alarmMarkTitle" @closeMap="closeMap"/>
    </div>
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
import GaoDeMarkers from '@/components/gaode-mark-arr.vue'
import LiXianMarkers from '@/components/lixian-mark-arr.vue'

import newContent from './children/new-content'
import getPost from '@/server/post'
export default {
  components: { breadNav, Item ,GaoDeMap,MapMarker,GaoDeMarkers,LiXianMarkers,newContent},
  data() {
    return {
      chulistate:'1',
      titleStr:'',
      textarea:'',
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
      gaodeArr:[116.397428,39.90923],
      warningType:'',
      warningOption:'',
      alarmMarkArr:false ,
      alarmArr:[] ,
      alarmMarkTitle:'' ,
      loading:null,
      zhankai:[],
      alertMessage:null,
      keshihua:'',
      xiangqing:false,
      mes:{},
      selectAll:false,
      showBtn:false,////特殊按钮的操作权限  默认不可以
    };
  },
  methods: {
    getPost,
    getQuanXian(){
      this.getPost({
        url:'/weixin/project/index.php?m=home&c=Role&a=buts'
      },(res)=>{
        if(res.data.code==200){
          let arr=res.data.data
          let has=arr.find(n=>n=='3')
          if(has){
            this.showBtn=true
          }
        }
      })
    },
    changeSate(){
      let state=this.chulistate
      if(state==1){
        this.quanbu()
      }else if(state==2){
        this.noDeal()
      }else{
        this.dealed()
      }
    },
    piliangchuli(){
      this.selectAll=!this.selectAll
      this.list.forEach(item=>{
        if(!item.desc && item.types!='08'&&item.type!='逾期报警'){
          item.checked=this.selectAll
        }
      })
    },
    showxiangqing(item){
      this.showMore(item)
    },
    closeXiangqing(){
      this.mes={}
    },
    kaishichuli(){
      if(this.titleStr.trim()&&this.textarea.trim()){
        let id=[this.message.id];
        let desc=this.titleStr
        let content=this.textarea
        this.chuLi(id, desc, content)
      }else{
        this.$message({
          type:'error',
          message:'请输入完整'
        })
      }
    },
    changeTime(timestamp) {
      var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() + " ";
      var h = date.getHours() + ":";
      var m = date.getMinutes() + ":";
      var s = date.getSeconds();
      return Y + M + D + h + m + s;
    },
    changeShowType(n){
      this.list=[]
      this.warningType=''
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
       this.activeDataList=[]
      if(n===1){
        this.keshihua=true
      }else{
        this.keshihua=false
      }
      localStorage.setItem('setKeShiHua',this.keshihua)
      let num=this.keshihua?15:19
      this.getDataList(this.activeMechanismId, 1,num)
      this.$refs.page.internalCurrentPage = 1;
    },
    changeType(){
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.list=[]
      let num=this.keshihua ?15:19
      this.getDataList(
        this.activeMechanismId,
        1,
        num,
        this.selValue,
        this.putValue,
        this.state,
        this.warningType
      );
       this.list.length ? (this.$refs.page.internalCurrentPage = 1) : null;
    },
    chulihuidiao(){
      let yeMa = this.activeYeMa || 1;
      let num=this.keshihua ?15:19
      this.getDataList(this.activeItem.mechanism_id, yeMa, num,this.warningType);
    },
    showNew(item){
      this.alarmMarkTitle=item.policeuser.policeuser_name
      this.alertMessage=`报警类型：${item.type}`
      this.gaodeArr=[item.nlongitude-0,item.nlatitude-0]
      this.gaodeshow=true
    },
    closeMap(){
      this.gaodeshow=false
      this.alarmMarkArr=false
    },
    showAlert(obj){
     this.alarmMarkTitle=obj.name
      this.getAlarmXY(obj.id)
    },
    showMore(item){
      if(item.types=='001'){
        this.$message({
          type:"error",
          message:"预期报警不支持查看详情"
        })
        return
      }
      this.getXiangqing(item.alarm_info_id)
      
    },
    getXiangqing(id){
      var key = this.$store.state.key;
      var objs = {
        alarm_info_id:id
      };
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
     params.append("alarm_info_id", objs.alarm_info_id);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=Home&c=alarm&a=info",
        method: "POST",
        changeOrigin: true,
        data: params
      })
      .then(data => {
        if (data.status == 200) {
          this.xiangqing=true;
          this.mes=data.data
        }
      })
      .catch(error => {
        console.log(error);
      });
    },
    currentChange(n) {
      //页码点击事件
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.list=[]
      let num=this.keshihua?15:19
      if (this.search) {
        this.getDataList(
          this.activeMechanismId,
          n,
          num,
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
        num,
        this.selValue,
        this.putValue,
        this.state,
        this.warningType
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
      let num=this.keshihua ?15:19
      this.message = "";
      this.state = 1; //未处理
      this.getDataList(
        this.activeItem.mechanism_id,
        1,
        num,
        this.selValue,
        this.putValue,
        this.state,
        this.warningType
      );
    },
    dealed() {
      this.message = "";
      this.state = 2; //已处理
      let num=this.keshihua ?15:19
      this.getDataList(
        this.activeItem.mechanism_id,
        1,
        num,
        this.selValue,
        this.putValue,
        this.state,
        this.warningType
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
      let num=this.keshihua ?15:19
      this.getDataList(this.activeItem.mechanism_id, 1, num,this.warningType);
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
          this.zhankai.push(data.data.data.list[0].id)
          this.zhankai.push(data.data.data.list[0].child[0].id || "")
          if(data.data.data.list[0].child[0].child){
            this.zhankai.push(data.data.data.list[0].child[0].child[0].id)
          }
          this.treeListData = data.data.data.list;
          this.rootId = data.data.data.list[0].root_id;
          this.activeItem = data.data.data.list[0];
          if (isCreate) {
            let num=this.keshihua?15:19
            this.getDataList(this.activeItem.id, 1, num);
          }
        })
        .catch(error => {
          console.log(error);
        });

    },
    getAlarmXY(aid){
      var key = this.$store.state.key;
      var objs = { aid};
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("aid", objs.aid);
      params.append("sign", sign);
      params.append("token", token);

      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=Home&c=Alarm&a=alarm_weizhi",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if(data.data){
           
            this.alarmArr=data.data
            this.alarmMarkArr=true
          }else{
            this.$message('无')
          }
          
        })
        .catch(error => {
          console.log(error);
        });
    },
    getDataList(mechanismId, p = 1, ps = 15, selValue, putValue, state,tid="") {
      // ......................获取报警列表
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      if (!mechanismId) {
        mechanismId = this.$gscookie.getCookie("mechanism_id");
      }

      var key = this.$store.state.key;
      var objs = { p: p, ps: ps, mechanism_id: mechanismId ,tid:tid};
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
      params.append("tid", objs.tid);
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
          this.loading.close()
          if (data.data.code == 200) {
            if(this.warningOption==''){
              let str='<option value="">全部类型</option>'
              data.data.data.atype.map(item=>{
                str+=`<option value="${item.id}">${item.name}</option>`
              })
              this.warningOption=str
            }
            
            this.list = data.data.data.list.map((e, i) => {
              return {
                ...e,
                checked: false,
                index: i
              };
            });
            console.log(this.list)
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
            let num=this.keshihua ?15:19
            this.getDataList(this.activeItem.mechanism_id, yeMa, num);
          }
        })
        .catch(error => {
          console.log(error);
        });

    },
    handleNodeClick(item) {
      //树形菜单点击
      
      this.list=[]
      this.list.length ? (this.$refs.page.internalCurrentPage = 1) : null;
      this.activeMechanismId = item.mechanism_id;
      this.message = "";
      this.search = false;
      this.state = "";
      this.selValue = "";
      this.putValue = "";
      this.active_title = item.mechanism_name;
      this.activeItem = item; //记录当前激活的树形菜单子项
      let num=this.keshihua?15:19
      this.getDataList(item.mechanism_id, 1, num);
      this.warningType=''
    },
    subSearch() {
      this.list=[]
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
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.serach = true;
      this.message = this.putValue;
      this.list.length ? (this.$refs.page.internalCurrentPage = 1) : null;
      let num=this.keshihua ?15:19
      this.getDataList(
        this.activeMechanismId,
        1,
        15,
        this.selValue,
        this.putValue,
        this.state
      );
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
    this.rootId = treeData[0].root_id;
    this.activeItem =treeData[0];
    let keshi=localStorage.getItem('setKeShiHua')
      this.keshihua=JSON.parse(keshi) 
    let num=this.keshihua?15:19
    this.getDataList(this.activeItem.id, 1, num);







    // this.loading = this.$loading({
    //     lock: true,
    //     text: "Loading",
    //     spinner: "el-icon-loading",
    //     background: "rgba(0, 0, 0, 0.7)"
    //   });
    this.currentNodeKey = this.$gscookie.getCookie("mechanism_id");
    let obj = this.$route.params;
    let str = this.$gscookie.getCookie("gun");
    let item = this.$gscookie.getCookie("message_obj");
    this.policeuser_id = item.id;
    let zaixian=this.$store.state.zaixian
    if (item.role_id == 3) {
      if(zaixian){
        this.$router.push({
          name: "GuiJi"
        });
      }else{
        this.$router.push({
          name: "Map"
        });
      }
      
    }
    if (JSON.stringify(str) == "{}") {
      this.$router.push("/loginput");
      return;
    }

    if (obj.one) {
      //....单个人的报警信息跳转过来的
      let num=this.keshihua?15:19
      this.getTreeList(false);
      this.getDataList(
        obj.org_id || obj.mechanism_id,
        1,
        num,
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
      console.log('走搜索')
      this.subSearch();
     
    } else {
      // this.getTreeList();
    }
  },
  mounted() {
    this.getQuanXian()
    this.$store.commit('setStr',{
      str1:'报警列表',
      str2:'情况汇总'
    })
  },
  destroyed(){
    this.$store.commit('huanyuanStr')
  }
};
</script>
