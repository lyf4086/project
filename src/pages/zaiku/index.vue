<template>
  <div class="danyao">
    <div class="tree-menu">
      <h3>弹药管理</h3>
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
        <breadNav title="弹药在库" :next="active_title" />
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
    <div class="page-index">
      <el-pagination
        :page-size="pageSize"
        :pager-count="9"
        layout="total,prev, pager, next"
        @current-change="currentChange"
        :total="pageTotal"
        ref="page"
      ></el-pagination>
    </div>

    <div class="content" v-show="keshihua">
      <!-- <Content :dataArr="dataList" :list="liebiao">{{pageTotal}}</Content> -->
      <div class="new_nodta" v-if="!dataList.length">暂时没有数据</div>
      <div class="newdatalist">
        <div class="tit">弹柜总量：{{pageTotal}}</div>
        <div class="data_item hvr-float-shadow" v-for="item in dataList" :key="item.id">
          <div class="top">{{item.org_name}}</div>
          <div class="con">
            <div class="img_wrap">
              <img src="../../assets/qianggui/guizi1.png" alt srcset />
            </div>
            <div class="text_floor">
              弹柜名称：
              <span>{{item.vCaption}}</span>
            </div>
            <div class="text_floor">
              弹柜类型：
              <span>{{item.vtype}}</span>
            </div>
            <div class="text_floor">
              弹柜编号：
              <span>{{item.vdevSN}}</span>
            </div>
            <div class="text_floor">
              弹药数量：
              <span>{{item.bulletcount}}</span>
            </div>
            <div class="look_info" @click="showinfo(item)">查看详情</div>
          </div>
        </div>
      </div>
      <!--  -->
    </div>

    <div class="new_change_type">
      <button :class="{'active':keshihua}" @click="changeShowType(1)">视图</button>
      <button :class="{'active':!keshihua}" @click="changeShowType(2)">列表</button>
    </div>
    <div class="new_list_wrap" v-show="!keshihua">
      <div class="new_nodta" v-if="!dataList.length">暂时没有数据</div>
      <div class="tit2">弹柜总量：{{pageTotal}}</div>

      <div class="slot-wrap" v-if="dataList.length">
        <div class="slot-title" style="grid-template-columns: repeat(6,1fr)">
          <span>单位</span>
          <span>弹柜名称</span>
          <span>弹柜类型</span>
          <span>弹柜编号</span>
          <span>弹药数量</span>
          <span>操作</span>
        </div>
        <div
          class="slot-item"
          v-for="(item,index) in dataList"
          :key="index"
          style="grid-template-columns: repeat(6,1fr)"
        >
          <span>{{item.org_name}}</span>
          <span>{{item.vdevSN}}</span>
          <span>{{item.vtype}}</span>
          <span>{{item.vCaption}}</span>
          <span>{{item.bulletcount}}</span>
          <span style="cursor:pointer;text-decoration:underline" @click="showinfo(item)">详情</span>
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
    <div class="xiangqing-wrap" v-show="xiangqingshow">
      <div class="new-xiangqing" v-show="xiangqingshow">
        <div class="close" @click="close"></div>
        <div class="quxiao" @click="close">取消</div>
        <div class="new_tit">弹药详情</div>
        <div class="new-main">
          <div class="left">
            <img src="../../assets/img/qingguitest.png" alt srcset />
            <div class="dipan"></div>
          </div>
          <div class="right">
            <div class="box_wrap">
              <div class="box_list" :class="`active${activeNumber}`">
                <div class="box_item" v-for="(arr,index) in bannerList" :key="index">
                  <div class="box" v-for="(item,i) in arr" :key="i">
                    <div class="box_main">
                      <span>
                        <div class="icon"></div>
                      </span>
                      <span>
                        <i>抽屉编号</i>
                        <br />
                        <strong>{{item.vLabel}}号</strong>
                      </span>
                      <span>
                        <i>弹药名称</i>
                        <br />
                        <strong>{{item.bullname}}</strong>
                      </span>
                      <span>
                        <i>弹药类型</i>
                        <br />
                        <strong>{{item.bulletType}}</strong>
                      </span>
                      <span>
                        <i>弹药数量</i>
                        <br />
                        <strong>{{item.bulletcount}}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="index_wrap">
              <i
                @click="newChangeIndex(index)"
                :class="{'active':activeIndex==index}"
                v-for="(item,index) in bannerList"
                :key="index"
              ></i>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="xiangqing" v-if="false">
        <p class="title">弹药详情</p>
        <div class="content">
          <div class="cabinet">
            <div class="item" v-for="(item,index) in activeData" :key="index">
              <div class="text">
                <p>弹药名称：{{item.bullname}}</p>
                <p>弹药类型：{{item.bulletType}}</p>
                <p>弹药数量：{{item.bulletcount}}</p>

                <div class="line">
                  <div class="dian"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="chassis">
            <div class="up"></div>
            <div class="down"></div>
          </div>
        </div>
        <button class="close" @click="close">取消</button>
        <button class="del" @click="close">X</button>
      </div> -->
    </div>
  </div>
