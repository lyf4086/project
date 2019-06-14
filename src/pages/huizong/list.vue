<template>
  <div class="content">
    <div class="prev" @click="prev"></div>
    <div class="two" v-if="dataListSmall.length && smallShow">
        <div class="title" >
          <span>数量</span>
          <span>时间</span>
          <span>报警类型</span>

        </div>
        <ul class="list" >
          <li class="item" v-for="item,index in dataListSmall" :key="index">
            <span @click="toBig(item)">{{item.number}}</span>
            <span>{{item.datetime}}</span>
            <span>{{item.type_name}}</span>

          </li>
        </ul>
    </div>
    <div class="three" v-if="dataListBig.length && !smallShow">
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
        <li class="item" v-for="item,index in dataListBig" :key="index">
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
  @import url(./list.css);
</style>
<script>
export default {
  data() {
    return {
      dataListSmall:[],
      dataListBig:[],
      datetime:'',
      smallShow:true
    }
  },
  methods:{
    prev(){
      this.$router.go(-1)
    },
    getData(timeStr){
      let objs={"datetime":timeStr}
      var token=this.$gscookie.getCookie('gun');
      var key =  this.$store.state.key;
      var sign =  this.$methods.mkSign(objs,key);
      var params = new URLSearchParams();
      params.append('sign',sign);
      params.append('token',token)
      params.append('datetime',objs.datetime)
      this.$axios({
          url:'http://s.tronl.cn/weixin/project/index.php?m=home&c=Index&a=alarm_num',
          method:'POST',
          changeOrigin:true,
          data:params
      }).then((data)=>{
        console.log(data)
        if(data.status==200){
          this.dataListSmall=data.data.data
        }


      }).catch((error)=>{
          console.log(error)
      })
    },
    getDataThree(timeStr,types){
      let objs={"datetime":timeStr,"types":types}
      var token=this.$gscookie.getCookie('gun');
      var key =  this.$store.state.key;
      var sign =  this.$methods.mkSign(objs,key);
      var params = new URLSearchParams();
      params.append('sign',sign);
      params.append('token',token)
      params.append('datetime',objs.datetime)
      params.append('types',objs.types)
      this.$axios({
          url:'http://s.tronl.cn/weixin/project/index.php?m=home&c=Index&a=alarm_infos',
          method:'POST',
          changeOrigin:true,
          data:params
      }).then((data)=>{
        if(data.status==200){
          this.dataListBig=data.data.data
          console.log(this.dataListBig)
        }


      }).catch((error)=>{
          console.log(error)
      })
    },
    toBig(item){
      console.log(item)
      this.smallShow=false
      this.getDataThree(item.datetime,item.types)
    }
  },
  created (){
    let obj=this.$route.params
    this.datetime=obj.datetime
    this.getData(obj.datetime)
  },
  activated(){
    if(this.datetime){
      this.getData(this.datetime)
    }
    this.smallShow=true
  }
}
</script>

