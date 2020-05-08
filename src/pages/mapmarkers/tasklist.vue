<template>
    <div class="wrap">
        <div class="top">
            <h3>任务列表</h3>
            <span @click="shouqi">收起</span>
        </div>
        <div class="itemwrap" v-for="e in 3">
            <div class="title">
                <span></span>
                <span>警卫国庆</span>
                <span>张明达</span>
                <span>带队</span>
                <span><span class="num1">10</span>人</span>
                <span><span class="num2">10</span>把枪</span>
                <span><span class="num3">100</span>发弹</span>
                <i :class="openNum==e?'el-icon-arrow-down':'el-icon-arrow-right'" 
                @click="openOrclose(e)"></i>
            </div>
            <div class="list" :class="openNum==e?'isopen':''">
                <div class="item" v-for="e in 5">
                    <span>队员1</span>
                    <span>王三秦</span>
                    <span><span>10</span>把枪</span>
                    <span><span>100</span>发弹</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
           openNum:1
        }
    },
    methods:{
        shouqi(){
            this.$emit('shouqi')
        },
        openOrclose(n){
            this.openNum==n?this.openNum=-1:this.openNum=n
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
    height:810/@vh;
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
        .list{
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
                    width: 100/@vw;
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
</style>