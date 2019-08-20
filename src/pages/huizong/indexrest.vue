<template>
  <div class="main">
    <div class="up">
      <div class="left">
        <div class="left-up">
          <p class="title">&nbsp;</p>
          <div class="jiao">
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <Item1 />
          </div>
        </div>
        <div class="right-up">
          <p class="title">&nbsp;</p>
          <div>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <Item2 />
          </div>
        </div>
        <div class="left-down">
          <p class="title">&nbsp;</p>
          <div class="jiao">
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <Item3 />
          </div>
        </div>
        <div class="right-down">
          <p class="title">&nbsp;</p>
          <div class="jiao">
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <Item4 />
          </div>
        </div>
      </div>
      <div class="pos-right">
        <p class="title">&nbsp;</p>
        <div class="jiao">
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <jiBieFenBu />
        </div>
      </div>
    </div>
    <div class="down">
      <div class="down-left">
        <p class="title">&nbsp;</p>
        <div class="jiao">
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <Item6 />
        </div>
      </div>
      <div class="down-right">
        <p class="title">&nbsp;</p>
        <div class="jiao">
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <Item7 />
        </div>
      </div>
    </div>
  </div>
</template>
<style >
@import url(./indexrest.css);
</style>
<script>
import jiBieFenBu from "./renwujibie.vue";
import Item1 from "./children/item1.vue";
import Item2 from "./children/item2.vue";
import Item3 from "./children/item3.vue";
import Item4 from "./children/item4.vue";
import Item6 from "./children/item6.vue";
import Item7 from "./children/item7.vue";

export default {
  components: {
    jiBieFenBu,
    Item1,
    Item2,
    Item3,
    Item4,
    Item6,
    Item7
  },
  created() {
    let item = this.$gscookie.getCookie("message_obj");
    if (item.role_id == 3) {
      this.$router.push({
        name: "GuiJi"
      });
    }
    let str = this.$gscookie.getCookie("gun");
    if (JSON.stringify(str) == "{}") {
      this.$router.push("/loginput");
    }
  }
};
</script>
