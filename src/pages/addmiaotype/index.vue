<template>
  <div class="wrap">
    <el-button type="primary" size="small" @click="addtype">新增枪瞄类型</el-button>
    <br />
    <br />
    <div class="cell-header">
      <span>枪瞄类型</span>
      <span>属性</span>
      <span>添加时间</span>
      <span>更新时间</span>
      <span>操作</span>
    </div>
    <div class="list-item" v-for="(item,index) in datalist" :key="index">
      <span>{{item.gtypes}}</span>
      <span>{{item.type==1?'长枪':'短枪'}}</span>
      <span>{{item.addtime}}</span>
      <span>{{item.uptime}}</span>
      <span>
        <el-button type="primary" circle size="mini" @click="editOne(item)" icon="el-icon-edit"></el-button>
        <el-button type="primary" circle size="mini" @click="deleteOne(item)" icon="el-icon-delete"></el-button>
      </span>
    </div>
    <!-- //////////// -->
    <el-pagination
      layout="prev, pager, next"
      @current-change="currentChange"
      :page-size="pageSize"
      :total="total"
    ></el-pagination>
    <!-- /////////// -->
    <div class="cover" v-show="uploadshow">
      <div class="up-pic" v-if="uploadshow">
        <div class="del" @click="close">X</div>
        <div class="cell">
          <span>类型名称：</span>
          <el-input v-model="mtype" placeholder="请输入内容"></el-input>
        </div>
        <div class="cell">
          <span>枪瞄属性：</span>
          <el-select v-model="mname" placeholder="请选择">
            <el-option label="长枪" value="1"></el-option>
            <el-option label="短枪" value="2"></el-option>
          </el-select>
        </div>

        <el-button type="primary" class="sub" @click="sub">提交</el-button>
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
@import url("./index.css");
</style>
<script>
import getData from "./post";
export default {
  data() {
    return {
      mtype: "",
      mname: "",
      editID: "",
      datalist: [],
      total: 0,
      uploadshow: false,
      pageSize: 12
    };
  },
  methods: {
    getData,
    currentChange(n) {
      this.newData(n);
    },
    deleteOne(item) {
      this.$alert("确定删除这条数据吗", "操作警告", {
        confirmButtonText: "确定",
        callback: action => {
          if (action == "confirm") {
            this.getData(
              {
                url: "/weixin/project/index.php?m=home&c=qtype&a=dels",
                data: { id: item.id }
              },
              data => {
                if (data.data.code == 200) {
                  this.newData();
                  this.close();
                }
              }
            );
          } else {
            this.$message("取消操作");
          }
        }
      });
    },
    editOne(item) {
      this.uploadshow = true;
      this.mtype = item.gtypes;
      this.mname = item.type;
      this.editID = item.id;
    },
    addtype() {
      this.uploadshow = true;
    },
    close() {
      this.uploadshow = false;
      this.mtype = "";
      this.mname = "";
      this.editID = "";
    },
    sub() {
      let gtypes = this.mtype.trim();
      let type = this.mname;
      if (gtypes != "" && type != "") {
        this.addData(gtypes, type, this.editID);
      } else {
        this.$message.warning("有必填信息未填");
      }
    },
    addData(gtypes, type, id) {
      this.getData(
        {
          url: "/weixin/project/index.php?m=home&c=qtype&a=saves",
          data: { type, gtypes, id }
        },
        data => {
          if (data.data.code == 200) {
            this.$message.success("成功");
            this.uploadshow = false;
            this.getData(
              {
                url: "/weixin/project/index.php?m=home&c=qtype&a=lists",
                data: { p: 1, ps: 20 }
              },
              data => {
                if (data.data.code == 200) {
                  this.datalist = data.data.data.rs;
                  this.total = data.data.total - 0;
                }
              }
            );
          }
        }
      );
    },
    newData(p = 1) {
      this.getData(
        {
          url: "/weixin/project/index.php?m=home&c=qtype&a=lists",
          data: { p: p, ps: this.pageSize }
        },
        data => {
          if (data.data.code == 200) {
            this.datalist = data.data.data.rs;
            this.total = data.data.data.total - 0;
          }
        }
      );
    }
  },
  created() {
    // this.mes = this.$gscookie.getCookie("message_obj");
    // this.userId.id = this.mes.id;
    this.getData(
      {
        url: "/weixin/project/index.php?m=home&c=qtype&a=lists",
        data: { p: 1, ps: this.pageSize }
      },
      data => {
        if (data.data.code == 200) {
          this.datalist = data.data.data.rs;
          this.total = data.data.data.total - 0;
        }
      }
    );
  },
  mounted() {
    this.$store.commit("setStr", {
      str1: "新增枪瞄类型",
      str2: "数据列表"
    });
  },
  destroyed() {
    this.$store.commit("huanyuanStr");
  }
};
</script>