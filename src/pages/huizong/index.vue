<template>
    <div class="wrap">
        <div class="up">
            <div class="fourbox">
                <div class="echart-item">
                    <p>枪支整体情况</p>
                    <div class="itemwrap " id="firstbox">
                        <span class="jiao jiao-t"></span>
                        <span class="jiao jiao-r"></span>
                        <span class="jiao jiao-b"></span>
                        <span class="jiao jiao-l"></span>

                        <Item1/>

                    </div>
                </div>
                <div class="echart-item">
                    <p>&nbsp;&nbsp;在外枪支</p>
                    <div class="qiangzhi">
                        <div class="float-l"></div>
                        <div class="yuan">

                        </div>
                        <div class="gun">

                        </div>
                        <div class="float-r"></div>
                        <div class="text-left">
                            <p>出境枪支总数</p>
                            <div class="num">
                                23456

                            </div>
                            <p>出警枪支总数</p>
                            <div class="num">
                               234565
                            </div>
                        </div>
                        <div class="text-right">
                            <p>出境枪支总数</p>
                            <div class="num">
                                8765

                            </div>
                            <p>出警枪支总数</p>
                            <div class="num">
                               45645
                            </div>
                        </div>
                    </div>
                </div>
                <div class="echart-item">
                    <p>重要任务部署领导情况</p>
                    <div class="itemwrap">
                        <span class="jiao jiao-t"></span>
                        <span class="jiao jiao-r"></span>
                        <span class="jiao jiao-b"></span>
                        <span class="jiao jiao-l"></span>

                       <Item3/>


                    </div>
                </div>
                <div class="echart-item">
                   &nbsp;
                    <div class="itemwrap list">

                        <span class="jiao jiao-t"></span>
                        <span class="jiao jiao-r"></span>
                        <span class="jiao jiao-b"></span>
                        <span class="jiao jiao-l"></span>


                        <Item4/>
                    </div>

                </div>
            </div>
            <div class="rightbox">
             <p>任务级别分布情况</p>
                <div class="jibiefenbu">
                    <span class="jiao jiao-t"></span>
                    <span class="jiao jiao-r"></span>
                    <span class="jiao jiao-b"></span>
                    <span class="jiao jiao-l"></span>


                    <jiBieFenBu />


                </div>

            </div>
        </div>
        <div class="down">
            <div class="leftbox">
                <div class="dianliang">
                    <span class="jiao jiao-t"></span>
                    <span class="jiao jiao-r"></span>
                    <span class="jiao jiao-b"></span>
                    <span class="jiao jiao-l"></span>

                    <Item6/>

                </div>

            </div>
            <div class="rightbox">
                <div class="chuqin">
                    <span class="jiao jiao-t"></span>
                    <span class="jiao jiao-r"></span>
                    <span class="jiao jiao-b"></span>
                    <span class="jiao jiao-l"></span>
                    <Item7/>
                </div>

            </div>
        </div>
    </div>
</template>
<style scoped>
@import url(./huizong.css);
</style>
<script>
    import jiBieFenBu from './renwujibie.vue'
    import Item1 from './children/item1.vue'
    import Item3 from './children/item3.vue'
    import Item4 from './children/item4.vue'
    import Item6 from './children/item6.vue'
    import Item7 from './children/item7.vue'
    export default {
        components:{
            jiBieFenBu,Item1,Item3,Item4,Item6,Item7
        },
        methods:{
            echarts1(){
                let chuqin=document.getElementById('chuqing')
                let Echart1=this.$echarts.init(chuqin);
                let option = {

                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['1', '2', '3']
                    },
                    yAxis: {
                        type: 'value',
                        data: ['100', '200', '300']
                    },
                    series: [{
                        data: [120, 200, 90],
                        type: 'line',
                        areaStyle: {}
                    }]
                };
                Echart1.setOption(option)


            },
            echarts2(){

                let Echart2=this.$echarts.init(document.getElementById('zhanbi'));

                let option2 = {
                    title : {
                        text: '1111',
                        subtext: '3333',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['1','2','3','4','5']
                    },
                    series : [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:[
                                {value:335, name:'1'},
                                {value:310, name:'2'},
                                {value:234, name:'3'},
                                {value:135, name:'4'},
                                {value:1548, name:'5'}
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 80, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };

                Echart2.setOption(option2)

            }


        },
        created(){
          let item =this.$gscookie.getCookie("message_obj")
          if(item.role_id==3){
            this.$router.push({
              name:'HuiZong'
            })
          }
        },
        mounted() {
            // console.log(this.$router.options)

            this.echarts1()
            this.echarts2()
        }
    }
</script>
