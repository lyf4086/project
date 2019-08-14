<template>
  <div class="main">
    <span class="prev" @click="prev"></span>
      <div class="center">
        <div class="time_check">
          <span>查询时间：</span>
          <input type="date" class="s_time" v-model="s_time">
          <span>致</span>
          <input type="date" class="e_time" v-model="e_time">
          <button @click="chaxun">查询</button>
        </div>
        <div class="chart">
          <div id="chart"></div>
        </div>
        <div class="grid">
          <div class="title" >
            <span>报警日期</span>
            <span>报警数量</span>
            <span>查看详情</span>
          </div>
          <div class="wrap" v-if="dataList.length">
            <div class="item" v-for="item,index in dataList" :key="index">
              <span>{{item.datetime}}</span>
              <span>{{item.number}}</span>
              <span class="more" @click="toMore(item.datetime)">查看详情</span>
            </div>
          </div>

        </div>
      </div>
  </div>
</template>
<style scoped>
  @import url(./xiangqing.css);
</style>
<script>
export default {
  data() {
    return {
       echar_date:['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      echar_num:[820, 932, 901, 934, 1290, 1330, 1320],
      dataList:[],
      s_time:'',
      e_time:'',
      obj:null
    }
  },
  methods:{
    prev(){
      this.$router.go(-1)
    },
     chart(arrdate,arrnum){
        let box1=document.getElementById('chart')
        let Echart=this.$echarts.init(box1)
        let option = {
                        xAxis: {
                          color:'#ffffff',
                            type: 'category',
                            boundaryGap: false,
                            // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                            data:this.echar_date
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [{
                            // data: [820, 932, 901, 934, 1290, 1330, 1320],
                            data:this.echar_num,
                            type: 'line',
                            areaStyle: {
                                color:'#63deff'

                            }
                        }]
                    };

            Echart.setOption(option)

      },
      toMore(s){
        console.log(s)
        this.$router.push({
          name:'List',
          params:{datetime:s}
        })
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
            url:'http://s.tronl.cn/weixin/project/index.php?m=home&c=Index&a=alarm_info',
            method:'POST',
            changeOrigin:true,
            data:params
        }).then((data)=>{

          if(data.status==200){
            this.echar_date=data.data.data.days
            this.echar_num=data.data.data.value
            this.chart()
            this.dataList=data.data.list
          }


        }).catch((error)=>{
            console.log(error)
        })
      },
      chaxun(){
        let start=this.s_time
        let end=this.e_time
        if(!start && !end){
          this.$message({
            type:"warning",
            message:"请选择时间"
          })
        }else{
          this.getData(`${start},${end}`)
        }

        
      }
  },
  created(){
    let item =this.$gscookie.getCookie("message_obj")
      if(item.role_id==3){
        this.$router.push({
          name:'HuiZong'
        })
      }
    let obj=this.$route.params
    this.obj=obj

    this.getData(`${obj}`)
  },
  mounted(){

  },
  // activated(){
  //   if(this.obj.length){
  //      let obj=this.obj
  //     this.getData(`${obj}`)
  //   }

  // }
}
</script>
