<template>
  <div class="wrap">
    <div class="top">
      <span>{{title}}</span>
    </div>
    <div class="content">
      <div class="list">
        <div class="item">
          <span>机构名称</span>
          <span>报警日期</span>
          <span>报警数量</span>
          <span>查看详情</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import url(./index.css);
</style>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "报警信息"
    },
    list: {
      type: Array,
      default: function() {
        return [
          { mname: "机构名称", datetime: "报警日期", number: "报警数量" },
          { mname: "机构名称", datetime: "报警日期", number: "报警数量" },
          { mname: "机构名称", datetime: "报警日期", number: "报警数量" },
          { mname: "机构名称", datetime: "报警日期", number: "报警数量" },
          { mname: "机构名称", datetime: "报警日期", number: "报警数量" }
        ];
      }
    }
  },
  data() {
    return {
      a: "22222",
      content: "888"
    };
  }
};
</script>