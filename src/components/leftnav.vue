<template>
    <div id="tree-wrap" >
        <el-tree
        :data="data"
        :props="defaultProps"
        accordion
        node-key="id"
        current-node-key="248"
        default-expand-all
        @node-click="handleNodeClick">
        </el-tree>
    </div>
</template>
<style scoped>
@import url(./leftnav.css);
</style>
<script>
  export default {
    // name:'LeftNav',
    data() {
      return {
        data: [{
          label: '盐城市公安局',
          children: [{
            label: '巡特警支队',
            children: [{
              label: '一大队'
            },{
              label: '二大队'
            }]
          }]
        }, {
          label: '洛阳市公安局',
          children: [{
            label: '一大队',
            children: [{
              label: '一大队一中队'
            }]
          }, {
            label: '二大队',
            children: [{
              label: '二大队一中队'
            }]
          }]
        }, {
          label: '济南市公安局',
          children: [{
            label: '特巡警支队',
            children: [{
              label: '一大队'
            }]
          }, {
            label: '交巡警支队',
            children: [{
              label: '一大队'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    },
    methods: {
      handleNodeClick(data) {
        console.log(data);
      }
    }
  };
</script>
