<template>
  <div class="wrap11">
    <div class="prev" @click="scrollLeft"><</div>
    <div class="scroll" id="scrollListTap">
      <div ref="scroll">
        <div
          class="item"
          v-for="(item,index) in list"
          :key="index"
          :class="{active:jigouSelIndex==index}"
          @click="tabOne(index)"
        >
          {{item}}
          <!-- <i @click="del(index)">X</i> -->
        </div>
      </div>
    </div>
    <div class="next" @click="scrollRight">></div>
  </div>
</template>
<style scoped>
@import url("./tag.css");
</style>
<script>
export default {
  props: ["list", "jigouSelIndex"],
  data() {
    return {
      n: 0
    };
  },

  methods: {
    del(index) {
      this.$emit("delOneJiGou", index);
    },
    tabOne(index) {
      this.$emit("clickOneTab", index);
    },
    scrollLeft() {
      let w = this.$refs.scroll.scrollWidth;
      //   let l = this.$refs.scroll.scrollLeft;
      //   this.$refs.scroll.scrollLeft = "1rem";
      //   $(".list").animate({ scrollLeft: 0 });
      //   console.log(w, l);

      $("#scrollListTap").animate({ scrollLeft: 0 });
      //   console.log($("#scrollList").animate({ scrollLeft: 0 }));
    },
    scrollRight() {
      let w = this.$refs.scroll.scrollWidth;
      $("#scrollListTap").animate({ scrollLeft: w });
    }
  },
  watch: {
    list(h) {
      this.$refs.scroll.style.width = this.list.length + 1 + "rem";
    }
  },
  updated() {}
};
</script>


