<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'App',
  mounted(){
    this.$store.dispatch('createAudio')
  }
}
</script>

<style>
@import url(./assets/style/rest.css);
@import url(./assets/style/iconfont.css);
#app{ 
  width:100vw;
  height:100vh;
  overflow: auto;
}
.el-select .el-input {
  width: 100px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.nowrap{
   white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.list::-webkit-scrollbar {/*滚动条整体样式*/
  width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
.list::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(63, 4, 173, 0.5);
  background: rgba(34, 3, 117, 0.8);
}
.list::-webkit-scrollbar-track {/*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  border-radius: 0;
  background: rgba(221, 213, 213, 0.6);
}
</style>
