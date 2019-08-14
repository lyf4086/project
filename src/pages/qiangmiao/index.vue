<template>
  <div class="jigou" v-if="hasData">
    <div class="tree-menu">
      <h3>枪瞄管理</h3>
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
        <breadNav title="机构管理" :next="active_title" />
      </div>
      <div class="search-wrap">
        <!--搜索框-->
        <select class="sel" v-model="selValue">
          <option value disabled selected>请选择搜索类型</option>
          <option value="IMEI">枪瞄IMEI</option>
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
        :page-size="9"
        :pager-count="9"
        layout="prev, pager, next"
        @current-change="currentChange"
        :total="pageTotal"
        ref="page"
      ></el-pagination>
    </div>
    <div class="message-box" v-show="false">
      <p>当前显示 *** {{active_title}} *** 下的枪瞄信息</p>
    </div>
    <div class="add-del" v-show="ishand">
      <button @click="alert=true">新增枪瞄</button>
      <button @click="delQiaoMiao">删除枪瞄</button>
      <button @click="modifyMiao">修改枪瞄</button>
    </div>
    <div class="content">
      <newContent
        @hehe="openMap"
        :data="qiangmiaoData"
        @changeOneD="changeOneDataZhuangTai"
        :allGunList="allGunList"
        @updataView="updataView"
        :activefujigou="active_fujigou"
        :activeyema="active_yema"
      ></newContent>
      <MapAlert :isShow="mapIsShow" :delthis="delMap" />
    </div>
    <div class="cover" v-show="alert||xiugai">
      <div class="text-wrap" v-show="alert">
        <div class="text-title">新增枪瞄</div>
        <div class="text-content">
          <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
            <el-form-item label="IMEI">
              <el-input v-model="formLabelAlign.iemi"></el-input>
            </el-form-item>
            <!-- <el-form-item label="****">
                        <el-input v-model="formLabelAlign.region"></el-input>
                    </el-form-item>
                    <el-form-item label="*****">
                        <el-input v-model="formLabelAlign.type"></el-input>
            </el-form-item>-->
          </el-form>
        </div>
        <div class="submit" @click="subAddQiangMiao">确认</div>
        <i @click="del">X</i>
      </div>
      <div v-show="xiugai" class="xiugai">
        <button class="del" @click="xiugai=false">X</button>
        <div>原名字：{{xiugaiData.IMEI}}</div>
        <div>
          新名字：
          <input type="text" v-model="xiugaiStr" />
        </div>
        <button class="sub" @click="subChange">确认修改</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import url(./index.css);
