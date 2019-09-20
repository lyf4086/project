<template>
  <div class="jigou" v-if="hasData">
    <div class="tree-menu">
      <h3>人员管理</h3>
      <div class="nav-wrap">
        <el-tree
          :data="treeListData"
          :props="defaultProps"
          accordion
          :highlight-current="true"
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
        <breadNav title="人员管理" :next="activeItem.mechanism_name" />
      </div>
      <div class="search-wrap">
        <!--搜索框-->
        <select class="sel" v-model="selValue">
          <option value disabled selected>请选择搜索类型</option>
          <option value="uname">警员名称</option>
          <option value="robcode">持枪证号</option>
          <option value="police_number">警号</option>
          <option value="id_number">身份证号</option>
          <option value="mobile">电话号码</option>
        </select>
        <input
          type="text"
          class="textput"
          v-model="putValue"
          placeholder="请输入搜索关键字"
          @keyup.13="subSearch"
        />
        <button class="sub" @click="subSearch"></button>
      </div>
    </div>
    <div class="page-index" v-show="pageTotal">
      <el-pagination
        :page-size="6"
        :pager-count="9"
        :current-page="currentPage"
        layout="prev, pager, next"
        @current-change="currentChange"
        :total="pageTotal"
        ref="page"
      ></el-pagination>
    </div>
    <div class="message-box" v-show="false">
      <p>当前显示 *** {{activeItem.mechanism_name}} *** 下的人员信息</p>
    </div>
    <div class="add-del" v-show="activeItem" v-if="sync !=1">
      <button @click="add">新增人员</button>
      <button @click="delOneData">删除人员</button>
    </div>
    <div class="check-type" v-if="0">同步数据</div>
    <div class="content">
      <Content
        :list="itemList"
        :isRemoving="isRemoveimg"
        @delThis="clickOneDataToRemove"
        @quxiaoshanchu="quxiaoshanchu"
        :showXiangqing="showXiangqing"
        :activeYeMa="active_yema"
        :activeTreeId="activeTreeId"
        :sync="sync"
        :roles="roles"
        @shuaxin="shuaxin"
      />
    </div>
    <div class="alert" v-show="alert">
      <div class="text-wrap">
        <div class="text-title">新增人员</div>
        <div class="text-content">
          <div>
            <span>名称:</span>
            <input type="text" v-model="addPerson.uname" />
          </div>
          <div>
            <span>手机号:</span>
            <input type="text" v-model="addPerson.mobile" ref="phoneput" />
          </div>
          <div>
            <span>性别:</span>
            <select v-model="addPerson.sex">
              <option value="1">男</option>
              <option value="2">女</option>
            </select>
          </div>

          <div>
            <span>持枪证到期时间:</span>
            <input type="date" v-model="addPerson.robcode_endtime" />
          </div>
          <div>
            <span>警号:</span>
            <input type="text" v-model="addPerson.police_number" />
          </div>
          <div>
            <span>角色:</span>
            <!--<input type="text"  v-model="addPerson.role_id"/>-->
            <select v-model="addPerson.role_id">
              <option value="1">系统管理员</option>
              <option value="2">枪支管理员</option>
              <option value="3">用枪员</option>
              <option value="4">领导</option>
            </select>
          </div>
        </div>
        <div class="btnwrap">
          <button class="submit" @click="addOnePerson">确认</button>
          <button @click="quxiao">取消</button>
        </div>
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
export default {
  components: { LeftNav, Content, breadNav },
  data() {
    return {
      hasData: false,
      alert: false,
      currentNodeKey: "",
      activeItem: "", //当前被点击的树形菜单数据
      activeTreeId: "",
      active_yema: "0", //当前页码
      treeListData: [], //树形菜单数据
      defaultProps: {
        //树形菜单配置字段
        children: "child",
        label: "mechanism_name"
      },
      itemList: [], //content子项数据
      addPerson: {
        uname: "",
        mobile: "",
        sex: "",
        robcode_endtime: "", //日期选择器数据 持枪证到期时间
        police_number: "",
        // police_rank:'',
        role_id: ""
        //    mechanism_id:'164'
      },
      pageTotal: null,
      isRemoveimg: false, //记录是不是在删除操作
      selValue: "",
      putValue: "",
      showXiangqing: false,
      currentPage: 0,
      sync: 0, //动静态区分，默认静态，1为动态
      roles:[]
    };
  },
  methods: {
    shuaxin(){
      let yema=this.active_yema||1
      this.clickTree(this.activeItem.mechanism_id,yema );
    },
    quxiaoshanchu() {
      this.isRemoveimg = false;
    },
    currentChange(n) {
      //..............小叶码点击事件
      this.active_yema = n;
      this.isRemoveimg = false;
      this.clickTree(this.activeTreeId, n);
    },
    add() {
      this.alert = true;
    },
    quxiao() {
      this.alert = false;
    },
    subSearch() {
      if (!this.selValue) {
        this.$message({ message: "请选择搜索条件", type: "warning" });
        return;
      } else if (!this.putValue) {
        this.$message({ message: "请输入您要搜索的内容", type: "warning" });
        return;
      }

      this.search(1, this.putValue);
    },
    search(n = 1, val = "") {
      let that = this;
      var objs = {
        p: n,
        ps: "60"
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
          "/weixin/project/index.php?m=home&c=search&a=policeusers",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200 && data.data.data.length != 0) {
            this.itemList = data.data.data.list;
          }
          this.selValue = "";
          this.putValue = "";
          this.pageTotal = null;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getTreeList(jiGouId, yeMa) {
      // ......................该组件默认加载树形菜单数据
      var key = this.$store.state.key;
      var objs = { p: 1, ps: 6, mechanism_id: 1 };
      var sign = this.$methods.mkSign(objs, key);
      // var token=this.$store.state.token;
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
          if (jiGouId) {
            this.clickTree(jiGouId, yeMa);
          } else {
            this.activeTreeId = data.data.data.list[0].mechanism_id;
            this.activeItem=data.data.data.list[0]
            this.clickTree(this.treeListData[0].mechanism_id, 1);
          }
        })
        .catch(error => {
          console.log(error);
        });
      this.hasData = true;
    },
    handleNodeClick(item) {
      //树形菜单点击
      this.$refs.page.internalCurrentPage = 1;
      this.isRemoveimg = false;
      this.active_yema = 0;
      this.activeItem = item;
      this.activeTreeId = item.id; //记录当前激活的树形菜单子项
      this.clickTree(this.activeItem.mechanism_id, 1);
    },
    addOnePerson() {
      //。。。。。。添加人员
      // console.log(this.addPerson);
      for (let item in this.addPerson) {
        if (this.addPerson[item].trim() == "") {
          this.$message({
            type: "warning",
            message: "有未填选项"
          });
          return;
        }
      }

      // .......................................!!!!!!!!!!!!!!!!'robcode_endtime'还是死数据
      var token = this.$gscookie.getCookie("gun");
      var objs = {
        uname: this.addPerson.uname,
        mobile: this.addPerson.mobile,
        sex: this.addPerson.sex,
        robcode_endtime: this.addPerson.robcode_endtime,
        police_number: this.addPerson.police_number,
        role_id: this.addPerson.role_id,
        mechanism_id: this.activeItem.mechanism_id
      };
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);

      var params = new URLSearchParams();
      params.append("uname", objs.uname);
      params.append("mobile", objs.mobile);
      params.append("sex", objs.sex);
      params.append("robcode_endtime", objs.robcode_endtime);
      params.append("police_number", objs.police_number);
      // params.append('police_rank', objs.police_rank);
      params.append("role_id", objs.role_id);
      params.append("mechanism_id", objs.mechanism_id);

      params.append("sign", sign);
      params.append("token", token);

      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=policeuser&a=rewrite",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == "200") {
            this.alert = false;
            this.clickTree(this.activeItem.mechanism_id, this.active_yema); //................更新视图
            for (let e in this.addPerson) {
              this.addPerson[e] = "";
            }
            // if(this.itemList.length==6){
            //   this.clickTree(this.activeItem,this.active_yema+1)
            // }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    clickTree(mechanismId, p) {
      //...........................点击树形菜单获取列表数据

      var key = this.$store.state.key;
      var objs = { mechanism_id: mechanismId, p: p, ps: 6 };
      var sign = this.$methods.mkSign(objs, key);
      // var token=this.$store.state.token;
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
          this.roles=data.data.roles
          this.itemList = data.data.data.list.map(e => {
            return {
              ...e,
              zhuangtai: 1,
              put1show: false,
              put2show: false,
              put3show: false
            };
          });

          this.pageTotal = data.data.data.psum - 0; //获取页码总数
        })
        .catch(error => {
          console.log(error);
        });
    },
    delOneData() {
      //.........................点击删除人员
      if (!this.itemList.length) return; //如果当前没有展示数据则返回
      this.isRemoveimg = true;
    },
    clickOneDataToRemove(item) {
      //...........点击选择要删除的数据
      this.$confirm("此操作将永久删除该人员, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var key = this.$store.state.key;
          var objs = { policeuser_id: item.policeuser_id };
          var sign = this.$methods.mkSign(objs, key);
          var token = this.$gscookie.getCookie("gun");
          var params = new URLSearchParams();
          params.append("policeuser_id", objs.policeuser_id);
          params.append("sign", sign);
          params.append("token", token);
          this.$axios({
            url:
              this.$store.state.baseURL +
              "/weixin/project/index.php?m=home&c=policeuser&a=del",
            method: "POST",
            changeOrigin: true,
            data: params
          })
            .then(data => {
              if (data.data.code == 200) {
                this.$message({
                  type: "success",
                  message: "已删除"
                });
                this.isRemoveimg = false; //........还原删除状态
                let index = this.itemList.findIndex(
                  e => e.policeuser_id == item.policeuser_id
                );
                this.itemList.splice(index, 1);
                if (!this.itemList.length) {
                  //......如果当前页面被删除空了，调到上一页
                  this.clickTree(
                    this.activeItem.mechanism_id,
                    this.active_yema - 1
                  );
                }
              }
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          this.isRemoveimg = false;
          return;
        });

      // if (!confirm("确定要删除该人员吗 ？请三思！")) {
      //   this.isRemoveimg = false;
      //   return;
      // } else {
      //   //................执行删除操作

      //   var key = this.$store.state.key;
      //   var objs = { policeuser_id: item.policeuser_id };
      //   var sign = this.$methods.mkSign(objs, key);

      //   var token = this.$gscookie.getCookie("gun");
      //   var params = new URLSearchParams();
      //   params.append("policeuser_id", objs.policeuser_id);

      //   params.append("sign", sign);
      //   params.append("token", token);

      //   this.$axios({
      //     url:
      //       "http://s.tronl.cn/weixin/project/index.php?m=home&c=policeuser&a=del",
      //     method: "POST",
      //     changeOrigin: true,
      //     data: params
      //   })
      //     .then(data => {
      //       if (data.data.code == 200) {
      //         this.isRemoveimg = false; //........还原删除状态
      //         let index = this.itemList.findIndex(
      //           e => e.policeuser_id == item.policeuser_id
      //         );
      //         this.itemList.splice(index, 1);
      //         if (!this.itemList.length) {
      //           //......如果当前页面被删除空了，调到上一页
      //           this.clickTree(
      //             this.activeItem.mechanism_id,
      //             this.active_yema - 1
      //           );
      //         }
      //       }
      //     })
      //     .catch(error => {
      //       console.log(error);
      //     });
      // }
    } //..................删除人员结束
  },
  created() {
    this.sync = this.$gscookie.getCookie("sync");
    this.currentNodeKey = this.$gscookie.getCookie("mechanism_id");
    let obj = this.$store.state;
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
    if (obj.jiGouId) {
      this.currentNodeKey = obj.jiGouId;
      this.currentPage = obj.yeMa - 0;
      this.activeTreeId = obj.jiGouId;
      this.getTreeList(obj.jiGouId, obj.yeMa);
      this.$store.commit("emptyNumber");
    } else {
      this.getTreeList();
    }
  },
  mounted() {
    let that = this;
    let re = /^1[34578]\d{9}$/;
    this.$refs.phoneput.onblur = function() {
      let num = this.value;
      if (!re.test(num)) {
        that.$message("手机号码格式不正确");
        this.focus();
      }
    };
  }
};
</script>
