<template>
    <div class="wrap">
        <div class="alert2" >
        <div class="t1">电池信息</div>
        <div id="dianchi"></div>
        <div class="message" >
          <p>剩余电量：{{dianChiNumber}}%</p>
          <p v-if="!!miao">枪瞄编号：{{miao}}</p>
          <p v-if="!!person">所属警员：{{person}}</p>
        </div>
        <div class="t">电量趋势图</div>
        <div id="chart2">
          
        </div>
        <div class="title" v-if="dianlianglist.length">
          <span>电量</span>
          <span>时间</span>
          
        </div>
        <div class="listwrap">
          <div class="list" id="dianliang" v-if="dianlianglist.length">
            <div class="item" v-for="(item,index) in dianlianglist" :key="index">             
              <span>电量</span>
              <span>时间</span>
            </div>
          </div>
        </div>
        <button class="close" @click="close">取消</button>
      </div>
    </div>
</template>
<style  scoped>
@import url(./dianchialert.css);
</style>
<script>
export default {
    props:{
        dianChiNumber:{
            type:[Number,String],
            default:function (){return 0}
        },
        dianlianglist:{
            type:Array,
            default:function (){return []}
        },
        dianliangData1:{
            type:Array,
            default:function (){return ["2014", "2015", "2016", "2017", "2018", "2019"]}
        },
        dianliangData2:{
            type:Array,
            default:function (){return [150, 200, 259, 360, 378, 450, 450]}
        },
        miao:{
            type:String,
            default:function (){return ""}
        },
        person:{
            type:String,
            default:function (){return ""}
        }
        
    },
    data(){
        return{
             OneMessage: null,
            active_dianliang: "",
            moveListTimer:null,
            // dianChiNumber:0,
            // dianlianglist: [],
            // dianliangData1: ["2014", "2015", "2016", "2017", "2018", "2019"],
            // dianliangData2: [150, 200, 259, 360, 378, 450, 450],
            showMessage:null,
        }
    },
    methods:{
        close(){
            // console.log(this.props,'343')
            this.$emit('closeAlert')
        },
        listMoveing(){
            this.$methods.listMove('#dianliang')
        },
        dianchi(n) {
            let that = this;
            let box = document.getElementById("dianchi");
            let Echart = this.$echarts.init(box, true);
            var data = n; //数值大小
            var max = 100; //满刻度大小
            let option = {
                // title: {
                //     text: '-AQI-',
                //     top:'38%',
                //     left:'center',
                //     textStyle:{
                //         color: '#fff',
                //         fontSize: 18
                //     }
                // },
                // backgroundColor: 'orange',

                color: ["rgb(0,0,200)", "rgba(255,255,255,.2)"],
                series: [
                {
                    type: "pie",
                    center: ["40%", "50%"],
                    radius: ["78%", "70%"],
                    hoverAnimation: false,
                    data: [
                    {
                        name: "",
                        value: data,
                        label: {
                        show: true,
                        position: "center",
                        color: "#fff",
                        fontSize: 38,
                        fontWeight: "bold",
                        formatter: function(o) {
                            return data;
                        }
                        }
                    },
                    {
                        //画剩余的刻度圆环
                        name: "",
                        value: max - data,
                        label: {
                        show: false
                        },
                        labelLine: {
                        show: false
                        }
                    }
                    ]
                },
                {
                    type: "pie",
                    center: ["99%", "99%"],
                    radius: ["47%", "69%"],
                    hoverAnimation: false,
                    data: [
                    {
                        name: "",
                        value: data,
                        label: {
                        show: false
                        },
                        labelLine: {
                        show: false
                        },
                        itemStyle: {
                        color: "rgba(0,0,0,0)"
                        }
                    },
                    {
                        //画中间的图标
                        name: "",
                        value: 0,
                        label: {
                        position: "inside",
                        backgroundColor: {},
                        padding: 10
                        }
                    },
                    {
                        name: "",
                        value: max - data,
                        label: {
                        show: false
                        },
                        labelLine: {
                        show: false
                        },
                        itemStyle: {
                        color: "rgba(0,0,0,0)"
                        }
                    }
                    ]
                }
                ]
            };
            Echart.setOption(option);
        },
        chart2() {
            let that = this;
            let box = document.getElementById("chart2");
            let Echart = this.$echarts.init(box, true);
            let option = {
                // backgroundColor: "#0E204A",
                tooltip: {
                trigger: "axis",
                axisPointer: {
                    lineStyle: {
                    color: {
                        type: "linear",
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                        {
                            offset: 0,
                            color: "rgba(255,255,255,0)" // 0% 处的颜色
                        },
                        {
                            offset: 0.5,
                            color: "rgba(255,255,255,1)" // 100% 处的颜色
                        },
                        {
                            offset: 1,
                            color: "rgba(255,255,255,0)" // 100% 处的颜色
                        }
                        ],
                        global: false // 缺省为 false
                    }
                    }
                }
                },
                grid: {
                top: "18%",
                left: "1%",
                right: "1%",
                bottom: "25%"
                // containLabel: true
                },
                xAxis: [
                {
                    type: "category",
                    boundaryGap: true,
                    axisLine: {
                    //坐标轴轴线相关设置。数学上的x轴
                    show: true,
                    lineStyle: {
                        color: "rgba(255,255,255,0.4)"
                    }
                    },
                    axisLabel: {
                    //坐标轴刻度标签的相关设置
                    textStyle: {
                        color: "#d1e6eb",
                        margin: 15
                    }
                    },
                    axisTick: {
                    show: false
                    },
                    data: that.dianliangData1
                }
                ],
                yAxis: [
                {
                    type: "value",
                    min: 0,
                    // max: 140,
                    splitNumber: 4,
                    splitLine: {
                    show: true,
                    lineStyle: {
                        color: "rgba(255,255,255,0.1)"
                    }
                    },
                    axisLine: {
                    show: false
                    },
                    axisLabel: {
                    show: false,
                    margin: 20,
                    textStyle: {
                        color: "#d1e6eb"
                    }
                    },
                    axisTick: {
                    show: false
                    }
                }
                ],
                series: [
                {
                    name: "注册总量",
                    type: "line",
                    // smooth: true, //是否平滑曲线显示
                    // 			symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
                    showAllSymbol: true,
                    // symbol: 'image://./static/images/guang-circle.png',
                    symbolSize: 8,
                    lineStyle: {
                    normal: {
                        color: "#53fdfe" // 线条颜色
                    },
                    borderColor: "#f0f"
                    },
                    label: {
                    show: true,
                    position: "top",
                    textStyle: {
                        color: "#fff"
                    }
                    },
                    itemStyle: {
                    normal: {
                        color: "rgba(255,255,255,1)"
                    }
                    },
                    tooltip: {
                    show: false
                    },
                    areaStyle: {
                    //区域填充样式
                    normal: {
                        //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                        color: new this.$echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                            {
                            offset: 0,
                            color: "rgba(0,150,239,0.3)"
                            },
                            {
                            offset: 1,
                            color: "rgba(0,253,252,0)"
                            }
                        ],
                        false
                        ),
                        shadowColor: "rgba(53,142,215, 0.9)", //阴影颜色
                        shadowBlur: 20 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
                    }
                    },
                    data: that.dianliangData2
                }
                ]
            };
            Echart.setOption(option);
        },
    },
    created(){

    },
    mounted(){
        this.dianchi(this.dianChiNumber);
        this.chart2();
        this.listMoveing()
    }
}
</script>