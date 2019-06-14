<template>
  <div class="content">
    <div class="prev" @click="prev"></div>
    <div class="three" v-if="dataList.length">
      <div class="title">
        <span>人员姓名</span>
        <span>枪支编号</span>
        <span>所属机构</span>
        <span>剩余电量</span>
        <span>报警时间</span>
        <span>报警类型</span>
        <span>历史轨迹</span>
      </div>
      <ul class="list" >
        <li class="item" v-for="item,index in dataList" :key="index">
          <span>{{item.policeuser_name}}</span>
          <span>{{item.gun_code}}</span>
          <span>{{item.mechanism_name}}</span>
          <span>{{item.elec}}%</span>
          <span>{{item.datetime}}</span>
          <span>{{item.type_name}}</span>
          <span>历史轨迹</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
  @import url(./list2.css);
</style>
<script>
export default {
  data() {
    return {

      dataList:[],
      datetime:''
    }
  },
  methods:{
    prev(){
      this.$router.go(-1)
    },
    getData(timeStr){
      let objs={"time":timeStr}
      var token=this.$gscookie.getCookie('gun');
      var key =  this.$store.state.key;
      var sign =  this.$methods.mkSign(objs,key);
      var params = new URLSearchParams();
      params.append('sign',sign);
      params.append('token',token)
      params.append('time',objs.time)
      this.$axios({
          url:'http://s.tronl.cn/weixin/project/index.php?m=home&c=Index&a=alarm_infos',
          method:'POST',
          changeOrigin:true,
          data:params
      }).then((data)=>{

        if(data.status==200){

          this.dataList=data.data.data
        }


      }).catch((error)=>{
          console.log(error)
      })
    },

  },
  created (){
    let item =this.$gscookie.getCookie("message_obj")
      if(item.role_id==3){
        this.$router.push({
          name:'HuiZong'
        })
      }
    let obj=this.$route.params

    this.datetime=obj
    this.getData(obj.join(','))
  },
  activated(){
    if(this.datetime){
      this.getData(this.datetime.join(','))
    }

  }
}
</script>