</style>
<script>
import MapAlert from "@/components/map-alert";
import breadNav from "@/components/breadnav";
import newContent from "./children/new-content";
export default {
  components: { MapAlert, breadNav, newContent },
  data() {
    return {
      hasData: false,
      alert: false,
      xiugai: false,
      xiugaiData: {},
      xiugaiStr: "",
      mapIsShow: false,
      qiangmiaoData: [], //...........当前显示的枪瞄数据
      active_title: "", //...当前显示谁的数据
      treeData: [], //树形菜单数据
      currentNodeKey: "",
      firstId: undefined, //...属性菜单第一个数据得id
      defaultProps: {
        children: "child",
        label: "mechanism_name"
      },
      active_fujigou: null, //.....当前被点击激活的机构默认为空
      labelPosition: "right",
      formLabelAlign: {
        iemi: "",
        region: "0",
        type: "0"
      },
      allGunList: [],
      putValue: "",
      selValue: "",
      pageTotal: null,
      active_yema: 1,
      ishand: false //..........是否点击了树形菜单
    };
  },
  methods: {
    updataView() {
      this.getDataList(this.active_fujigou, this.active_yema);
      this.getAllGunList(this.active_fujigou);
    },

    changeOneDataZhuangTai(n) {},
    currentChange(n) {
      //..........页码的点ji
      this.active_yema = n;
      this.getDataList(this.active_fujigou, n);
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
      var objs = {
        p: n,
        ps: "12"
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
          "http://s.tronl.cn/weixin/project/index.php?m=home&c=search&a=gunaimings",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200 && data.data.data.length != 0) {
            this.qiangmiaoData = data.data.data.list;
          }
          this.selValue = "";
          this.putValue = "";
          this.pageTotal = null;
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleNodeClick(item) {
      //.............树形菜单点击
      this.currentPage = 1;
      this.active_yema = 1;
      if (this.$refs.page) {
        this.$refs.page.internalCurrentPage = 1;
      }
      this.active_fujigou = item.mechanism_id; //...........更新当前激活的active_fujigou
      this.getDataList(this.active_fujigou); //.............获取枪瞄数据
      this.active_title = item.mechanism_name;
      this.getAllGunList(this.active_fujigou); //.............获取当前机构下所有枪支

      this.ishand = true;
    },
    add() {
      this.alert = true;
    },
    del() {
      this.alert = false;
    },
    delMap() {
      this.mapIsShow = false;
    },
    openMap() {
      this.mapIsShow = true;
    },
    addQiangMiao(imei) {
      var key = this.$store.state.key;
      var objs = { IMEI: imei, mechanism_id: this.active_fujigou }; //mechanism_id是机构id
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("IMEI", objs.IMEI);
      params.append("mechanism_id", objs.mechanism_id);

      params.append("sign", sign);
      params.append("token", token);

      this.$axios({
        url:
          "http://s.tronl.cn/weixin/project/index.php?m=home&c=gunaiming&a=rewrite",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            this.$message({ message: "添加枪瞄成功", type: "success" });
            this.getDataList(this.active_fujigou, this.active_yema); //.........更新视图
          } else if (data.data.code == 401) {
            this.$message({
              message: "添加失败！IMEI不能重复",
              type: "warning"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getDataList(jigou_id = 1, p = 1) {
      //.............................获取枪瞄列表数据函数
      var key = this.$store.state.key;
      var objs = { mechanism_id: jigou_id, p: p, ps: 9 };
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("mechanism_id", objs.mechanism_id);
      params.append("p", objs.p);
      params.append("ps", objs.ps);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          "http://s.tronl.cn/weixin/project/index.php?m=home&c=gunaiming&a=gunaimings",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          let newArr = data.data.data.list.map(e => {
            return {
              ...e,
              checked: false
            };
          });
          this.qiangmiaoData = newArr; //.............返回数据之后赋值给qiangmiaoData
          this.pageTotal = data.data.data.psum * 1;
          this.$refs.page.internalCurrentPage = p;
          // console.log(this.pageTotal);
        })
        .catch(error => {
          console.log(error);
        });
    },

    deleteData(gun_id) {
      //.........................删除枪瞄数据

      var key = this.$store.state.key;
      var objs = { gunaiming_id: gun_id };
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("gunaiming_id", objs.gunaiming_id);

      params.append("sign", sign);
      params.append("token", token);

      this.$axios({
        url:
          "http://s.tronl.cn/weixin/project/index.php?m=home&c=gunaiming&a=del",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            this.$message({ message: "删除成功", type: "success" });
            this.getDataList(this.active_fujigou, this.active_yema); //.........更新视图
          }
          if (data.data.code == 401) {
            this.$message({ message: "删除失败！请先解除绑定", type: "error" });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getTreeData(isCreate = true) {
      // ......................该组件默认加载树形菜单数据
      var key = this.$store.state.key;
      var objs = { p: 1, ps: 10 };
      var sign = this.$methods.mkSign(objs, key);

      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("p", objs.p);
      params.append("ps", objs.ps);
      // params.append('mechanism_id', objs.mechanism_id);
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
          // this.handleNodeClick(this.treeData[0]); //....主动促发一次点击事件
          this.firstId = this.treeData[0].id;
          this.hasData = true;
          this.active_fujigou = data.data.data.list[0].id;
          if (isCreate) {
            this.currentNodeKey = data.data.data.list[0].id;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    subAddQiangMiao() {
      if (!this.formLabelAlign.iemi) {
        this.$message({ message: "枪瞄不能为空", type: "warning" });
        return;
      }
      this.addQiangMiao(this.formLabelAlign.iemi);
      this.alert = false;
      this.formLabelAlign.iemi = ""; //清空iemi
    },
    delQiaoMiao() {
      let arr1 = this.qiangmiaoData.filter(e => e.checked);
      let nojiebang = arr1.find(e => e.gun_id != 0);
      if (!arr1.length) {
        this.$message("请选择要删除的枪瞄");
        return;
      }
      this.$confirm("确定要删除吗？请三思", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (nojiebang) {
            this.$message({
              message: "无法删除已绑定枪支，请先解绑后删除",
              type: "warning"
            });
            return;
          }

          let idStr = arr1.map(e => e.gunaiming_id).join(",");
          this.deleteData(idStr);
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    modifyMiao() {
      let modifyArr = this.qiangmiaoData.filter(e => e.checked);
      if (modifyArr.length == 0) {
        this.$message("请选择要删除的数据");
        return;
      } else if (modifyArr.length > 1) {
        this.$message.error("单次只能修改一个");
        return;
      }
      this.xiugai = true;
      this.xiugaiData = modifyArr[0];
    },
    subChange() {
      if (!this.xiugaiStr) {
        this.$message.error("修改后不能为空");
        return;
      }
      this.modify(this.xiugaiStr, this.xiugaiData.gunaiming_id);
    },
    modify(imei, id) {
      var key = this.$store.state.key;
      var objs = {
        IMEI: imei,
        mechanism_id: this.active_fujigou,
        gunaiming_id: id
      }; //mechanism_id是机构id
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("IMEI", objs.IMEI);
      params.append("mechanism_id", objs.mechanism_id);
      params.append("gunaiming_id", objs.gunaiming_id);
      params.append("sign", sign);
      params.append("token", token);

      this.$axios({
        url:
          "http://s.tronl.cn/weixin/project/index.php?m=home&c=gunaiming&a=rewrite",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            this.$message({ message: "修改枪瞄成功", type: "success" });
            this.xiugai = false;
            this.qiangmiaoData.find(e => {
              if (e.IMEI == this.xiugaiData.IMEI) {
                // alert(999)
                e.IMEI = this.xiugaiStr;
              }
            });
          } else if (data.data.code == 401) {
            this.$message({
              message: "添加失败！IMEI不能重复",
              type: "warning"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    bind(gun_id, miao_id) {
      //....................绑定枪支和枪瞄
      var key = this.$store.state.key;
      var objs = { gun_id: gun_id, gunaiming_id: miao_id };
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("gun_id", objs.gun_id);
      params.append("gunaiming_id", objs.gunaiming_id);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          "http://s.tronl.cn/weixin/project/index.php?m=home&c=gunaiming&a=bind",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            this.$message({ message: "绑定成功", type: "success" });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }, //......................绑定end
    unbind(gun_id, miao_id) {
      //....................解除绑定
      var key = this.$store.state.key;
      var objs = { gun_id: gun_id, gunaiming_id: miao_id };
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("gun_id", objs.gun_id);
      params.append("gunaiming_id", objs.gunaiming_id);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          "http://s.tronl.cn/weixin/project/index.php?m=home&c=gunaiming&a=unbind",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            this.$message("解除绑定成功");
          }
        })
        .catch(error => {
          console.log(error);
        });
    }, //..........................解绑end
    getAllGunList(jigou_id) {
      //................获取未绑定的枪支列表信息函数
      var key = this.$store.state.key;
      var objs = { mechanism_id: jigou_id, p: 1, ps: 10000, isbind: 1 };
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("mechanism_id", objs.mechanism_id);
      params.append("p", objs.p);
      params.append("ps", objs.ps);
      params.append("isbind", objs.isbind);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url: "http://s.tronl.cn/weixin/project/index.php?m=home&c=gun&a=guns",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          let dataArr = data.data.data.list.map(e => {
            return {
              ...e,
              opacity: "1",
              checked: false
            };
          });
          this.allGunList = dataArr;
        })
        .catch(error => {
          console.log(error);
        });
    } //................获取列表信息函数end
  },
  created() {
    let { jiGouId, yeMa } = this.$store.state;
    this.activeJiGouId = this.$gscookie.getCookie("mechanism_id");
    let item = this.$gscookie.getCookie("message_obj");
    this.currentNodeKey = this.$gscookie.getCookie("mechanism_id");
    if (item.role_id == 3) {
      this.$router.push({
        name: "GuiJi"
      });
    }
    let str = this.$gscookie.getCookie("gun");
    if (JSON.stringify(str) == "{}") {
      this.$router.push("/loginput");
    }
    if (jiGouId || yeMa) {
      this.currentNodeKey = jiGouId;
      this.activeJiGouId = jiGouId;

      this.currentPage = yeMa - 0;
      this.getTreeData(false);
      this.getDataList(jiGouId, yeMa);
      this.$store.commit("emptyNumber");
    } else {
      this.getTreeData();
      this.getDataList(this.activeJiGouId, 1);
    }
  },
  mounted() {}
};
</script>
