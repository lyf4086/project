<template>
  <div class="shangchuan">
    <div class="top-bar">
      <span>
        <input type="checkbox" v-model="allCheck" />
      </span>
      <span>警员姓名</span>
      <span>警员编号</span>
      <span>枪支编号</span>
      <span>文件名</span>
      <span>单位</span>
      <span>上传人</span>
      <span>上传时间</span>
    </div>
    <div class="none-data" v-if="!dataArr.length">暂时没有数据</div>
    <ul class="list" v-if="dataArr.length">
      <li class="item" v-for="(item,index) in dataArr" :key="item.id">
        <span>
          <input type="checkbox" v-model="item.checked" />
        </span>
        <span>{{item.policeName}}</span>
        <span>{{item.policeNum}}</span>
        <span>{{item.gun_code}}</span>
        <span class="db" @click="dbc(index)">{{item.vname}}</span>
        <span>{{item.org_name}}</span>
        <span>{{item.cname}}</span>
        <span>{{item.creatime}}</span>
      </li>
    </ul>

    <!-- <el-upload
          class="upload-demo"
          action="http://s.tronl.cn/weixin/project/index.php?m=home&c=upload&a=up&r=1"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="3"
          :on-exceed="handleExceed"
          :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload> -->
  </div>
</template>
<style scoped>
@import url(./content.css);
</style>
<script>
export default {
  components: {},
  props: {
    dataArr: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      fileList: [
        {
          name: "food.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        },
        {
          name: "food2.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        }
      ]
    };
  },
  computed: {
    allCheck: {
      get(v) {
        return this.dataArr.length ? this.dataArr.every(e => e.checked) : false;
      },
      set(newV, oldV) {
        this.$emit("changeAll", newV);
      }
    }
  },
  methods: {
    dbc(index){
      this.$emit('dbc',index)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }
  }
};
</script>
