<template>
    <div class="wrap">
        <div class="top">
            <h3>任务列表</h3>
            <span @click="shouqi">收起</span>
        </div>
        <div class="list">
            <div class="itemwrap" v-for="(item,index) in list" :key="index">
                <div class="title">
                    <span></span>
                    <span>{{item.vtask}}</span>
                    <span>{{item.pname}}</span>
                    <span>带队</span>
                    <span><span class="num1">{{item.num}}</span>人</span>
                    <span><span class="num2">{{item.guns}}</span>把枪</span>
                    <span><span class="num3">{{item.bulletCount}}</span>发弹</span>
                    <i :class="openNum==index?'el-icon-arrow-down':'el-icon-arrow-right'" 
                    @click="openOrclose(index)"></i>
                </div>
                <div class="list11" :class="openNum==index?'isopen':''">
                    <div class="item"  v-for="(obj,index) in item.child" :key="obj.policeid">
                        <span>队员{{index+1}}</span>
                        <span>{{obj.policeName}}</span>
                        <span><span>{{obj.nums}}</span>把枪</span>
                        <span><span>{{obj.bulletCounts}}</span>发弹</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {tasklist } from '../dapingnew/apis'
export default {
    data(){
        return {
           openNum:1,
           list:[]
        }
    },
    methods:{
        tasklist,
        shouqi(){
            this.$emit('shouqi')
        },
        openOrclose(n){
            this.openNum==n?this.openNum=-1:this.openNum=n
        }
    },
    created(){
        let ids=JSON.parse(localStorage.getItem('mapMarkers_ids'))
        if(ids.tid){
            
            this.tasklist({tid:ids.tid,sid:ids.sid}).then(res=>{
                if(res.status==200){
                    console.log(res)
                    this.list=res.data.data||[]
                    this.list=this.list.map(item=>{
                        return {
                            ...item,
                            open:false
                        }
                    })
                    console.log(this.list)
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
@vw:38.4vw;
@vh:21.6vh;
.wrap{
    box-sizing: border-box;
    padding: 30/@vw;
    width:1140/@vw;
    height:960/@vh;
    border-radius: 20/@vw;
    background: #fff;
    box-shadow: 0 0 10px 0 rgba(54, 46, 46,.6);
    .top{
        width: 100%;
        height:60/@vh;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20/@vh;
        h3{
            font-size: 33/@vw;
            font-weight: bold;
        }
        span{
            font-size: 26/@vw;
            color:#448fe6;
            cursor:pointer;
            &::after{
                display: inline-block;
                content: "";
                width:0/@vw;
                height:0/@vw;
                margin-left: 5px;
                border-width: 10/@vw;
                border-style: solid;
                border-color: transparent transparent transparent #448fe6;
            }
        }
    }
    .list{
       max-height:810/@vh;
        // max-height:1910/@vh;
        overflow-y: auto;
    }
    .itemwrap{
        box-sizing: border-box;
        border:2/@vw solid #e2e3e5;
        border-radius: 10/@vw;
        font-size: 26/@vw;
        background: #f9fafb;
        min-height: 95/@vh;
        margin-bottom: 28/@vh;
        .title{
            box-sizing: border-box;
            padding: 0 26/@vw;
            height: 95/@vh;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            &>span:nth-child(1){
                width:28/@vw;
                height:28/@vw;
                background: #51a4e4;
            }
            span:nth-child(2){
                width:144/@vw;
                text-align: center;
            }
            span:nth-child(3){
                color: #51a4e4;
            }
            .num1{
                color: #3ead68;
                padding-right: 10/@vw;
            }
            .num2{
                color: #37b8e9;
                padding-right: 10/@vw;
            }
            .num3{
                color:#ff6e6e;
                padding-right: 10/@vw;
            }
            
        }
        .list11{
            box-sizing: border-box;
            width: 100%;
            height: 0;
            padding: 0 26/@vw 0 100/@vw;
            overflow: hidden;
            .item{
                box-sizing: border-box;
                width:100%;
                height:50/@vh;
                border:2/@vw solid #e2e3e5;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                margin-bottom: 10/@vh;
                span:nth-child(1){
                    width: 128/@vw;
                    text-align: center;
                }
                span:nth-child(2){
                    min-width: 200/@vw;
                    text-align: center;
                    color: #51a4e4;
                }
                span:nth-child(3){
                    width: 150/@vw;
                    text-align: center;
                    span{
                        color: #9cdcf4;
                        padding-right: 10/@vw;
                    }
                }
                span:nth-child(4){
                    width: 150/@vw;
                    text-align: center;
                    span{
                        color: #ff6e6e;
                        padding-right: 10/@vw;
                    }
                }
            }
        }
        .isopen{
            height:auto
        }
    }
    .second{
        background-color: #32b8b5;
    }
    .thired{
        background-color: #32b8b5;
    }
}
.wrap::-webkit-scrollbar {/*滚动条整体样式*/
width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
height: 4px;
}
.wrap::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
border-radius: 5px;
-webkit-box-shadow: inset 0 0 5px rgba(63, 4, 173, 0.5);
background: rgba(34, 3, 117, 0.8);
}
.wrap::-webkit-scrollbar-track {/*滚动条里面轨道*/
-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
border-radius: 0;
background: rgba(221, 213, 213, 0.6);
}
</style>