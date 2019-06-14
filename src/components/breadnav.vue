<template>
  <div class="breadnav">
      <div class="title">{{title}}</div>
      <div class="next" v-show="next">{{next}}</div>
      <div class="mes" v-show="message">{{message}}</div>
  </div>
</template>

<script>

export default {
  props:{
    title:{
      type:String,
      default:'主标题'
    },
    next:{
      type:String,
      default:''
    },
    message:{
      type:String,
      default:''
    }
  },
  data(){
    return {

    }
  }
}
</script>
<style scoped  >
  @import url(./breadnav.css);
</style>
