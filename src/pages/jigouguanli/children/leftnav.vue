<template>
  <div id="tree-wrap" v-if="tree">
    <el-tree
      :data="tree"
      :props="defaultProps"
      accordion
      :highlight-current="true"
      node-key="id"
      :current-node-key="currentNodeKey"
      default-expand-all
      @node-click="handleNodeClick"
    ></el-tree>
  </div>
</template>
<style scoped>
@import url(./leftnav.css);
</style>
<script>
export default {
  props: {
    tree: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      currentNodeKey: 1,
      hasData: false,
      data: [],
      defaultProps: {
        children: "child",
        label: "mechanism_name"
      }
    };
  },
  methods: {
    handleNodeClick(data) {
      this.$emit("handClick", data);
    }
  },
  created() {
    this.currentNodeKey = this.$gscookie.getCookie("mechanism_id");
    this.data = this.tree;
    this.hasData = true;
  }
};
</script>
