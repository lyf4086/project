<template>
  <div class="wrap">
    <div class="left">
      <div class="down"></div>
      <div class="up" :style="`transform:rotate(${rotateleft}deg)`"></div>
    </div>
    <div class="right">
      <div class="down"></div>
      <div class="up" :style="`transform:rotate(${rotateright}deg)`"></div>
    </div>
  </div>
</template>
<style scoped>
@import url(./round.css);
</style>
<script>
export default {
  props: ["data"],
  data() {
    return {
      n: 60
    };
  },
  computed: {
    rotateleft() {
      let m = this.data - 50;
      return this.data > 50 ? m * 3.6 : 0;
    },
    rotateright() {
      let m = this.data;
      return this.data <= 50 ? m * 3.6 : 180;
    }
  }
};
</script>