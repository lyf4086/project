<template>
    <div class="dialog">
         <button class="del" @click="close">X</button>
        <div class="title">
            任务统计详情
        </div>
        <div class="content">
            <div class="up">
                <div class="item">
                    <div class="t">一级任务</div>
                    <div class="list">
                        <div class="i" v-for="e in 5">
                            <span>浙江</span>
                            <span>5</span>
                        </div>
                    </div>
                </div>
                <div class="item">
                    <div class="t">二级任务</div>
                    <div class="list">
                        <div class="i" v-for="e in 5">
                            <span>浙江</span>
                            <span>5</span>
                        </div>
                    </div>
                </div>
                <div class="item">
                    <div class="t">三级任务</div>
                    <div class="list">
                        <div class="i" v-for="e in 5">
                            <span>浙江</span>
                            <span>5</span>
                        </div>
                    </div>
                </div>
                <div class="item">
                    <div class="t">四级任务</div>
                    <div class="list">
                        <div class="i" v-for="e in 5">
                            <span>浙江</span>
                            <span>5</span>
                        </div>
                    </div>
                </div>
                
            </div>
            <div class="down" id="chart-down"></div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {

        }
    },
    methods:{
        close(){
            this.$emit('close')
        },
        chartDown(){
            let box1 = document.getElementById("chart-down");
            let myChart = this.$echarts.init(box1);
            let option = {
                title: {
                    text: '当月任务TOP榜单',
                    textStyle: {
                        fontSize: 14,
                        color: '#fff',
                        fontWeight: 500,
                    }
                },
                color: ['#3b9ffc'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '30',
                    right: '30',
                    bottom: '20',
                    containLabel: true
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    left: 'right',
                    top: 'center',
                },
                calculable: true,
                xAxis: {
                    show:false,
                    // boundaryGap: false, //x轴从0开始到结束显示
                    // onZero: true,
                    splitLine: {
                        show: false
                    }, //去除网格线
                    splitArea: {
                        show: false
                    }, //保留网格区域
                    axisLine: {
                        show: true,
                        lineStyle: { //轴上的线样式
                            color: '#808492',
                            width: 0.6, //这里是为了突出显示加上的
                        },
                    },
                    axisTick: {
                        show: true
                    },
                    axisLabel: { //轴上的数据样式
                        color: '#808492',
                    },
                    data: ['1月', '2月', '3月', '4月', '5月','6月','7月','8月','9月','10月'],
                },
                yAxis: {
                    show: false,
                    type: 'value',
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false,
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: 'dashed',
                            color: 'rgba(33,148,246,0.2)'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            fontSize: 12,
                            color: '#808492'
                        }
                    }
                },
                series: [{
                        type: 'bar',
                        barWidth: 20, // 柱形的宽度
                        barGap: 0,
                        data: [320, 332, 301, 334, 390,200,400,300,100,130],
                    },
                    {
                        type: 'line',
                        smooth: true,//平滑曲线
                        data: [320, 332, 201, 334, 190,100,400,200,300,90],
                        symbol: 'none',
                        symbolSize: '5',
                        name: '总计',
                        lineStyle: {
                            color: "#ffc83b"
                        },
                    }
                ]
            };
            myChart.setOption(option)
        }
    },
    mounted(){
        this.chartDown()
    }
}
</script>
<style lang="less" scoped>
@vw:38.4vw;
@vh:21.6vh;
.dialog{
    box-sizing: border-box;
    border:5/@vw solid #14568c;
    border-radius: 10/@vw;
    position: absolute;
    z-index: 999;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    width:1910/@vw;
    height:1368/@vh;
    padding: 0 76/@vw 0;
    background: rgba(6,37,70,0.9);
    .del{
        position: absolute;
        right:36/@vw;
        top:36/@vh;
        border:none;
        background: none;
        width:30/@vw;
        height:30/@vw;
        color:#93a0af;
        font-size: 36/@vw;
    }
    .title{
        width:100%;
        height:150/@vh;
        font-size: 45/@vw;
        font-weight: bold;
        color:#fff;
        border-bottom: 2/@vh solid #14568c;
        line-height: 150/@vh;
        text-align: center;
        background: url(../../../assets/sucai/line.png) no-repeat center top;
        background-size: 1130/@vw 12/@vh;
       
    }
    .content{
        width:100%;
        height:1160/@vh;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-content: space-between;
        // background: pink;
        .up{
            width:100%;
            height:680/@vh;
            border-bottom: 2/@vw solid #145288;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            .item{
                width:390/@vw;
                height:620/@vh;
                // background: chartreuse;
                .t{
                    font-size: 32/@vw;
                     line-height: 80/@vw;
                     color: #fff;
                     font-weight: bold;
                }
                .list{
                    width: 100%;
                    height:500/@vh;
                    .i{
                        box-sizing: border-box;
                        border:2/@vw solid #1e5a82;
                        border-radius: 5/@vw;
                        width: 384/@vw;
                        padding:0 40/@vw;
                        height:77/@vh;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 30/@vw;
                        color:#fff;
                        margin-bottom: 24/@vh;
                        span:nth-child(2){
                            color:#3aecfd
                        }
                    }
                    .i:hover{
                        cursor: pointer;
                        background: rgba(47,128,237,0.2);
                        border-color: transparent;
                        box-shadow: 0 1px 20px 0 rgba(58,236,253,0.32),inset 0 0 13px 0 rgba(58,236,253,0.3);
                    }
                }
            }
        }
        // .item:hover{
        //     cursor: pointer;
        //     background: rgba(47,128,237,0.2);
        //     border-color: transparent;
        //     box-shadow: 0 1px 20px 0 rgba(58,236,253,0.32),inset 0 0 13px 0 rgba(58,236,253,0.3);
        // }
        .down{
            width: 100%;
            height: 480/@vh;
        }
    }
}
</style>