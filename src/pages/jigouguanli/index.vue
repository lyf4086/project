<template>
  <div class="jigou" v-if="hasData">
    <div class="tree-menu">
      <h3>机构管理</h3>
      <div class="nav-wrap">
        <el-tree
          :data="treeData"
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
        <breadNav title="机构管理" :next="activeHandTreeData.mechanism_name"/>
      </div>
      <div class="search-wrap">
        <!--搜索框-->
        <select class="sel" v-model="selValue">
          <option value disabled selected>请选择搜索类型</option>
          <option value="mechanism_name">机构名称</option>
          <option value="code">机构编号</option>
        </select>
        <input
          type="text"
          class="textput"
          v-model.trim="putValue"
          @keyup.13="subSearch"
          placeholder="请输入搜索关键字"
        >
        <button class="sub" @click="subSearch"></button>
      </div>
    </div>
    <div class="page-index" v-show="pageTotal">
      <el-pagination
        :page-size="6"
        :pager-count="9"
        layout="prev, pager, next"
        @current-change="currentChange"
        :total="pageTotal"
        ref="page"
      ></el-pagination>
    </div>
    <div class="message-box" v-show="false">
      <p>当前显示 *** {{activeHandTreeData.mechanism_name}} *** 下的机构信息</p>
    </div>
    <div class="add-del" v-show="activeHandTreeData">
      <button @click="addjigou">新增机构</button>
      <button @click="shanchujigou">删除机构</button>
    </div>
    <div class="content" ref="con">
      <sixItem
        :del="deleteShow"
        @deleted="yijingchanchu"
        @changeOneData="changeOneData"
        :dataList="jigoulist"
        :dataLength="jigoulist.length"
      />
    </div>
    <div class="alert" v-show="addShow">
      <div class="text-wrap">
        <div class="text-title">新增机构</div>
        <div class="text">
          <div>
            <p>机构名称</p>
            <input type="text" v-model="add_name">
          </div>
          <div>
            <p>父机构</p>
            <!--@change="selChange"-->
            <select id="selput" v-html="treeStr" v-model="add_fujigou"></select>
          </div>
          <div>
            <p>机构编号</p>
            <input type="text" v-model="add_bianhao">
          </div>
          <div>
            <p>机构描述</p>
            <input type="text" v-model="add_miaoshu">
          </div>
        </div>
        <div class="submit" @click="submitadd">确认</div>
        <div class="quxiao" @click="quxiao"></div>
      </div>
    </div>
    <div class="change" v-show="textChange1" v-if="changeData">
      <div class="dataitem" :class="{'checked':edit1}">
        <h5>机构名称：</h5>
        <div class="put-wrap">
          <span>{{changeData.mechanism_name}}</span>
          <i @click="changeText1"></i>
          <input type="text" ref="put1" @blur="edit1=false" v-model="changeData.mechanism_name">
        </div>
      </div>
      <div class="dataitem" :class="{'checked':edit2}">
        <h5>机构编号：</h5>
        <div class="put-wrap">
          <span>{{changeData.code}}</span>
          <i @click="changeText2"></i>
          <input type="text" ref="put2" @blur="edit2=false" v-model="changeData.code">
        </div>
      </div>

      <button @click="textSubmit">确定</button>
      <button @click="quxiaoxiugai">取消</button>
    </div>
    <div class="cover" v-show="textChange1||addShow"></div>
  </div>
