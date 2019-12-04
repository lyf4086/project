<template>
    <div class="wrap">
        <div class="main">
            <button class="close" @click="close11"></button>
            <div class="item1">
                <div class="tit">枪弹药列表详情</div>
                <div class="list-wrap">
                    <div class="list" id="dp-item1-list">
                        <div class="item" v-for="(item,index) in list" :key="index">
                            <div class="l">
                                <span>{{item.sname}}</span>
                                <div class="name">弹药总数</div>
                                <div class="number">{{item.total}}</div>
                                <span>枚</span>
                            </div>
                            <div class="c">
                                <div class="name">在库数量</div>
                                <div class="number">{{item.zaiku}}</div>
                                <span>枚</span>
                            </div>
                            <div class="r">
                                <div class="name">出库数量</div>
                                <div class="number">{{item.chuku}}</div>
                                <span>枚</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item2">
                <div class="tit">各单位总量占比情况</div>
                <div id="child1_chart1"></div>
            </div>
            <div class="item3">
                <div class="tit">各单位数量详情</div>
                <div id="child1_chart2"></div>
            </div>
        </div>
    </div>
</template>
<style scoped>
@import url(./child1.css);
</style>
<script>
export default {
    props:{
        list:{
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
        close11(){
            this.$emit('close')
        },
        listMove(){
            this.$methods.listMove("#dp-item1-list",2000)
        },
        chartleft(names,list){
            let that = this;
            let box = document.getElementById("child1_chart1");
            let Echart = this.$echarts.init(box);
            let option = {
                "animation": true,
                "title": {
                    "text": '',
                    "subtext": "沥青工",
                    "x": "center",
                    "y": "center",
                    "textStyle": {
                        "color": "#fff",
                        "fontSize": 60,
                        "fontWeight": "normal",
                        "align": "center",
                        "width": "200px"
                    },
                    "subtextStyle": {
                        "color": "#fff",
                        "fontSize": 20,
                        "fontWeight": "normal",
                        "align": "center"
                    }
                },
                "legend": {
                    "width": "100%",
                    "left": "center",
                    "textStyle": {
                        "color": "#fff",
                        "fontSize": 14
                    },
                    "icon": "circle",
                    "right": "0",
                    "bottom": "0",
                    "padding": [1, 20],
                    "itemGap": 20,
                    "data": names
                    // ["测量工", "电焊工", "钢筋工", "沥青工", "安装工", "起重工", "养护工", "其它"]
                },
                "series": [{
                    "type": "pie",
                    "center": ["50%", "50%"],
                    "radius": ["40%", "53%"],
                    "color": ["#FEE449", "#00FFFF", "#00FFA8", "#9F17FF", "#FFE400", "#F76F01", "#01A4F7", "#FE2C8A"],
                    "startAngle": 135,
                    "labelLine": {
                        "normal": {
                            "length": 25
                        }
                    },
                    "label": {
                        "normal": {
                            "formatter": "{b|{b}:}  {per|{d}%} ",
                            "backgroundColor": "rgba(255, 147, 38, 0)",
                            "borderColor": "transparent",
                            "borderRadius": 4,
                            "rich": {
                                "a": {
                                    "color": "#999",
                                    "lineHeight": 22,
                                    "align": "center"
                                },
                                "hr": {
                                    "borderColor": "#aaa",
                                    "width": "100%",
                                    "borderWidth": 1,
                                    "height": 0
                                },
                                "b": {
                                    "color": "#b3e5ff",
                                    "fontSize": 16,
                                    "lineHeight": 33
                                },
                                "c": {
                                    "fontSize": 14,
                                    "color": "#eee"
                                },
                                "per": {
                                    "color": "#FDF44E",
                                    "fontSize": 14,
                                    "padding": [5, 8],
                                    "borderRadius": 2
                                }
                            },
                            "textStyle": {
                                "color": "#fff",
                                "fontSize": 16
                            }
                        }
                    },
                    "emphasis": {
                        "label": {
                            "show": true,
                            "formatter": "{b|{b}:}  {per|{d}%}  ",
                            "backgroundColor": "rgba(255, 147, 38, 0)",
                            "borderColor": "transparent",
                            "borderRadius": 4,
                            "rich": {
                                "a": {
                                    "color": "#999",
                                    "lineHeight": 22,
                                    "align": "center"
                                },
                                "hr": {
                                    "borderColor": "#aaa",
                                    "width": "100%",
                                    "borderWidth": 1,
                                    "height": 0
                                },
                                "b": {
                                    "color": "#fff",
                                    "fontSize": 18,
                                    "lineHeight": 33
                                },
                                "c": {
                                    "fontSize": 14,
                                    "color": "#eee"
                                },
                                "per": {
                                    "color": "#FDF44E",
                                    "fontSize": 25,
                                    "padding": [5, 6],
                                    "borderRadius": 2
                                }
                            }
                        }
                    },
                    "data": list
                }, {
                    "type": "pie",
                    "center": ["50%", "50%"],
                    "radius": ["35%", "36%"],
                    "label": {
                        "show": false
                    },
                    "data": [{
                        "value": 78,
                        "name": "实例1",
                        "itemStyle": {
                            "normal": {
                                "color": {
                                    "x": 0,
                                    "y": 0,
                                    "x2": 1,
                                    "y2": 0,
                                    "type": "linear",
                                    "global": false,
                                    "colorStops": [{
                                        "offset": 0,
                                        "color": "#9F17FF"
                                    }, {
                                        "offset": 0.2,
                                        "color": "#01A4F7"
                                    }, {
                                        "offset": 0.5,
                                        "color": "#FE2C8A"
                                    }, {
                                        "offset": 0.8,
                                        "color": "#FEE449"
                                    }, {
                                        "offset": 1,
                                        "color": "#00FFA8"
                                    }]
                                }
                            }
                        }
                    }]
                }]
            }
            Echart.setOption(option)
        },
        chartright(types,citys,zongliang,zaiku,chuku){
            let that = this;
            let box = document.getElementById("child1_chart2");
            let Echart = this.$echarts.init(box);
            let option = {
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    textStyle:{
                        color:"#fff"
                    },
                    data: types
                    // ['A级门店', 'B级门店','C级门店']
                },
                grid: {
                    left: '10%',
                    right: '10%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis:  {
                    type: 'value',
                    // max: 100000,
                     axisLabel: {
                        show: true,
                        color: '#fff',
                        fontSize:14
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#fff'
                        }
                    }
                },
                yAxis: {
                    axisLabel: {
                        color: '#fff',
                        formatter: '{value}'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#fff'
                        }
                    },
                    type: 'category',
                    data: citys
                    // ['福建','广州','厦门','南宁','背景','长沙','重庆']
                },
                series: [
                    {
                        name: types[0],
                        type: 'bar',
                        stack: '总量',
                        barWidth: 10,
                        itemStyle:{
                            normal: {
                                color: '#c23531',
                                // barBorderRadius: [20, 20, 20, 20],
                            }
                        },
                        label: {
                            normal: {
                                color:"transparent",//字体颜色
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        z:  10,
                        data: zongliang
                    },
                    {
                        name: types[1],
                        type: 'bar',
                        stack: '总量',
                        barWidth: 10,
                        itemStyle:{
                            normal: {
                                color: '#2f4554',
                                shadowBlur: [0, 0, 0, 10],
                                shadowColor: '#ebe806',
                                // barBorderRadius: [20, 20, 20, 20],
                                shadowOffsetX: -20,
                            }
                        },
                        label: {
                            normal: {
                                color:"transparent",//字体颜色
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        z: 5,
                        data: zaiku
                    },
                    {
                        name: types[2],
                        type: 'bar',
                        stack: '总量',
                        barWidth: 10,
                        itemStyle:{
                            normal: {
                                // barBorderRadius: [20, 20, 20, 20],
                                color: '#61a0a8',
                                shadowBlur: [0, 0, 0, 10],
                                shadowColor: '#ff5624',
                                shadowOffsetX: -20,
                            }
                        },
                        label: {
                            normal: {
                                color:"transparent",//字体颜色
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        
                        data: chuku
                    },
                    // {  // 灰色背景柱状图
                    //     type: 'bar',
                    //     barGap: '-100%',
                    //     barWidth: 30,
                    //     itemStyle: {
                    //         normal: {
                    //             color: '#ccc',
                    //             barBorderRadius: [20, 20, 20, 20],
                    //         }
                    //     },
                    //     z: -10,
                    //     data: ['1000', '1000']
                    // }, 
                ]
            };
            Echart.setOption(option)

        }
    },
    mounted(){
        console.log('child1打开')
       if(this.list.length>4){
            this.listMove()
        }
        let chart1Names=this.list.map(item=>item.sname)
        let chart1List=this.list.map(item=>{
            return {
                "name":item.sname,
                "value":item.total
            }
        })
        this.chartleft(chart1Names,chart1List)

        let chart2names=['总量','在线','不在线']
        let zongliang=this.list.map(item=>item.total)
        let zaiku=this.list.map(item=>item.zaiku)
        let chuku=this.list.map(item=>item.chuku)
        this.chartright(chart2names,chart1Names,zongliang,zaiku,chuku)
    }
}
</script>