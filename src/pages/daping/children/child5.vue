<template>
    <div class="wrap">
        <div class="main">
            <button class="close" @click="cl"></button>
            <div class="up-area">
                <div class="nav">
                    <div class="btns">
                        <div class="btn">任务执行</div>
                        <div class="btn">任务数量</div>
                        <div class="btn">弹药消耗</div>
                    </div>
                    <div class="selects">
                        <el-date-picker
                            v-model="date1"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker>
                        <span>至</span>
                        <el-date-picker
                            v-model="date2"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker>
                        <button>查询</button>
                    </div>
                </div>
                <div class="title">
                    <span>单位</span>
                    <span>任务总数（个）</span>
                    <span>一级任务（个）</span>
                    <span>二级任务（个）</span>
                    <span>三级任务（个）</span>
                    <span>四级任务（个）</span>
                    <span>操作</span>
                </div>
                <div class="list-wrap">
                    <div class="bg">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div class="list">
                        <div class="item" v-for="e in 20">
                            <span>单位</span>
                            <span>任务总数（个）</span>
                            <span>一级任务（个）</span>
                            <span>二级任务（个）</span>
                            <span>三级任务（个）</span>
                            <span>四级任务（个）</span>
                            <span>操作</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="down-area" id="child5-chart"></div>
        </div>
    </div>
</template>
<style scoped>
@import url(./child5.css);
</style>
<script>
export default {
    data(){
        return {
            date1:'',
            date2:''
        }
    },
    methods:{
        cl(){
            this.$emit('close')
        },
        listMove(){
            // this.$methods.listMove("#move-list-item4",2000)
        },
        chart(){
            let that = this;
            let box = document.getElementById("child5-chart");
            let Echart = this.$echarts.init(box);
            var option = {
                // backgroundColor:'#323a5e',
                    tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                    },
                    grid: {
                    left: '2%',
                    right: '4%',
                    bottom: '14%',
                    top:'16%',
                    containLabel: true
                    },
                    legend: {
                    data: ['1', '2', '3'],
                    right: 10,
                    top:12,
                    textStyle: {
                        color: "#fff"
                    },
                    itemWidth: 12,
                    itemHeight: 10,
                    // itemGap: 35
                },
                xAxis: {
                    type: 'category',
                    data: ['2012','2013','2014','2015','2016','2017','2018','2019'],
                    axisLine: {
                    lineStyle: {
                        color: 'white'

                    }
                    },
                    axisLabel: {
                    // interval: 0,
                    // rotate: 40,
                    textStyle: {
                        fontFamily: 'Microsoft YaHei'
                    }
                    },
                },

                yAxis: {
                    type: 'value',
                    max:'1200',
                    axisLine: {
                    show: false,
                    lineStyle: {
                        color: 'white'
                    }
                    },
                    splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255,255,255,0.3)'
                    }
                    },
                    axisLabel: {}
                },
                "dataZoom": [{
                    "show": true,
                    "height": 12,
                    "xAxisIndex": [
                    0
                    ],
                    bottom:'8%',
                    "start": 10,
                    "end": 90,
                    handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                    handleSize: '110%',
                    handleStyle:{
                    color:"#d3dee5",

                    },
                    textStyle:{
                    color:"#fff"},
                    borderColor:"#90979c"
                }, {
                    "type": "inside",
                    "show": true,
                    "height": 15,
                    "start": 1,
                    "end": 35
                }],
                series: [{
                    name: '1',
                    type: 'bar',
                    barWidth: '15%',
                    itemStyle: {
                    normal: {
                        color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#fccb05'
                        }, {
                            offset: 1,
                            color: '#f5804d'
                        }]),
                        barBorderRadius: 12,
                    },
                    },
                    data: [400, 400, 300, 300, 300, 400, 400, 400, 300]
                },
                {
                    name: '2',
                    type: 'bar',
                    barWidth: '15%',
                    itemStyle: {
                    normal: {
                        color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#8bd46e'
                        }, {
                            offset: 1,
                            color: '#09bcb7'
                        }]),
                        barBorderRadius: 11,
                    }
                    
                    },
                    data: [400, 500, 500, 500, 500, 400,400, 500, 500]
                },
                {
                    name: '3',
                    type: 'bar',
                    barWidth: '15%',
                    itemStyle: {
                    normal: {
                        color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#248ff7'
                        }, {
                            offset: 1,
                            color: '#6851f1'
                        }]),
                    barBorderRadius: 11,
                    }
                    },
                    data: [400, 600, 700, 700, 1000, 400, 400, 600, 700]
                }]
            };

            var app = {
            currentIndex: -1,
            };
            setInterval(function () {
            var dataLen = option.series[0].data.length;

            // 取消之前高亮的图形
            Echart.dispatchAction({
                type: 'downplay',
                seriesIndex: 0,
                dataIndex: app.currentIndex
            });
            app.currentIndex = (app.currentIndex + 1) % dataLen;
            //console.log(app.currentIndex);
            // 高亮当前图形
            Echart.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: app.currentIndex,
            });
            // 显示 tooltip
            Echart.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: app.currentIndex
            });


            }, 1000); 
 
            Echart.setOption(option)

        },
       
    },
    mounted(){
        this.chart()
    }
}
</script>