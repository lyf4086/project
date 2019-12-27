function chart1(xname=['1','2','3'],datanum=[200,300,500]){
    let item1 = document.getElementById("item1");
    let Echar1 = this.$echarts.init(item1);
    var fontColor = '#30eee9';
    let option ={
        title:{
            // text:'分所销售水量占比',
            top:'5%',
            left:'center',
            textStyle:{
                color:'#FFF',
                align:'center',
            }
        },
            // backgroundColor:'#11183c',
            grid: {
                left: '2%',
                right: '4%',
                top:'20%',
                bottom: '9%',
                containLabel: true
            },
            tooltip : {
                show: true,
                trigger: 'item'
            },
            legend: {
                show:true,
                x:'center',
                top:'12%',
                y:'35',
                icon: 'stack',
                itemWidth:10,
                itemHeight:10,
                textStyle:{
                    color:'#1bb4f6'
                },
                data:['大户','市中','历下','天桥','槐荫','历城']
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    axisLabel:{
                        color: fontColor
                    },
                    axisLine:{
                        show:true,
                        lineStyle:{
                            color:'#397cbc'
                        }
                    },
                    axisTick:{
                        show:false,
                    },  
                    splitLine:{
                        show:false,
                        lineStyle:{
                            color:'#195384'
                        }
                    },
                    data : xname
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    // name : '立方米',
                    min:0,
                    // max:1000,
                    axisLabel : {
                        formatter: '{value}',
                        textStyle:{
                            color:'#2ad1d2'
                        }
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#27b4c2'
                        }
                    },
                    axisTick:{
                        show:false,
                    },
                    splitLine:{
                        show:true,
                        lineStyle:{
                            color:'#11366e'
                        }
                    }
                },
                {
                    type : 'value',
                    // name : '占比',
                    min:0,
                    // max:1000,
                    axisLabel : {
                        formatter: '{value} %',
                        textStyle:{
                            color:'#186afe'
                        }
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#186afe'
                        }
                    },
                    axisTick:{
                        show:false,
                    },
                    splitLine:{
                        show:true,
                        lineStyle:{
                            color:'#11366e'
                        }
                    }
                }
            ],
            series : [
                {
                    name:'',
                    type:'line',
                    stack: '总量',
                    symbol:'circle',
                    symbolSize: 8,
                    itemStyle: {
                        normal: {
                            color:'#0092f6',
                            lineStyle: {
                                color: "#0092f6",
                                width:1
                            },
                            areaStyle: { 
                                //color: '#94C9EC'
                                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                    offset: 0,
                                    color: 'rgba(7,44,90,0.3)'
                                }, {
                                    offset: 1,
                                    color: 'rgba(0,146,246,0.9)'
                                }]),
                            }
                        }
                    },
                    markPoint:{
                        itemStyle:{
                            normal:{
                                color:'red'
                            }
                        }
                    },
                    data:datanum
                }
            ]
        };
        Echar1.setOption(option)
}
function round1(num1=0,num2=0,total=0){
    let round1 = document.getElementById("round1");
    let Echart = this.$echarts.init(round1);
    var dataArr =[{
            value: num1,
            name: '入套报警',
        },
        {
            value:num2,
            name: '区域报警'
        }
    ];
    let option = {
        
        title: {
            text: `${num1}/${total}`,
            y: 'center',
            x: 'center',
            textStyle: {
                color: '#fff',
                fontSize:16,
                fontWeight:'100'
            }
        },

        tooltip: {
            // show:false,
            trigger: 'item',
            // formatter: "{b} : {c} ({d}%)"
        },

        visualMap: {
            show: false,
            min: 500,
            max: 600,
            inRange: {
                //colorLightness: [0, 1]
            }
        },
        series: [{
            // name: '访问来源',
            type: 'pie',
            clockwise:false,
            radius: '50%',
            selectedMode: 'single',
            selectedOffset: 10,
            center: ['50%', '50%'],
            color: ['rgba(255,255,255,0)', '#165DAD'], //'#FBFE27','rgb(11,228,96)','#FE5050'
            data:dataArr,
            hoverAnimation:false,
            roseType: 'radius',
            itemStyle: {
                borderWidth: '20',
                color: 'pink',
                borderColor: '#FFF',
                normal: {
                    // borderWidth: '10',
                    // borderColor: 'rgba(0,0,0,2)',
                },
            },
            label: {
                show: false
            },
            labelLine: {
                show: false
            },
            z:1
        },
        {
            "type": "pie",
            "center": ["50%", "50%"],
            "radius": ["43%", "42.5%"],
            "hoverAnimation": false,
            "data": [{
                "name": "",
                "value": 45,
                "z": 5,
                "labelLine": {
                    "show":false,
                    "length2": 80,
                    "lineStyle": {
                        "color": "#fffff",
                        "width": 1.5
                    }
                },
                itemStyle:{
                    normal:{
                        color:'#3EAADB'
                        // shadowColor: 'rgba(79,175,226,1)',
                        // shadowBlur: 20
                    }
                },
                label: {
                    normal: {
                    position: 'inner',//隐藏引导线
                    show : false//隐藏标识文字
                    }
                }
            },
            ]
        }
        ]
    };
    Echart.setOption(option)
}
function round2(obj){
    let round2 = document.getElementById("round2");
    let Echart = this.$echarts.init(round2);
    var dataArr =[{
            value: obj.sum,
            name: '全部',
        },
        {
            value:obj.total,
            name: '二级'
        }
    ];
    let option = {
        
        title: {
            text: `${obj.ratio}`,
            y: 'center',
            x: 'center',
            textStyle: {
                color: '#fff',
                fontSize:16,
                fontWeight:'100'
            }
        },

        tooltip: {
            // show:false,
            trigger: 'item',
            // formatter: "{b} : {c} ({d}%)"
        },

        visualMap: {
            show: false,
            min: 500,
            max: 600,
            inRange: {
                //colorLightness: [0, 1]
            }
        },
        series: [{
            // name: '访问来源',
            type: 'pie',
            clockwise:false,
            radius: '50%',
            selectedMode: 'single',
            selectedOffset: 10,
            center: ['50%', '50%'],
            color: ['rgba(255,255,255,0)', '#165DAD'], //'#FBFE27','rgb(11,228,96)','#FE5050'
            data:dataArr,
            hoverAnimation:false,
            roseType: 'radius',
            itemStyle: {
                borderWidth: '20',
                color: 'pink',
                borderColor: '#FFF',
                normal: {
                    // borderWidth: '10',
                    // borderColor: 'rgba(0,0,0,2)',
                },
            },
            label: {
                show: false
            },
            labelLine: {
                show: false
            },
            z:1
        },
        {
            "type": "pie",
            "center": ["50%", "50%"],
            "radius": ["43%", "42.5%"],
            "hoverAnimation": false,
            "data": [{
                "name": "",
                "value": 45,
                "z": 5,
                "labelLine": {
                    "show":false,
                    "length2": 80,
                    "lineStyle": {
                        "color": "#fffff",
                        "width": 1.5
                    }
                },
                itemStyle:{
                    normal:{
                        color:'#3EAADB'
                        // shadowColor: 'rgba(79,175,226,1)',
                        // shadowBlur: 20
                    }
                },
                label: {
                    normal: {
                    position: 'inner',//隐藏引导线
                    show : false//隐藏标识文字
                    }
                }
            },
            ]
        }
        ]
    };
    Echart.setOption(option)
}
function round3(obj){
    let round3 = document.getElementById("round3");
    let Echart = this.$echarts.init(round3);
    var dataArr =[{
            value: obj.sum,
            name: '全部',
        },
        {
            value:obj.total,
            name: '三级'
        }
    ];
    let option = {
        
        title: {
            text: `${obj.ratio}`,
            y: 'center',
            x: 'center',
            textStyle: {
                color: '#fff',
                fontSize:16,
                fontWeight:'100'
            }
        },

        tooltip: {
            // show:false,
            trigger: 'item',
            // formatter: "{b} : {c} ({d}%)"
        },

        visualMap: {
            show: false,
            min: 500,
            max: 600,
            inRange: {
                //colorLightness: [0, 1]
            }
        },
        series: [{
            // name: '访问来源',
            type: 'pie',
            clockwise:false,
            radius: '50%',
            selectedMode: 'single',
            selectedOffset: 10,
            center: ['50%', '50%'],
            color: ['rgba(255,255,255,0)', '#165DAD'], //'#FBFE27','rgb(11,228,96)','#FE5050'
            data:dataArr,
            hoverAnimation:false,
            roseType: 'radius',
            itemStyle: {
                borderWidth: '20',
                color: 'pink',
                borderColor: '#FFF',
                normal: {
                    // borderWidth: '10',
                    // borderColor: 'rgba(0,0,0,2)',
                },
            },
            label: {
                show: false
            },
            labelLine: {
                show: false
            },
            z:1
        },
        {
            "type": "pie",
            "center": ["50%", "50%"],
            "radius": ["43%", "42.5%"],
            "hoverAnimation": false,
            "data": [{
                "name": "",
                "value": 45,
                "z": 5,
                "labelLine": {
                    "show":false,
                    "length2": 80,
                    "lineStyle": {
                        "color": "#fffff",
                        "width": 1.5
                    }
                },
                itemStyle:{
                    normal:{
                        color:'#3EAADB'
                        // shadowColor: 'rgba(79,175,226,1)',
                        // shadowBlur: 20
                    }
                },
                label: {
                    normal: {
                    position: 'inner',//隐藏引导线
                    show : false//隐藏标识文字
                    }
                }
            },
            ]
        }
        ]
    };
    Echart.setOption(option)
}
function round4(obj){
    let round4 = document.getElementById("round4");
    let Echart = this.$echarts.init(round4);
    var dataArr =[{
            value: obj.sum,
            name: '全部',
        },
        {
            value:obj.total,
            name: '四级'
        }
    ];
    let option = {
        
        title: {
            text: `${obj.ratio}`,
            y: 'center',
            x: 'center',
            textStyle: {
                color: '#fff',
                fontSize:16,
                fontWeight:'100'
            }
        },

        tooltip: {
            // show:false,
            trigger: 'item',
            // formatter: "{b} : {c} ({d}%)"
        },

        visualMap: {
            show: false,
            min: 500,
            max: 600,
            inRange: {
                //colorLightness: [0, 1]
            }
        },
        series: [{
            // name: '访问来源',
            type: 'pie',
            clockwise:false,
            radius: '50%',
            selectedMode: 'single',
            selectedOffset: 10,
            center: ['50%', '50%'],
            color: ['rgba(255,255,255,0)', '#165DAD'], //'#FBFE27','rgb(11,228,96)','#FE5050'
            data:dataArr,
            hoverAnimation:false,
            roseType: 'radius',
            itemStyle: {
                borderWidth: '20',
                color: 'pink',
                borderColor: '#FFF',
                normal: {
                    // borderWidth: '10',
                    // borderColor: 'rgba(0,0,0,2)',
                },
            },
            label: {
                show: false
            },
            labelLine: {
                show: false
            },
            z:1
        },
        {
            "type": "pie",
            "center": ["50%", "50%"],
            "radius": ["43%", "42.5%"],
            "hoverAnimation": false,
            "data": [{
                "name": "",
                "value": 45,
                "z": 5,
                "labelLine": {
                    "show":false,
                    "length2": 80,
                    "lineStyle": {
                        "color": "#fffff",
                        "width": 1.5
                    }
                },
                itemStyle:{
                    normal:{
                        color:'#3EAADB'
                        // shadowColor: 'rgba(79,175,226,1)',
                        // shadowBlur: 20
                    }
                },
                label: {
                    normal: {
                    position: 'inner',//隐藏引导线
                    show : false//隐藏标识文字
                    }
                }
            },
            ]
        }
        ]
    };
    Echart.setOption(option)
}
/* function initMap(n=1){
    // selectCity=[[{name: '北京',value: 1000,selected:true}]]
    let that=this
    let main=document.getElementById('main')
    var myChart = this.$echarts.init(main);

    var geoCoordMap = {
        '黑龙江': [127.9688, 45.368],
        '内蒙古': [110.3467, 41.4899],
        "吉林": [125.8154, 44.2584],
        '北京': [116.4551, 40.2539],
        "辽宁": [123.1238, 42.1216],
        "河北": [114.4995, 38.1006],
        "天津": [117.4219, 39.4189],
        "山西": [112.3352, 37.9413],
        "陕西": [109.1162, 34.2004],
        "甘肃": [103.5901, 36.3043],
        "宁夏": [106.3586, 38.1775],
        "青海": [101.4038, 36.8207],
        "新疆": [87.9236, 43.5883],
        "西藏": [91.11, 29.97],
        "四川": [103.9526, 30.7617],
        "重庆": [108.384366, 30.439702],
        "山东": [117.1582, 36.8701],
        "河南": [113.4668, 34.6234],
        "江苏": [118.8062, 31.9208],
        "安徽": [117.29, 32.0581],
        "湖北": [114.3896, 30.6628],
        "浙江": [119.5313, 29.8773],
        "福建": [119.4543, 25.9222],
        "江西": [116.0046, 28.6633],
        "湖南": [113.0823, 28.2568],
        "贵州": [106.6992, 26.7682],
        "云南": [102.9199, 25.4663],
        "广东": [113.12244, 23.009505],
        "广西": [108.479, 23.1152],
        "海南": [110.3893, 19.8516],
        '上海': [119.1803, 31.2891],
        '台湾': [121.4648, 25.5630]
    };
    console.log('this.cityData',this.cityData)
    var chinaDatas = this.cityData
    // [
    //     [{
    //         name: '黑龙江',
    //         selected:true,
    //         value: 100
    //     }],
    //     [{
    //         name: '内蒙古',
    //         value: 300
    //     }],
    //     [{
    //         name: '吉林',
    //         value: 300
    //     }],
    //     [{
    //         name: '辽宁',
    //         value: 300
    //     }],
    //     [{
    //         name: '河北',
    //         value: 300
    //     }],
    //     [{
    //         name: '天津',
    //         value: 300
    //     }],
    //     [{
    //         name: '山西',
    //         value: 300
    //     }],
    //     [{
    //         name: '陕西',
    //         value: 300
    //     }],
    //     [{
    //         name: '甘肃',
    //         value: 300
    //     }],
    //     [{
    //         name: '宁夏',
    //         value: 300
    //     }],
    //     [{
    //         name: '青海',
    //         value: 300
    //     }],
    //     [{
    //         name: '新疆',
    //         value: 300
    //     }],
    //     [{
    //         name: '西藏',
    //         value: 300
    //     }],
    //     [{
    //         name: '四川',
    //         value: 300
    //     }],
    //     [{
    //         name: '重庆',
    //         value: 300
    //     }],
    //     [{
    //         name: '山东',
    //         value: 300
    //     }],
    //     [{
    //         name: '河南',
    //         value: 300
    //     }],
    //     [{
    //         name: '江苏',
    //         value: 300
    //     }],
    //     [{
    //         name: '安徽',
    //         value: 300
    //     }],
    //     [{
    //         name: '湖北',
    //         value: 300
    //     }],
    //     [{
    //         name: '浙江',
    //         value: 300
    //     }],
    //     [{
    //         name: '福建',
    //         value: 300
    //     }],
    //     [{
    //         name: '江西',
    //         value: 300
    //     }],
    //     [{
    //         name: '湖南',
    //         value: 300
    //     }],
    //     [{
    //         name: '贵州',
    //         value: 300
    //     }],
    //     [{
    //         name: '广西',
    //         value: 300
    //     }],
    //     [{
    //         name: '海南',
    //         value: 300
    //     }],
    //     [{
    //         name: '上海',
    //         value: 1300
    //     }],
    //     [{
    //         name: '广东',
    //         value: 1300
    //     }],
    //     [{
    //         name: '云南',
    //         value: 1300
    //     }],
    //     [{
    //         name: '北京',
    //         value: 1300
    //     }],
    //     [{
    //         name: '台湾',
    //         value: 1300
    //     }]
    // ];
    console.log('nnn',n)
    var defaultP = [chinaDatas[n]]
    // [
    //     [{
    //         name: '北京',
    //         value: 1300
    //     }]
    // ]
    var convertData = function(data) {
        console.log(data[i][0])
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var geoCoord = geoCoordMap[data[i][0].name];
            // console.log(geoCoord, 'geoCoord')
            if (geoCoord) {
                res.push({
                    name: data[i][0].name,
                    value: geoCoord.concat(data[i][0].value),
                    value1:data[i][0].value1||0,
                    value2:data[i][0].value2||0,
                    value3:data[i][0].value3||0,
                    value4:data[i][0].value4||0
                });
            }
        }
        // console.log(res, '///')
        return res;
    };

    var option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item',
            triggerOn: 'click',
            backgroundColor: '#4f50da',
            alwaysShowContent: true,
            formatter(params, p, a) {
                // console.log(params.data)
                return `&nbsp;&nbsp;&nbsp;&nbsp;区域名：${params.data.name}&nbsp;&nbsp;&nbsp;&nbsp;<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;任务总数：${params.data.value[2]}&nbsp;&nbsp;<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;一级任务：${params.data.value1}&nbsp;&nbsp;<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;二级任务：${params.data.value2}&nbsp;&nbsp;<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;三级任务：${params.data.value3}&nbsp;&nbsp;<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;四级任务：${params.data.value4}&nbsp;&nbsp;<br/><br/>
                        `
            }
        },
        geo: {
            map: 'china',
            label: {
                emphasis: {
                    color: 'white',
                    show: false
                }
            },
            zoom: 1.2,
            itemStyle: {
                normal: {
                    shadowColor: 'rgba(128, 217, 248, .2)',
                    shadowOffsetX: 6,
                    shadowOffsetY: 6,
                    shadowBlur: 1,
                    borderWidth: 1, // 区域边框宽度
                    borderColor: 'rgba(37, 88, 184, 0.8)', // 区域边框颜色
                    areaColor: '#0ebcf7' // 区域颜色
                },
                emphasis: {
                    // areaColor: '#3889FF'
                    areaColor: '#f4c736'
                }
            },
            regions: defaultP[0],
            tooltip: {
                show: false
            }
        },
        series: [
            {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            z:1,
        
            data: convertData(defaultP),
        
            symbolSize: 84,
            itemStyle: {              
                color:'rgba(255,8,9,0.3)',       
            },
            tooltip: {
                show: true
            }
        }, {
            type: 'map',
            mapType: 'china',
            geoIndex: 0,
            z: 0,
            data: convertData(chinaDatas)
        }]
    };
    myChart.setOption(option)
    setTimeout(() => {
        myChart.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: 0
        })

    }, 0)
    // var mymap = echarts.init(document.getElementById('main'));
    // mymap.setOption(options);
    myChart.on('click', params => {
        if (params.seriesType === 'map') {
            // 如果不存在，则不能选中
            // console.log(params)
            const selectData = convertData([
                [{
                    name: params.name,
                    value: params.data.value[2]
                }]
            ])
            option.geo.regions = [{
                name: params.name,
                selected: true
            }]

            // 显示光圈
            option.series[0].data = selectData
            myChart.setOption(option)
            setTimeout(() => {
                myChart.dispatchAction({
                    type: 'showTip',
                    seriesIndex: 0,
                    dataIndex: 0
                })

            }, 0)

        }
    })

} */


export {
    chart1,
    round1,
    round2,
    round3,
    round4,
    // initMap
}