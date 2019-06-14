<template>
    <div class="wrap">
        <div class="left-area">
            <p>报警趋势图</p>
            <div id="char1" @click="chart1XiangQing"></div>
        </div>
        <div class="right-area">
            <p>报警类型占比情况</p>
            <div id="char2" @click="chart2XiangQing"></div>
        </div>
    </div>
</template>
<style scoped>

@import url(./item1.css);

</style>
<script>

    export default {
      data(){
        return {
          echar1_date:['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          echar1_num:[820, 932, 901, 934, 1290, 1330, 1320],
          echart2_data:[
                          {value:335, name:'直接访问'},
                          {value:310, name:'邮件营销'},
                          {value:234, name:'联盟广告'},
                          {value:135, name:'视频广告'},
                          {value:1548, name:'搜索引擎'}
                      ],
          timeObj:null
        }
      },
        methods: {
            char1(arrdate,arrnum){
                let box1=document.getElementById('char1')
               let Echart=this.$echarts.init(box1)
                let option = {
                                xAxis: {
                                    type: 'category',
                                    boundaryGap: false,
                                    // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                                    data:this.echar1_date
                                },
                                yAxis: {
                                    type: 'value'
                                },
                                series: [{
                                    // data: [820, 932, 901, 934, 1290, 1330, 1320],
                                    data:this.echar1_num,
                                    type: 'line',
                                    areaStyle: {
                                        color:'#63deff'

                                    }
                                }]
                            };

                   Echart.setOption(option)

            },
            char2(){
                let box2=document.getElementById('char2')
                let Echar2=this.$echarts.init(box2)
                let option = {
                            title : {

                                x:'center'
                            },
                            // tooltip : {
                            //     trigger: 'item',
                            //     formatter: "{a} <br/>{b} : {c} ({d}%)"
                            // },
                            // legend: {
                            //     orient: 'vertical',
                            //     bottom: 'bottom',
                            //     data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
                            // },
                            series : [
                                {
                                    name: '访问来源',
                                    color:['#63deff','#57c4e3','#4aa1bc','#3e8aa1','#34778a','#284968'],
                                    type: 'pie',
                                    radius : '55%',
                                    center: ['50%', '60%'],
                                    data:this.echart2_data,
                                    itemStyle: {
                                        emphasis: {
                                            shadowBlur: 10,
                                            shadowOffsetX: 0,
                                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                                        }
                                    }
                                }
                            ]
                        };

                Echar2.setOption(option)

            },
            getData(){
              let objs={}
               var token=this.$gscookie.getCookie('gun');
                var key =  this.$store.state.key;
                var sign =  this.$methods.mkSign(objs,key);
                var params = new URLSearchParams();
                params.append('sign',sign);
                params.append('token',token)
                this.$axios({
                    url:'http://s.tronl.cn/weixin/project/index.php?m=home&c=Index&a=alarm',
                    method:'POST',
                    changeOrigin:true,
                    data:params
                }).then((data)=>{

                    this.timeObj=data.data.time
                    this.echar1_date=data.data.data.days
                    this.echar1_num=data.data.data.value
                    this.char1()

                }).catch((error)=>{
                    console.log(error)
                })
            },
            getData_chart2(){
              let objs={}
               var token=this.$gscookie.getCookie('gun');
                var key =  this.$store.state.key;
                var sign =  this.$methods.mkSign(objs,key);
                var params = new URLSearchParams();
                params.append('sign',sign);
                params.append('token',token)
                this.$axios({
                    url:'http://s.tronl.cn/weixin/project/index.php?m=home&c=Index&a=alarm_type',
                    method:'POST',
                    changeOrigin:true,
                    data:params
                }).then((data)=>{

                    this.echart2_data=data.data.data
                    this.char2()
                }).catch((error)=>{
                    console.log(error)
                })
            },
            chart1XiangQing(){
              let roleId=this.$store.state.role_id
              if(roleId==3)return
              this.$router.push({
                name:'XiangQing',
                params:this.timeObj
              })
            },
            chart2XiangQing(){
              let roleId=this.$store.state.role_id
              if(roleId==3)return
              this.$router.push({
                name:'Item2',
                params:this.timeObj
              })
            }
        },
        mounted() {
            this.char1()
            this.char2()
            this.getData()
            this.getData_chart2()
        }
    }
</script>



