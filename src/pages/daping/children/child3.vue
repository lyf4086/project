<template>
    <div class="wrap">
        <div class="main">
            <button class="close" @click="cl"></button>
            <div class="item1">
                <div class="tit">任务信息列表</div>
                <div class="list-wrap">
                    <div class="list" id="dp-item1-list">
                        <div class="item" v-for="(item,index) in list" :key="index"  >
                            <span>{{item[0].cname}}</span>
                            <div class="one" v-for="(e,i) in item" :key="i" @click="toXQ(e)">
                                <div class="name">{{e.vtask}}</div>
                                <div class="number">{{e.total}}</div>
                                <span>次</span>
                            </div>
                            <!-- <div class="one">
                                <div class="name">二级任务</div>
                                <div class="number">4567545</div>
                                <span>次</span>
                            </div>
                            <div class="one">
                                <div class="name">三级任务</div>
                                <div class="number">4567545</div>
                                <span>次</span>
                            </div>
                            <div class="one">
                                <div class="name">四级任务</div>
                                <div class="number">4567545</div>
                                <span>次</span>
                            </div> -->
                        </div>
                    </div>
                </div>
            </div>
            <div class="item2">
                <div class="tit"><span></span>任务统计</div>
                <div id="child1_chart1"></div>
            </div>
        </div>
    </div>
</template>
<style scoped>
@import url(./child3.css);
</style>
<script>
export default {
    props:{
        list:{
            type:Array,
            default :function (){return []}
        },
        sname:{
            type:Array,
            default:[]
        },
        arrs:{
            type:Array,
            default:[]
        }
    },
    data(){
        return {
            a:'2222'
        }
    },
    methods:{
        toXQ(item){
            
            this.$emit('lookxiangqing',{...item})
        },
        cl(){
            console.log('close child3')
            this.$emit('close')
        },
        listMove(){
            // console.log('move')
            this.$methods.listMove("#dp-item1-list",2000)
        },
        chart(){
            let that = this;
            let box = document.getElementById("child1_chart1");
            let Echart = this.$echarts.init(box);
            let option = {
                // backgroundColor: '#00265f',
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    top: '19%',
                    right: '3%',
                    left: '5%',
                    bottom: '12%'
                },
                xAxis: [{
                    type: 'category',
                    data: that.sname,
                    // ['工作票', '操作票', '抢修', '用电调查', '设备巡视', '现场勘查', '到岗到位'],
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,0.12)'
                        }
                    },
                    axisLabel: {
                        margin: 10,
                        color: '#e2e9ff',
                        textStyle: {
                            fontSize: 14
                        },
                    },
                }],
                yAxis: [{
                    axisLabel: {
                        formatter: '{value}',
                        color: '#e2e9ff',
                    },
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,0.12)'
                        }
                    }
                }],
                series: [{
                    type: 'bar',
                    data: that.arrs,
                    // [300, 450, 770, 203, 255, 188, 156],
                    barWidth: '20px',
                    itemStyle: {
                        normal: {
                            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(0,244,255,1)' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: 'rgba(0,77,167,1)' // 100% 处的颜色
                            }], false),
                            barBorderRadius: [30, 30, 30, 30],
                            shadowColor: 'rgba(0,160,221,1)',
                            shadowBlur: 4,
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            lineHeight: 30,
                            width: 80,
                            height: 30,
                            backgroundColor: 'rgba(0,160,221,0.1)',
                            borderRadius: 200,
                            position: ['-8', '-60'],
                            distance: 1,
                            formatter: [
                                '    {d|●}',
                                ' {a|{c}}     \n',
                                '    {b|}'
                            ].join(','),
                            rich: {
                                d: {
                                    color: '#3CDDCF',
                                },
                                a: {
                                    color: '#fff',
                                    align: 'center',
                                },
                                b: {
                                    width: 1,
                                    height: 30,
                                    borderWidth: 1,
                                    borderColor: '#234e6c',
                                    align: 'left'
                                },
                            }
                        }
                    }
                }]
            };           

            Echart.setOption(option)
        },
       
    },
    mounted(){
        console.log(this.list.length)
        if(this.list.length>4){
            this.listMove()
        }
        
        this.chart()
    }
}
</script>