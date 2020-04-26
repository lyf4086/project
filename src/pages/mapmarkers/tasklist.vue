<template>
    <div class="wrap">
        <div class="top">
            <h3>任务列表</h3>
            <span @click="shouqi">收起</span>
        </div>
        <div class="list1">1</div>
        <div class="list2">2</div>
        <div class="list3">3</div>
    </div>
</template>
<script>
export default {
    methods:{
        shouqi(){
            this.$emit('shouqi')
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
    box-shadow: 0 0 10px 0 rgba(54, 46, 46,.6);
    .top{
        width: 100%;
        height:60/@vh;
        display: flex;
        justify-content: space-between;
        align-items: center;
        h3{
            font-size: 33/@vw;
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
}
</style>