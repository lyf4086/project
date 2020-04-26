<template>
    <div class="wrap">
        <div class="title">
            <div>{{total.vtask}}<span>{{total.number}}</span></div>
            <i>||||||||</i>
        </div>
        <div class="content">
            <div class="item" v-for="item in task" :key="item.ID">
                <div class="name">{{item.vtask}}</div>
                <i></i><i></i>
                <div class="num">{{item.number}}</div>
            </div>
            <!-- <div class="item">
                <div class="name">二级任务</div>
                <i></i><i></i>
                <div class="num">768</div>
            </div>
            <div class="item">
                <div class="name">三级任务</div>
                <i></i><i></i>
                <div class="num">768</div>
            </div>
            <div class="item">
                <div class="name">四级任务</div>
                <i></i><i></i>
                <div class="num">768</div>
            </div> -->
        </div>
    </div>
</template>
<script>
export default {
    props:{
        total:{
            type:Object,
            required:true
        },
        task:{
            type:Array,
            required:true
        }
    }
}
</script>
<style lang="less" scoped>
@vw:38.4vw;
@vh:21.6vh;
.wrap{
    width: 100%;
    height:100%;
    font-size: 35/@vw;
    box-sizing: border-box;
    padding: 50/@vh 60/@vw;
    .title{
        box-sizing: border-box;
        width: 100%;
        height:90/@vh;
        padding-left: 40/@vw;
        padding-right: 20/@vw;
        color:#fff;
        background: #1f8bdf;
        display: flex;
        justify-content: space-between;
        align-items: center;
        vertical-align: middle;
        span{
            padding: 0 30/@vw;
            font-size: 45/@vw;
        }
    }
    .content{
        width:100%;
        height:280/@vh;
        margin-top: 40/@vh;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-content: space-between;
        .item{
            width:330/@vw;
            height:110/@vh;
            display: flex;
            flex-wrap: wrap;
            cursor: pointer;
            .name{
                font-size: 36/@vw;
                color:#333;
                line-height: 36/@vw;
            }
            i{
                width:100%;
                height:4/@vh;
                background: #a8c0f1;
            }
            i:nth-child(3){
                background: #dce6fa;
            }
            .num{
                font-size: 36/@vw;
                line-height: 36/@vh;
                color: #2c7fcb;
                font-weight: 800;
            }
        }
        .item:active{
            background: cornsilk;
        }
    }
}
</style>