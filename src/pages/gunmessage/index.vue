<template>
  <div class="main" >
    <h1>枪支详情</h1>
    <div class="wrap">

    </div>
  </div>
</template>
<style scoped>
@import url(./index.css);
</style>
<script>
export default {
  data(){
    return {
      message:null
    }
  },
  methods: {

  },
  created(){
    let obj=this.$route.params
    console.log(obj)
    this.message=obj

  }
}
</script>
