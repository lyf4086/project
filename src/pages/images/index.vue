<template>
  <div class="wrap">
    <el-button type="primary" size="small" @click="upshow">上传图片</el-button>
    <br />
    <br />
    
    <div class="cell-header">
      <span>添加时间</span>
      <span>类型</span>
      <span>名称</span>
      <span>更新时间</span>
      <span>操作</span>
    </div>
    <div class="list-item" v-for="(item,index) in datalist" :key="index">
      <span>{{item.addtime}}</span>
      <span>{{item.type==1?'枪支':'枪瞄'}}</span>
      <span>{{item.name||''}}</span>
      <span>{{item.uptime}}</span>
      <span @click="showPic(item)" style="cursor:pointer">预览</span>
    </div>
    <!-- //////////// -->
    <el-pagination
      layout="prev, pager, next"
      @current-change="currentChange"
      :page-size="pageSize"
      :total="total"
    ></el-pagination>
    <div class="cover" v-show="uploadshow||imageShow">
        <div class="imgwrap" v-if="imageShow">
            <div class="del" @click="imageShow=false">X</div>
            <img :src="imgSrc" alt="" srcset="">
        </div>
      <div class="up-pic" v-if="uploadshow">
        <div class="del" @click="close">X</div>
        <el-button-group>
          <el-button :type="active==0?'primary':''" @click="changeType(0)">枪支图片</el-button>
          <el-button :type="active==1?'primary':''" @click="changeType(1)">枪瞄图片</el-button>
        </el-button-group>
        <br />
        <br />

        <el-select class="sel" size="medium" v-model="qz" v-show="active==0" placeholder="请选择">
          <el-option
            v-for="item in qiangzhi"
            :key="item.ID"
            :label="`${item.vQXingHao}-${item.vQZhongLei}`"
            :value="item.ID"
          ></el-option>
        </el-select>
        <el-select v-model="qm" size="medium" v-show="active==1" placeholder="请选择">
          <el-option
            v-for="item in qiangmiao"
            :key="item.id"
            :label="`${item.gtypes}`"
            :value="item.id"
          ></el-option>
        </el-select>
        <br /><br />

        <el-upload
          class="avatar-uploader"
          :action="uploadImgURL"
          :show-file-list="false"
          :data="userId"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
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
        base:this.$store.state.baseURL,
      uploadImgURL:
        this.$store.state.baseURL +
        "/weixin/project/index.php?m=home&c=Policeuser&a=uploads",
      active: 0,
      options: [],
      qz: "",
      qm: "",
      fileList: [],
      userId: {
        id: ""
      },
      imageUrl: "",
      mes: null,
      qiangzhi: [],
      qiangmiao: [],
      commitSrc: "",
      datalist: [],
      upPic: true,
      currentPage: 1,
      pageSize: 15,
      total: 0,
      uploadshow: false,
      imgSrc:'',
      imageShow:false
    };
  },
  methods: {
    getData,
    showPic(item){
        this.imageShow=true
        this.imgSrc=this.base+item.src
    },
    upshow() {
      this.uploadshow = true;
    },
    close(){
         this.uploadshow = false;
         this.commitSrc = "";
                this.imageUrl = "";
                this.qz = "";
                this.qm = "";
    },
    currentChange(n) {
      this.currentPage = n;
      this.getData(
        {
          url: "/weixin/project/index.php?m=home&c=img&a=lists",
          data: { p: this.currentPage, ps: this.pageSize }
        },
        data => {
          if (data.data.code == 200) {
            this.qiangzhi = data.data.data.qz;
            this.qiangmiao = data.data.data.qm;
            this.datalist = data.data.data.rs;
            this.total = data.data.data.total - 0;
          }
        }
      );
    },
    changeType(n) {
      this.active = n;
      this.imageUrl = "";
      this.commitSrc = "";
    },
    sub() {
      let commitSrc = this.commitSrc;
      let qz = this.qz;
      let qm = this.qm;
      if (this.active === 0) {
        if (qz != "" && commitSrc != "") {
            let name=this.qiangzhi.find(item=>item.ID==qz).vQXingHao
          this.$router.go(0);
          this.getData(
            {
              url: "/weixin/project/index.php?m=home&c=img&a=saves",
              data: {
                type: 1, //枪支
                src: commitSrc,
                cid: qz,
                name:name
              }
            },
            res => {
              if (res.data.code == 200) {
                this.$message.success(res.data.msg);
                this.commitSrc = "";
                this.imageUrl = "";
                this.qz = "";
                this.qm = "";
                this.uploadshow = false;
                this.getData(
                  {
                    url: "/weixin/project/index.php?m=home&c=img&a=lists",
                    data: { p: this.currentPage, ps: this.pageSize }
                  },
                  data => {
                    if (data.data.code == 200) {
                      this.qiangzhi = data.data.data.qz;
                      this.qiangmiao = data.data.data.qm;
                      this.datalist = data.data.data.rs;
                      this.total = data.data.data.total - 0;
                    }
                  }
                );
              } else {
                this.$message.error(res.data.msg);
              }
            }
          );
        } else {
          this.$message.warning("请选择枪支图片");
        }
      } else {
        //为1时候 为上传枪瞄图片
        if (qm != "" && commitSrc != "") {
          let name=this.qiangmiao.find(item=>item.id==qm).gtypes
          this.getData(
            {
              url: "/weixin/project/index.php?m=home&c=img&a=saves",
              data: {
                type: 2, //枪瞄
                src: commitSrc,
                cid: qm,
                name:name
              }
            },
            res => {
              if (res.data.code == 200) {
                this.$message.success(res.data.msg);
                this.commitSrc = "";
                this.imageUrl = "";
                this.qz = "";
                this.qm = "";
                this.uploadshow = false;
                this.getData(
                  {
                    url: "/weixin/project/index.php?m=home&c=img&a=lists",
                    data: { p: this.currentPage, ps: this.pageSize }
                  },
                  data => {
                    if (data.data.code == 200) {
                      this.qiangzhi = data.data.data.qz;
                      this.qiangmiao = data.data.data.qm;
                      this.datalist = data.data.data.rs;
                      this.total = data.data.data.total - 0;
                      console.log(this.datalist);
                    }
                  }
                );
              } else {
                this.$message.error(res.data.msg);
              }
            }
          );
          this.$router.go(0);
        } else {
          this.$message.warning("请选择枪瞄图片");
        }
      }
    },
    handleAvatarSuccess(res, file) {
      // console.log(res, "file", file);
      this.commitSrc = res[0].icon;
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      var obj = this.userId;
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(obj, key);
      var token = this.$gscookie.getCookie("gun");
      this.userId.sign = sign;
      this.userId.token = token;

    }
  },
  created() {
    
    this.mes = this.$gscookie.getCookie("message_obj");
    this.userId.id = this.mes.id;
    this.getData(
      {
        url: "/weixin/project/index.php?m=home&c=img&a=lists",
        data: { p: this.currentPage, ps: this.pageSize }
      },
      data => {
        if (data.data.code == 200) {
          this.qiangzhi = data.data.data.qz;
          this.qiangmiao = data.data.data.qm;
          this.datalist = data.data.data.rs;
          this.total = data.data.data.total - 0;
        }
      }
    );
  },
  mounted(){
      this.$store.commit("setStr", {
      str1: "武器图片",
      str2: "数据列表"
    });
  },
  destroyed() {
    this.$store.commit("huanyuanStr");
  }
};
</script>