</template>
<style scoped>
@import url(./index.css);
</style>
<script>
import topNav from "./children/topnav";
import sixItem from "./children/sixitem";
import breadNav from "@/components/breadnav";
export default {
  components: { topNav, sixItem, breadNav },
  data() {
    return {
      currentNodeKey: "1",
      activeTreeId: "",
      hasData: false,
      addShow: false,
      deleteShow: false,
      textChange1: false,
      edit1: false,
      edit2: false,
      defaultProps: {
        children: "child",
        label: "mechanism_name"
      },
      treeData: [],
      jigoulist: [], //...........当前显示的数据
      active_yema: "0", //................当前显示第几页数据
      // activeTree:[],//.............当前被点击的树形菜单
      add_name: "",
      activeHandTreeData: "", //.............当前被点击的树形菜单
      // add_root_id:'',
      add_fujigou: "0-0", //....................这里面有两个值，id和root_id
      add_bianhao: "",
      add_miaoshu: "",
      changeData: "", //...............当前正在修改的数据
      treeStr: ``, //下拉菜单字符串
      pageTotal: null,
      changeJiGou: {
        jiGouName: "",
        jiGouBianHao: ""
      },
      selValue: "",
      putValue: ""
    };
  },

  methods: {
    handleNodeClick(item) {
      this.$refs.page.internalCurrentPage = 1;
      this.currentNodeKey = item.id;
      this.activeHandTreeData = item;
      this.handClick(item.id);
    },
    subSearch() {
      if (!this.selValue) {
        this.$message({ message: "请选择搜索条件", type: "warning" });
        return;
      } else if (!this.putValue) {
        this.$message({ message: "请输入您要搜索的内容", type: "warning" });
        return;
      }
      // if(this.selValue=='mechanism_name'){
      //    this.jigouSearch(1,this.putValue)
      // }else if(this.selValue=='code'){
      //     this.jigouSearch(1,'',this.putValue)
      // }

      this.jigouSearch(1, this.putValue);
    },
    jigouSearch(n = 1, val = "") {
      let mechanism_id =
        this.activeHandTreeData.mechanism_id || this.treeData[0].mechanism_id;

      var objs = {
        p: n,
        ps: "60",
        mechanism_id: mechanism_id
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
      params.append("mechanism_id", objs.mechanism_id);
      params.append("sign", sign);
      params.append("token", token);

      this.$axios({
        url:
          "http://s.tronl.cn/weixin/project/index.php?m=home&c=mechanism&a=mechanisms",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          //  this.jigoulist=data.data.data.list         //.....返回数据赋值给当前显示的机构列表
          //  this.pageTotal=data.data.data.psum-0
          // return
          if (data.data.code == 200 && data.data.data.length != 0) {
            this.jigoulist = data.data.data.list;
          }
          // this.selValue=''
          this.putValue = "";
          this.pageTotal = null;
        })
        .catch(error => {
          console.log(error);
        });
    },
    currentChange(n) {
      //activeHandTreeData
      this.deleteShow = false;
      this.active_yema = n; //........记录当前显示第几页数据
      this.handClick(this.currentNodeKey, n);
    },
    addData() {
      let fujigouarr = this.add_fujigou.split("-");
      var key = this.$store.state.key;
      var objs = {
        mechanism_name: this.add_name,
        pid: fujigouarr[0],
        root_id: fujigouarr[1],
        code: this.add_bianhao,
        mechanism_desc: this.add_miaoshu
      };
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("mechanism_name", objs.mechanism_name);
      params.append("root_id", objs.root_id);
      params.append("pid", objs.pid);
      params.append("code", objs.code);
      params.append("mechanism_desc", objs.mechanism_desc);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          "http://s.tronl.cn/weixin/project/index.php?m=home&c=mechanism&a=rewrite",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            this.$message("添加机构成功");
            this.addShow = false;
            this.getTreeData();
            this.handClick(this.currentNodeKey, this.active_yema); //.......刷新当前页面
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    removeData(obj) {
      var token = this.$gscookie.getCookie("gun");
      var objs = { mechanism_id: obj.item.id };
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);
      var params = new URLSearchParams();
      params.append("mechanism_id", objs.mechanism_id);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          "http://s.tronl.cn/weixin/project/index.php?m=home&c=mechanism&a=del",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            this.$message("已经删除");
            let index = this.jigoulist.findIndex(e => e.id == obj.item.id);
            this.jigoulist.splice(index, 1);
          } else if (data.data.code == 402) {
            this.$message({
              message: data.data.msg,
              type: "warning"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    modifyData() {
      //.........修改数据
      var token = this.$gscookie.getCookie("gun");
      var objs = {
        mechanism_name: this.changeData.mechanism_name,
        pid: this.changeData.pid,
        Root_id: this.changeData.root_id,
        id: this.changeData.id,
        code: this.changeData.code,
        mechanism_desc: this.changeData.mechanism_desc
      };
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);
      var params = new URLSearchParams();
      params.append("mechanism_name", objs.mechanism_name);
      params.append("pid", objs.pid);
      params.append("Root_id", objs.Root_id);
      params.append("id", objs.id);
      params.append("code", objs.code);
      params.append("mechanism_desc", objs.mechanism_desc);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          "http://s.tronl.cn/weixin/project/index.php?m=home&c=mechanism&a=rewrite",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            this.$message("修改数据成功");
          }
        })
        .catch(error => {
          console.log(error);
        });
    }, //.............修改数据end
    submitadd() {
      //............................确定添加机构

      if (this.add_name.trim() == "") {
        this.$message({ message: "名字不能为空", type: "warning" });
        return;
      }
      // if(!this.add_name)return;
      if (this.add_bianhao.trim() == "") {
        this.$message({ message: "请设置机构编号", type: "warning" });
        return;
      }
      if (this.add_fujigou == "") {
        this.$message({ message: "请选择机构", type: "warning" });
        return;
      }
      if (this.add_miaoshu.trim() == "") {
        this.$message({ message: "请填写机构描述", type: "warning" });
        return;
      }

      this.addData();
      //  this.handClick()//......................................更新视图
      //.......................................刷新树形菜单

      this.add_name = "";

      this.add_fujigou = "";
      this.add_bianhao = "";
      this.add_miaoshu = "";
      this.addShow = false;
    },
    addjigou() {
      this.addShow = true;
    },
    quxiao() {
      this.addShow = false;
    },
    shanchujigou() {
      this.deleteShow = true;
    },
    yijingchanchu(item) {
      //。。。。。。。。。。。。。。。。。。。。。。点击确认删除机构
      this.deleteShow = false;

      this.removeData(item);

      //。。。。。刷新树形菜单
      this.getTreeData();
    },
    changeOneData(oneData) {
      //修改机构。。。。。接收该条数据
      this.textChange1 = true;
      this.changeData = oneData;
    },
    textSubmit() {
      //................................................确定修改机构这条数据
      this.textChange1 = false;
      this.modifyData();
    },
    quxiaoxiugai() {
      this.textChange1 = false;
    },
    changeText(item) {
      let index = this.mesArr.findIndex(e => e == item);
      this.mesArr.forEach(e => {
        if (e == item) {
          item.edit = !item.edit;
        }
      });
      this.$nextTick(() => {
        this.$refs.puts[index].focus();
      });
    },
    putBlur(item) {
      this.mesArr.forEach(e => {
        if (e == item) {
          e.edit = !e.edit;
        }
      });
    },
    handClick(id, n = 1) {
      //请求数据列表

      this.deleteShow = false;
      if (!id) return;
      var token = this.$gscookie.getCookie("gun");
      var objs = { p: n, ps: "6", mechanism_id: id };
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);
      var params = new URLSearchParams();
      params.append("p", objs.p);
      params.append("ps", objs.ps);
      params.append("mechanism_id", objs.mechanism_id);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          "http://s.tronl.cn/weixin/project/index.php?m=home&c=mechanism&a=mechanisms",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          this.jigoulist = data.data.data.list; //.....返回数据赋值给当前显示的机构列表
          this.pageTotal = data.data.data.psum - 0;
        })
        .catch(error => {
          console.log(error);
        });
    },
    changeText1() {
      this.edit1 = true;
      this.$nextTick(() => {
        this.$refs.put1.focus();
      });
    },
    changeText2() {
      this.edit2 = true;
      this.$nextTick(() => {
        this.$refs.put2.focus();
      });
    },
    getTreeData() {
      // ......................该组件默认加载树形菜单数据
      var key = this.$store.state.key;
      var objs = { p: 1, ps: 10, mechanism_id: 1 };
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
          "http://s.tronl.cn/weixin/project/index.php?m=home&c=mechanism&a=mechanisms_tree",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          this.treeData = data.data.data.list;
          // this.handClick(this.treeData[0]);
          function creatTreeStr(obj) {
            let str = "";

            if (obj.length > 0) {
              for (let i = 0; i < obj.length; i++) {
                // let levelstr = levelStr(obj[i].level);
                str += `<option value="${obj[i].id}-${obj[i].root_id}" > ${
                  obj[i].mechanism_name
                }</option>`;
                if (obj[i]["child"].length > 0) {
                  str += creatTreeStr(obj[i].child);
                }
              }
            }
            return str;
          }
          function levelStr(l) {
            var str = "";
            for (var i = 0; i < l; i++) {
              str += "&nbsp;&nbsp;";
            }
            return str;
          }
          this.treeStr = creatTreeStr(data.data.data.list); //......生成树形option字符
          this.$store.state.jigouTreeStr = this.treeStr; //....存store以备轨迹用
        })
        .catch(error => {
          console.log(error);
        });
      this.hasData = true;
    }
  },
  created() {
    this.currentNodeKey = this.$gscookie.getCookie("mechanism_id");
    this.handClick(this.currentNodeKey);
    let item = this.$gscookie.getCookie("message_obj");
    if (item.role_id == 3) {
      this.$router.push({
        name: "GuiJi"
      });
    }
    let str = this.$gscookie.getCookie("gun");
    if (JSON.stringify(str) == "{}") {
      this.$router.push("/loginput");
    }
    this.getTreeData();
  },
  mounted() {
    let that = this;
    this.$nextTick(() => {
      this.$refs.con.addEventListener("click", function(e) {
        if (e.target.className != "close") {
          that.deleteShow = false;
        }
      });
    });
  }
};
</script>
