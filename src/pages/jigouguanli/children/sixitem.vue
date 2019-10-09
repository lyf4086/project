<template>
  <div class="sixitem">
    <div v-for="(item,index) in this.dataList" :key="index" :class="{'dou':del}">
      <div class="text deltext">
        <p>
          <span>机构名称：</span>
          <i>{{item.mechanism_name}}</i>
        </p>
        <p v-show="item.opoliceuser_name">
          <span>创建人：</span>
          <i>{{item.opoliceuser_name}}</i>
        </p>
        <!-- <p>
                    <span>父机构：</span>
                    <i>{{item.p_mame}}</i>
        </p>-->
        <p>
          <span>创建时间：</span>
          <i>{{item.date}}</i>
        </p>
        <p>
          <span>机构编号：</span>
          <i>{{item.code}}</i>
        </p>
        <p v-show="item.mechanism_desc">
          <span>机构描述：</span>
          <i>{{item.mechanism_desc}}</i>
        </p>
      </div>
      <button v-if="sync===0" class="change" @click="xiuGaiOneData(item)">修改机构</button>
      <button class="del" v-show="del" @click="queren(item)">X</button>
    </div>
  </div>
</template>
<style scoped>
@import url(./sixitem.css);
</style>
<script>
export default {
  props: {
    del: {
      type: Boolean,
      default: false
    },
    dataList: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      sync: 0
    };
  },
  methods: {
    queren(item) {
      let b = confirm("是否删除");
      if (b) {
        this.$emit("deleted", { item });
      }
    },
    xiuGaiOneData(oneData) {
      this.$emit("changeOneData", oneData);
    }
  },
  created() {
    this.sync = this.$store.state.sync;
  }
};
</script>