</template>
<style scoped>
@import url(./index.css);
@import url(../xiaohao/newstyle.css);
@import url(./newxq.css);
</style>
<script>
import breadNav from "@/components/breadnav";
import Content from "./children/content";
export default {
  components: { breadNav, Content },
  data() {
    return {
      keshihua: true,
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
      zhankai: [],
      loading: null,
      pageSize: 1,
      pageTotal: 0,
      xiangqingshow: false,
      xiangqingData: {},
      activeData: [],
      indexNum: 0,
      activeIndex: 0,
      timer: null,
      late5: null,
      activeNumber: 0,
      bannerList: []
    };
  },
  methods: {
    newChangeIndex(n) {
      this.activeNumber = n;
      this.activeIndex = n;
      this.autoChange();
    },
    autoChange() {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.activeNumber =
          this.activeNumber >= this.bannerList.length - 1
            ? 0
            : ++this.activeNumber;
        this.activeIndex = this.activeNumber;
      }, 4000);
    },
    close() {
      this.activeData = [];
      this.xiangqingshow = false;
      this.activeIndex = 0;
      clearInterval(this.timer);
      this.timer = null;
    },
    showinfo(item) {
      this.getXiangQing(item.id);
    },
    currentChange(n) {
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.getDataList(this.activeItem.id, n, this.pageSize);
    },
    changeShowType(n) {
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.dataList.length = 0;
      if (n === 1) {
        this.keshihua = true;
        this.pageSize = 12;
        this.getDataList(this.activeItem.id, 1, this.pageSize);
      } else {
        this.keshihua = false;
        this.pageSize = 19;
        this.getDataList(this.activeItem.id, 1, this.pageSize);
      }
      localStorage.setItem("setKeShiHua", this.keshihua);

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
      this.search(this.activeMechanismId);
    },
    getXiangQing(id) {
      //................详情信息函数
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
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
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=Bulletlist&a=index",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            this.loading.close();
            this.xiangqingData = data.data.data.sort(
              (a, b) => a.vLabel - b.vLabel
            );
            let bannerList = [];
            let fenshu = Math.ceil(this.xiangqingData.length / 5);
            for (let i = 0; i < fenshu; i++) {
              bannerList.push(this.xiangqingData.slice(i * 5, (i + 1) * 5));
            }
            this.bannerList = bannerList;
            this.autoChange();
            if (!this.xiangqingData.length) {
              this.$message("暂无数据");
              this.xiangqingshow = false;
            } else {
              this.xiangqingshow = true;
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getTreeList(id) {
      // ......................该组件默认加载树形菜单数据
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
          if (data.data.code == 200) {
            this.zhankai.push(data.data.data.list[0].id);
            this.zhankai.push(data.data.data.list[0].child[0].id || "");
            if (data.data.data.list[0].child[0].child) {
              this.zhankai.push(data.data.data.list[0].child[0].child[0].id);
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
      this.dataList = [];
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.activeItem = item; //记录当前激活的树形菜单子项
      this.activeMechanismId = item.id;
      this.active_title = item.mechanism_name;
      this.getDataList(item.id, 1, this.pageSize);
    },
    getDataList(jigou_id, page = 1, ps = this.pageSize) {
      //................弹药在库列表信息函数
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      var key = this.$store.state.key;
      var objs = { page, ps };
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
          this.loading.close();
          if (data.data.code == 200) {
            this.dataList = data.data.data;
            this.liebiao = data.data.dat;
            this.pageTotal = data.data.total;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    search(MechanismId) {
      var key = this.$store.state.key;
      var objs = {
        mechanism_id: MechanismId,
        page: 1
      };
      let selV = this.selValue;
      objs[selV] = this.putValue;
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append(selV, objs[selV]);
      params.append("page", objs.page);
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
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },

  created() {
    let keshi = localStorage.getItem("setKeShiHua");
    this.keshihua = JSON.parse(keshi);
    this.pageSize = this.keshihua ? 12 : 19;
    let treeData = JSON.parse(sessionStorage.getItem("tree-list"));
    this.zhankai.push(treeData[0].id);

    if (!!treeData[0].child.length) {
      this.zhankai.push(treeData[0].child[0].id || "");
      if (!!treeData[0].child[0].child.length) {
        this.zhankai.push(treeData[0].child[0].child[0].id);
      }
    }
    this.treeListData = treeData;

    let item = this.$gscookie.getCookie("message_obj");
    this.currentNodeKey = this.$gscookie.getCookie("mechanism_id");
    if (item.role_id == 3) {
      this.$router.push({
        name: "GuiJi"
      });
    }
    let jigou = this.$gscookie.getCookie("mechanism_id");
    this.activeMechanismId = jigou;
    this.getDataList(jigou);
    let str = this.$gscookie.getCookie("gun");
    if (JSON.stringify(str) == "{}") {
      this.$router.push("/loginput");
    }
  },
  mounted() {
    this.$store.commit("setStr", {
      str1: "弹药在库",
      str2: "情况汇总"
    });
  },
  destroyed() {
    this.$store.commit("huanyuanStr");
  }
};
</script>
