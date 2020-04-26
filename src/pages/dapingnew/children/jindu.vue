<template>
    <div class="wrap">
        <div class="item">
            <span v-show="num>=1"></span>
            <span v-show="num>=2"></span>
        </div>
        <div class="item">
            <span v-show="num>=3"></span>
            <span v-show="num>=4"></span>
        </div>
        <div class="item">
            <span v-show="num>=5"></span>
            <span v-show="num>=6"></span>
        </div>
        <div class="item">
            <span v-show="num>=7"></span>
            <span v-show="num>=8"></span>
        </div>
        <div class="item">
            <span v-show="num>=9"></span>
            <span v-show="num>=10"></span>
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
    },
    data(){
        return {
            
        }
    }
}
</script>

<style lang="less" scoped>

@vw:38.4vw;
@vh:21.6vh;

.wrap{
    box-sizing: border-box;
    width:100%;
    height:100%;
    background: url(../../../assets/sucai/jindu.png) no-repeat;
    background-size: 100% 100%;
    padding:8/@vh 24/@vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .item{
        width: 19.5%;
        height:100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span{
            width:50%;
            height:100%;
            background: #6ec5e9;
        }
    }
}
</style>
