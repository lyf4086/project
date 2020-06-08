<template>
    <div class="wrap">
        <div class="left">
            <div class="item_title">
                出警TOP5
                <i></i>
            </div>
            <div class="item_content1">
                <div class="title">
                    <span>地区</span><span>出勤数量</span>
                </div>
                <div class="item" v-for="(item,index) in list" :key="index">
                    <span>{{item.mechanism_name}}</span><span>{{item.number}}</span>
                </div>
            </div>
        </div>
        <div class="right">
            <div class="item_title">出入库占比情况<i></i></div>
            <div class="item_content2" id="item7_right" @click="chart3xq"></div>
        </div>
    </div>
</template>
<script>
import {getTop5,zanbi} from './apis'
import initChart from './item7_chart'
export default {
    data(){
        return {
            list:[],
            outData:[],
            inputData:[],
            times:[],
            mes: {},
        }
    },
    methods:{
        getTop5,
        zanbi,
        initChart,
        chart3xq() {
            this.$router.push({
                name: "Item14XQ",
                params: this.mes
            });
        },
    },
    created(){
        this.getTop5()
        this.zanbi()
        
    },
    mounted(){
        
    },
    
}
</script>
<style lang="less" scoped>
@vw:38.4vw;
@vh:21.6vh;
.wrap{
    box-sizing: border-box;
    padding:35/@vh 35/@vw;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 680/@vw 620/@vw;
    justify-content: space-between;
}
.item_title{
    position: relative;
    box-sizing: border-box;
    padding-left: 50/@vw;
    font-size: 28/@vw;
    color:#fff;
    line-height: 42/@vh;
    width: 100%;
    height:48/@vh;
    background: url(../../../assets/homepic/s_title_left.png) no-repeat center bottom;
    background-size: 100% 80%;
    i{
        position: absolute;
        right:20/@vw;
        top:15/@vh;
        width: 160/@vw;
        height: 10/@vh;
        background: url(../../../assets/homepic/s_title_right.png) no-repeat;
        background-size: 100% 100%;
    }
}
.left,.right{
    height:600/@vw
}
.item_content1{
    width:666/@vw;
    height:500/@vh;
    .title{
        width: 100%;
        height:100/@vh;
        line-height: 100/@vh;
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns:3fr 1fr ;
        font-size: 30/@vw;
        span:nth-child(1){
            text-indent: 30/@vw;
        }
    }
    .item{
        width: 100%;
        height:80/@vh;
        line-height: 80/@vh;
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns:3fr 1fr ;
        span:nth-child(1){
            text-indent: 30/@vw;
        }
        span:nth-child(2){
            color: #d26219;
        }
    }
    .item:nth-child(even){
        background: rgba(50, 91, 125, 0.6);
    }
}

.item_content2{
    box-sizing: border-box;
    padding-top: 10px;
     position: relative;
    width:1200/@vw;
    height:800/@vw;
    transform: translateX(-22%) translateY(-20%) scale(0.5);
}
.item_content2:hover{
    box-sizing: border-box;
    z-index: 12;
    background-color: #042846;
    transition: 0.3s;
    transform: translateX(-36%) translateY(-29%) scale(1);
}
</style>