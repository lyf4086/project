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
          default-expand-all
          @node-click="handleNodeClick"
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
    <div class="page-index" v-show="false">
      <el-pagination :page-size="20" :pager-count="11" layout="prev, pager, next" :total="1000"></el-pagination>
    </div>

    <div class="content">
      <!-- <Content/> -->
      <div class="none-data" v-if="!dataArr.length">暂时没有数据......</div>
      <div class="qianggui-content" v-if="dataArr.length">
        <div class="title">弹柜总量：{{dataArr.length}}</div>
        <div class="wrap">
          <div class="list">
            <div class="item" v-for="(item,index) in dataArr" :key="index">
              <p>单位：{{item.org_name}}</p>
              <img src="../../assets/img/qingguitest.png" alt="枪柜" />
              <p>枪柜类型：{{item.vtype}}</p>
              <p>枪柜名称：{{item.vdevSN}}</p>
              <h6 @click="look(item)" style="color:#fff;">&nbsp;&nbsp;&nbsp;&nbsp;</h6>
              <button v-if="false" @click="openVidio" style="cursor:pointer">查看</button>
            </div>
          </div>
        </div>
        <div class="xiangqing-wrap" v-show="qiangguishow || vidio">
          <div class="xiangqing" v-show="qiangguishow">
            <div class="del" @click="close">X</div>
            <button class="close" @click="close">取消</button>
            <div class="content">
              <div class="nodata" v-if="!xiangqingData.length">暂无数据</div>

              <div
                class="small"
                v-for="(item,index) in xiangqingData"
                :class="{'big':item.gtype=='95式'}"
                :key="index"
              >
                <p>枪支类型：{{item.gtype}}</p>
                <div class="bg"></div>
                <div class="text" v-if="item.child">
                  <div class="a" title="警号">{{item.child.police_number}}</div>
                  <div class="b" title="持枪人">{{item.child.uname ? item.child.uname :''}}</div>
                  <div class="c" title="枪支证号" v-show="item.gun_code">{{item.gun_code}}</div>
                  <div
                    class="d"
                    title="手机号"
                    v-show="item.child.mobile"
                  >{{item.child.mobile ?item.child.mobile:''}}</div>
                </div>
                <div class="data">{{item.nStauts==1? "在位":"不在位"}}</div>
              </div>
            </div>
          </div>
          <div class="vidio" v-show="vidio">
            <button class="close" @click="closeVidio">关闭</button>
          </div>
        </div>
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
  </div>
</template>
<style scoped>
@import url(./index.css);
</style>
<script>
import breadNav from "@/components/breadnav";
// import Content from './children/content'
export default {
  components: { breadNav },
  data() {
    return {
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
      loading: null
    };
  },
  methods: {
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
      //
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
    getDataList(id) {
      //................获取枪柜列表信息函数
      var objs = {
        state: 1
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
            this.dataArr = data.data.data;
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
          this.treeListData = data.data.data.list;
        })
        .catch(error => {
          console.log(error);
        });
      this.hasData = true;
    },
    handleNodeClick(item) {
      //树形菜单点击
      this.activeMechanismId = item.id;
      this.activeItem = item; //记录当前激活的树形菜单子项
      this.active_title = item.mechanism_name;
      this.getDataList(item.id);
    },
    look(index) {
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      // this.qiangguishow=true
      this.xiangqingindex = index;
      // console.log(index.id)
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
            this.xiangqingData = data.data.data;
            console.log(data.data.data);
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
    let item = this.$gscookie.getCookie("message_obj");
    let jigou = this.$gscookie.getCookie("mechanism_id");
    this.currentNodeKey = this.$gscookie.getCookie("mechanism_id");
    this.activeMechanismId = jigou;
    if (item.role_id == 3) {
      this.$router.push({
        name: "GuiJi"
      });
    }
    this.getTreeList();
    this.getDataList();
    let str = this.$gscookie.getCookie("gun");
    if (JSON.stringify(str) == "{}") {
      this.$router.push("/loginput");
    }
    let obj = this.$route.params;
    if (obj.guncabinet_id) {
      this.qiangguishow = true;
      this.fromQiangZhi = true;
      // this.xiangqingindex=obj

      this.getXiangQing(obj.guncabinet_id);
    }
  },
  mounted() {
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
