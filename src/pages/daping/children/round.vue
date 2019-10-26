<template>
    <div class="wrap">
        <div class="left" v-show="false">
            <div class="up">1</div>
            <div class="down">2</div>
        </div>
        <div class="right">
            <div class="up">3</div>
            <div class="down">4</div>
        </div>
    </div>
</template>
<script>
export default {

}
</script>
<style scoped lang="less">
@vw:19.2vw;
.wrap{
    width:100%;
    height:100%;
    position: relative;
    background: none;
    & div{
        box-sizing:border-box
    }
    .left{
        position: absolute;
        left:0;
        top:0;
        width:50%;
        height:100%;
        &>div{
            position: absolute;
            left:0;
            top:0;
            width:100%;
            height:100%;
        }
    }
    .right{
        position: absolute;
        right:0;
        top:0;
        width:50%;
        height:100%;
        .down{
            position: absolute;
            left:0;
            top:0;
            width:100%;
            height:100%;
            border-width: 5/@vw 5/@vw 5/@vw 0;
            border-style: solid;
            border-color: red;
            border-radius: 0 50/@vw 50/@vw 0;
        }
        .up{
            position: absolute;
            top:0;
            left:-50/@vw;
            width:100%;
            height:100%;
            border-width: 5/@vw 0 5/@vw 5/@vw;
            border-style: solid;
            border-color: red;
            border-radius:50/@vw 0 0 50/@vw;
        }
    }
}





</style>