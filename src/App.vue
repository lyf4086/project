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
</style>
