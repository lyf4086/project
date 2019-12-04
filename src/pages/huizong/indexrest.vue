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
import { setInterval } from 'timers';

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
  methods:{
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
          if(data.data.code==200){
            sessionStorage.setItem('tree-list',JSON.stringify(data.data.data.list))
          }
        })
        .catch(error => {
          console.log(error);
        });
      
    },
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
    this.getTreeList()
  }
  // beforeRouteLeave(to,from,next){
  //   console.log('首页销毁')
    
  // }

};
</script>
