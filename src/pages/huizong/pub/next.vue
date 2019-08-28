<template>
  <div class="next">
    <div class="prev" @click="prev"></div>
    <div class="item4" v-if="index=='item4'">
      <div class="title">
        <span>姓名</span>
        <span>机构名称</span>
        <span>时间</span>
        <span>报警类型</span>
      </div>
      <ul class="list" v-if="item4_data">
        <li v-for="item,index in item4_data" :key="index">
          <span>{{item.policeuser_name}}</span>
          <span>{{item.mechanism_name}}</span>
          <span>{{item.datetime}}</span>
          <span>{{item.type_name}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<style  scoped>
@import url(./pub.css);
</style>
<script>
export default {
  data() {
    return {
      index: "",
      item4_data: []
    };
  },
  methods: {
    prev() {
      this.$router.go(-2);
    },
    getData_item4(time, types, mechanism_id) {
      let objs = { time: time, types: types, mechanism_id: mechanism_id };
      var token = this.$gscookie.getCookie("gun");
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);
      var params = new URLSearchParams();
      params.append("sign", sign);
      params.append("token", token);
      params.append("time", objs.time);
      params.append("types", objs.types);
      params.append("mechanism_id", objs.mechanism_id);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=Index&a=alarm_infos",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.status == 200) {
            this.item4_data = data.data.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created() {
    let item = this.$gscookie.getCookie("message_obj");
    if (item.role_id == 3) {
      this.$router.push({
        name: "HuiZong"
      });
    }
    let obj = this.$route.params;
    console.log("next", obj);
    if (obj.source == "item4") {
      this.index = obj.source;
      this.getData_item4(obj.time, obj.obj.type, obj.obj.id);
    }
  }
};
</script>
