<template>
    <div class="wrap">
        <div class="main">
            <button class="close" @click="cl"></button>
            <div class="up-area">
                <div class="nav">
                    <div class="btns">
                        <div class="btn" :class="{'active':activeNum==index}"
                             v-for="(item,index) in nav" :key="index"
                             @click="btnClick(index)"
                        >{{item}}</div>
                        <!-- <div class="btn">报警数量</div>
                        <div class="btn">弹药消耗</div> -->
                    </div>
                    <div class="selects">
                        <!-- <el-date-picker
                            v-model="stime"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker> -->
                        <input type="date" v-model="stime">
                        <span>至</span>
                        <input type="date" v-model="etime">
                        <!-- <el-date-picker
                            v-model="etime"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker> -->
                        <button @click="searchData">查询</button>
                    </div>
                </div>
                <div class="title">
                    <!-- <span>单位</span> -->
                    <span v-for="(item,index) in titlearr" :key="index">{{item}}</span>
                    <!-- <span>一级任务（个）</span>
                    <span>二级任务（个）</span>
                    <span>三级任务（个）</span>
                    <span>四级任务（个）</span> -->
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
                        <div class="item" v-for="(item,index) in list" :key="index">
                            <span>{{item.cname}}</span>
                            <span>{{item.total}}</span>
                            <span v-for="(e,i) in item.number" :key="i">{{e}}</span>
                            <!-- <span>一级任务（个）</span>
                            <span>二级任务（个）</span>
                            <span>三级任务（个）</span>
                            <span>四级任务（个）</span> -->
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
    props:{
        dataObj:{
            type:Object,
            default:{}
        },
        activeid:{
            type:String,
            default:''
        }
    },
    data(){
        return {
            loading:null,
            noClick:true,
            stime:'',
            etime:'',
            activeNum:0,
            titlearr:[],
            list:[],
            nav:['任务执行','报警数量','弹药消耗']
        }
    },
    methods:{
        searchData(){
            if(this.noClick){
                let stime=this.stime;
                let etime=this.etime;
                if(new Date(stime).getTime() >new Date(etime).getTime()){
                    this.$message({
                        type:"error",
                        message:"请重新选择时间"
                    })
                     return
                }

               
                if(this.activeNum===0){
                    this.renwuzhixing(this.activeid,stime,etime)
                }else if(this.activeNum===1){
                    this.baojingpaihang(this.activeid,stime,etime)
                }else{
                    this.xiaohaopaihang(this.activeid,stime,etime)
                }
                this.noClick=false
                setTimeout(() => {
                    this.noClick=true
                }, 1000);
            }
        },
        btnClick(index){
            this.activeNum=index
            if(index===0){
                this.renwuzhixing(this.activeid)
            }else if(index===1){
                this.baojingpaihang(this.activeid)
            }else{
                this.xiaohaopaihang(this.activeid)
            }
        },
        cl(){
            this.$emit('close')
        },
        listMove(){
            // this.$methods.listMove("#move-list-item4",2000)
        },
        // yiji,erji,sanji,siji
        chart(arr){
            let citys=arr.map(e=>e.name)
           
            let series=arr.map((item,index)=>{
                return {
                    name: item.name,
                    type: 'bar',
                    barWidth: '15%',
                    itemStyle: {
                    normal: {
                        color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: `#${index}bd${index<10?'9'+index:index}e`
                        }, {
                            offset: 1,
                            color: `#${index<10?'9'+index:index}bcb${index}`
                        }]),
                        barBorderRadius: 11,
                    }
                    
                    },
                    data: item.number
                }
                
            })
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
                    data:arr.map(e=>e.name), 
                    // ['一级任务', '二级任务', '三级任务','四级任务'],
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
                    data: citys,
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
                    // max:'1200',
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
                series: series
                // [{
                //     name: '一级任务',
                //     type: 'bar',
                //     barWidth: '15%',
                //     itemStyle: {
                //     normal: {
                //         color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                //             offset: 0,
                //             color: '#fccb05'
                //         }, {
                //             offset: 1,
                //             color: '#f5804d'
                //         }]),
                //         barBorderRadius: 12,
                //     },
                //     },
                //     data:arr[0].number
                // },
                // {
                //     name: '二级任务',
                //     type: 'bar',
                //     barWidth: '15%',
                //     itemStyle: {
                //     normal: {
                //         color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                //             offset: 0,
                //             color: '#8bd46e'
                //         }, {
                //             offset: 1,
                //             color: '#09bcb7'
                //         }]),
                //         barBorderRadius: 11,
                //     }
                    
                //     },
                //     data: arr[1].number
                // },
                // {
                //     name: '三级任务',
                //     type: 'bar',
                //     barWidth: '15%',
                //     itemStyle: {
                //     normal: {
                //         color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                //             offset: 0,
                //             color: '#248ff7'
                //         }, {
                //             offset: 1,
                //             color: '#6851f1'
                //         }]),
                //     barBorderRadius: 11,
                //     }
                //     },
                //     data: arr[2].number
                // },
                // {
                //     name: '四级任务',
                //     type: 'bar',
                //     barWidth: '15%',
                //     itemStyle: {
                //     normal: {
                //         color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                //             offset: 0,
                //             color: '#148cf7'
                //         }, {
                //             offset: 1,
                //             color: '#c311f1'
                //         }]),
                //     barBorderRadius: 11,
                //     }
                //     },
                //     data: arr[3].number
                // }
                // ]
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
       renwuzhixing(server_id='',stime='',etime=''){
           this.loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            var objs = {"server_id":server_id ,"stime":stime,"etime":etime};
            console.log(objs)
            var key = this.$store.state.key;
            var sign = this.$methods.mkSign(objs, key);
            var token = this.$gscookie.getCookie("gun");
            var params = new URLSearchParams();
            params.append("sign", sign);
            params.append("token", token);
            params.append("server_id", objs.server_id);
            params.append("stime", objs.stime);
            params.append("etime", objs.etime);
            this.$axios({
            url:
                this.$store.state.baseURL +
                "/weixin/project/index.php?m=Home&c=Page&a=moth_task",
            method: "POST",
            changeOrigin: true,
            data: params
            })
            .then(data => {
                if(data.status==200){
                    this.loading.close()
                    this.titlearr=["单位",...data.data.tasks]
                    this.list=data.data.data
                   let arr=data.data.data.map((item,index)=>{
                       return {
                           name:item.cname,
                           number:item.number
                       }
                   })
                    this.chart(arr)
                }
            })
            .catch(error => {
                console.log(error);
            });
        },
        baojingpaihang(server_id='',stime='',etime=''){
             this.loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            var objs = {"server_id":server_id ,"stime":stime,"etime":etime};
            var key = this.$store.state.key;
            var sign = this.$methods.mkSign(objs, key);
            var token = this.$gscookie.getCookie("gun");
            var params = new URLSearchParams();
            params.append("sign", sign);
            params.append("token", token);
            params.append("server_id", objs.server_id);
            params.append("stime", objs.stime);
            params.append("etime", objs.etime);
            this.$axios({
            url:
                this.$store.state.baseURL +
                "/weixin/project/index.php?m=Home&c=Page&a=moth_alarm",
            method: "POST",
            changeOrigin: true,
            data: params
            })
            .then(data => {
                if(data.status==200){
                    this.loading.close()
                    console.log(data.data)

                    this.titlearr=["单位","总数",...data.data.type.map(e=>e.name)]
                    this.list=data.data.data
                    console.log(this.list)
                    let arr=data.data.data.map((item,index)=>{
                       return {
                           name:item.cname,
                           number:item.number
                       }
                   })
                    this.chart(arr)
                }
            })
            .catch(error => {
                console.log(error);
            });
        },
        xiaohaopaihang(server_id='',stime='',etime=''){
             this.loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            var objs = {"server_id":server_id ,"stime":stime,"etime":etime};
            var key = this.$store.state.key;
            var sign = this.$methods.mkSign(objs, key);
            var token = this.$gscookie.getCookie("gun");
            var params = new URLSearchParams();
            params.append("sign", sign);
            params.append("token", token);
            params.append("server_id", objs.server_id);
            params.append("stime", objs.stime);
            params.append("etime", objs.etime);
            this.$axios({
            url:
                this.$store.state.baseURL +
                "/weixin/project/index.php?m=Home&c=Page&a=moth_arm",
            method: "POST",
            changeOrigin: true,
            data: params
            })
            .then(data => {
                if(data.status==200){
                    this.loading.close()
                    // console.log(data.data.data)
                     this.titlearr=["单位","总数",...data.data.type.map(e=>e.vDXingHao)]
                    this.list=data.data.data
                    // console.log(this.list)
                    let arr=data.data.data.map((item,index)=>{
                       return {
                           name:item.cname,
                           number:item.number
                       }
                   })
               
                    this.chart(arr)
                }
            })
            .catch(error => {
                console.log(error);
            });
        }
    },
    mounted(){
        
        this.titlearr=["单位",...this.dataObj.tasks]
        this.list=this.dataObj.data
        let citys=this.dataObj.data.map(e=>e.cname)
        let arr=this.dataObj.data.map(item=>{
            return {
                name:item.cname,
                number:item.number
            }
        })
        this.chart(arr)
       
    }
}
</script>