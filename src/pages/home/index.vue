<template>
  <div class="wrap">
    <div class="up">
      <item1 class="item"></item1>
      <item2 class></item2>
      <item3 class="item"></item3>
      <item4 class="hvr-shadow"></item4>
      <item5 class="item item5"></item5>
    </div>
    <div class="down">
      <item6 class="item"></item6>
      <item7 class="item"></item7>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import url("./index.css");

</style>
<script>
import Item1 from "./item1/index";
import Item2 from "./item2/index";
import Item3 from "./item3/index";
import Item4 from "./item4/index";
import Item5 from "./item5/index";
import Item6 from "./item6/index";
import Item7 from "./item7/index";
export default {
  components: { Item1, Item2, Item3, Item4, Item5, Item6, Item7 },
  methods: {
    
    getTreeList() {
      // ......................该组件默认加载树形菜单数据
      var key = this.$store.state.key;
      var objs = { p: 1, ps: 6, mechanism_id: 1 };
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("p", objs.p);
      params.append("ps", objs.ps);
      params.append("mechanism_id", objs.mechanism_id);
      params.append("sign", sign);
      params.append("token", token);

      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=mechanism&a=mechanisms_tree",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            sessionStorage.setItem(
              "tree-list",
              JSON.stringify(data.data.data.list)
            );
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created(){
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
    this.getTreeList()
    
  }
};
</script>