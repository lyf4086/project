<template>
    <div class="border">
        <div class="wrap" :style="`width:${num}%`">
            <div class="bar">
                <i v-for="e in 100" :key="e"></i>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        num:{
            type:[Number,String],
            default:'0'
        }
    }
}
</script>
<style lang="less" scoped>
@vw:38.4vw;
@vh:21.6vh;
.border{
    box-sizing: border-box;
    // width: 790/@vw;
    width: 100%;
    height:30/@vh;
    border:1px solid #82efff;
    padding: 4/@vh 4/@vw;
}
.wrap{
   width:100%;
    height:100%;
    overflow: hidden;
    .bar{
        width:775/@vw;
        height:100%;
        background: linear-gradient(to right,#64ebff,#e1f717,#f40707);
        display: flex;
        justify-content: space-around;
        align-items: center;
        i{
            width:1px;
            height:100%;
            background: #324e50;
        }
    }
}
</style>