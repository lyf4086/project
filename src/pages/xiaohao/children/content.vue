<template>
  <div class="danyao-xiaohao">
    <div class="top-list">
      <div class="title">
        <p>弹柜总量：<slot></slot>
        </p>
        
      </div>
      <div class="item-wrap">
        <div class="none-data" v-if="!dataArr.length">暂时没有数据</div>
        <div class="item hvr-float-shadow" v-for="(item,index) in dataArr" :key="index">
          <p class="title">单位：{{item.org_name}}</p>
          <img src="../../../assets/img/qingguitest.png">
          <p>弹柜名称：{{item.vdevSN}}</p>
          <p>弹柜类型：{{item.vtype}}</p>
          <p>弹柜编号：{{item.vCaption}}</p>
          <p>弹药数量：{{item.bulletcount}}</p>
          <h6 @click="xiangqing(item)" style="color:#fff;">&nbsp;&nbsp;&nbsp;&nbsp;</h6>
        </div>
        
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
@import url(./content.css);
</style>
<script>
export default {
  props: {
    dataArr: {
      type: Array,
      default: function() {
        return [];
      }
    },
    list: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      xiangqingData: "",
      xiangqingindex: 0,
      xiangqingshow: false,
      loading:null
    };
  },
  computed: {},
  methods: {
    xiangqing(index) {
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.xiangqingindex = index;
      this.getXiangQing(index.id);
    },
    close() {
      this.xiangqingindex = 0;
      this.xiangqingshow = false;
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
    }
  },
  mounted() {
    
  }
};
</script>
