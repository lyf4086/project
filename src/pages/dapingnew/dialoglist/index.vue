<template>
    <div class="dialog">
         <i class="el-icon-close del" @click="close"></i>
        <div class="title">
            <div>任务列表</div>
            <div @click="look">查看全部位置</div>
        </div>
        <div class="content">
            <div class="item" v-for="(item,index) in list" :key="index">
                <span></span>
                <span>{{item.vtask}}</span>
                <span>{{item.pname}}</span>
                <span>带队</span>
                <span><i>{{item.num}}</i>人</span>
                <span><i>{{item.guns}}</i>把枪</span>
                <span><i>{{item.bulletCount}}</i>发子弹</span>
                <span @click="item.open=!item.open">详情
                    <i :class="item.open?'el-icon-arrow-down':'el-icon-arrow-right'"></i>
                </span>
                <div class="info" :style="{'height':item.open?'auto':''}">
                    <div class="i" v-for="obj in item.child" :key="obj.policeid">
                        <span>警员姓名：{{obj.policeName}}</span>
                        <span>枪支数量：{{obj.nums}}</span>
                        <span>子弹数量：{{obj.bulletCounts}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {tasklist} from '../apis'
export default {
    props:{
        sid:{
            type:String,
            required:true
        },
        tid:{
            type:String,
            required:true
        }
    },
    data(){
        return {
            list:[]
        }
    },
    methods:{
        tasklist,
        close(){
            this.$emit('close')
        },
        look(){
            let sid=this._props.sid
            let tid=this._props.tid
            localStorage.setItem('mapMarkers_ids',JSON.stringify({sid,tid}))
            this.$router.push({name:'mapMarkers'})
        }
    },
    created(){
        this.tasklist({tid:this.tid,sid:this.sid}).then(res=>{
            if(res.status==200){
                console.log(res.data.data)
                this.list=res.data.data||[]
                this.list=this.list.map(item=>{
                    return {
                        ...item,
                        open:false
                    }
                })
            }
        })
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
    height:1140/@vh;
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
        display: flex;
        justify-content: space-between;
        align-items: center;
        &>div:nth-child(1){
            &::before{
                display: inline-block;
                content:"";
                width: 54/@vw;
                height:50/@vh;
                background: url(../../../assets/sucai/gou1.png) no-repeat;
                background-size: 100% 100%;
                margin:0 30/@vw 0;
            }
        }
        &>div:nth-child(2){
            font-size: 30/@vw;
            width: 235/@vw;
            height:80/@vh;
            line-height: 80/@vh;
            margin-right: 30/@vw;
            background: url(../../../assets/sucai/left_button.png) no-repeat;
            background-size: 100% 100%;
        }
    }
    .content{
        width:100%;
        max-height:930/@vh;
        overflow: auto;
        box-sizing: border-box;
        padding:50/@vh 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-content: space-between;
        .item{
            box-sizing: border-box;
            font-size: 26/@vw;
            color:#fff;
            width:100%;
            min-height:80/@vh;
            border:2/@vw solid #165483;
            background: #0d3863;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
            &>span{
                line-height: 80/@vh;
            }
            .info{
                width: 100%;
                height:0px;
                overflow: hidden;
                .i{
                    box-shadow: inset 0 0 1px 1px rgba(0,0,0,0.2);
                    box-sizing: border-box;
                    padding: 0 100/@vw;
                     width:100%;
                    height:80/@vh;
                    line-height: 80/@vh;
                    display: flex;
                    justify-content: space-around;
                    span{
                        width: 33%;
                        text-align: center;
                    }
                }

            }
            &>span:nth-child(1){
                width: 36/@vw;
                height:36/@vw;
                background: url(../../../assets/sucai/red_y.png) no-repeat;
                background-size: 100% 100%;
                margin: 0 35/@vw;
            }
            &>span:nth-child(2){
                width:238/@vw
            }
            &>span:nth-child(3){
                 width:190/@vw;
                 color:#3aecfd;
            }
            &>span:nth-child(4){
                width:125/@vw
            }
            &>span:nth-child(5){
                width:175/@vw;
                i{
                    color: #3ead68;
                    margin-right: 15/@vw;
                }
            }
            &>span:nth-child(6){
                width:205/@vw;
                i{
                    color:#3aecfd;
                    margin-right: 15/@vw;
                }
            }
            &>span:nth-child(7){
                width:540/@vw;
                i{
                    color:#ff6e6e;
                    margin-right: 15/@vw;
                }
            }
            &>span:nth-child(8){
                width:140/@vw;
                color: #54a9ea;
            }
        
        }
        .item:hover{
            cursor: pointer;
                background: rgba(47,128,237,0.2);
                border-color: transparent;
                box-shadow: 0 1px 20px 0 rgba(58,236,253,0.32),inset 0 0 13px 0 rgba(58,236,253,0.3);
        }
    }
    .content::-webkit-scrollbar {/*滚动条整体样式*/
    width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
    }
    .content::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(63, 4, 173, 0.5);
    background: rgba(34, 3, 117, 0.8);
    }
    .content::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(221, 213, 213, 0.6);
    }
}
</style>