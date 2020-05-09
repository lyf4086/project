<template>
    <div class="wrap">
        <div class="item item1">
            <div class="icon"></div>
            <p>该单位全部枪支数</p>
            <strong>{{guntotal}}</strong>
        </div>
        <div class="item item2">
            <div class="icon"></div>
            <p>出库枪支数</p>
            <strong>{{nowei}}</strong>
        </div>
        <div class="item item3">
            <div class="icon"></div>
            <p>全部弹药数</p>
            <strong>{{nCount}}</strong>
        </div>
        <div class="item item4">
            <div class="icon"></div>
            <p>出库弹药数</p>
            <strong>{{xCount}}</strong>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        guntotal:{
            type:String,
            required:true
        },
        nowei:{
            type:String,
            required:true
        },
        nCount:{
            type:String,
            required:true
        },
        xCount:{
            type:String,
            required:true
        },
    }
}
</script>
<style lang="less" scoped>
@vw:38.4vw;
@vh:21.6vh;
.wrap{
    box-sizing: border-box;
    padding:40/@vw;
    font-size: 35/@vw;
    width:100%;
    height:100%;
    display: flex;
    flex-wrap: wrap;
    .item{
        box-sizing: border-box;
        width: 50%;
        height: 50%;
        text-align: center;
        .icon{
            width:130/@vw;
            height:130/@vw;
            margin:40/@vh auto 20/@vh;
        }
        p{
            font-weight: bold;
            line-height: 50/@vh;
            color: #4d4d4d;
        }
        strong{
            font-size: 50/@vw;
            line-height: 70/@vh;
            font-weight: bold;
            color:#3fbcdd
        }
    }
    .item:active{
        background: cornsilk;
    }
    .item1{
        border-right:1px solid #6dbaec;
        border-bottom:1px solid #6dbaec;
        .icon{
            background: url(../../assets/sucai/map-icon2.png) no-repeat;
            background-size: 100% 100%;
        }
    }
    .item2{
        border-bottom:1px solid #6dbaec;
        .icon{
            background: url(../../assets/sucai/map-icon2.png) no-repeat;
            background-size: 100% 100%;
        }
    }
    .item3{
        border-right:1px solid #6dbaec;
        .icon{
            background: url(../../assets/sucai/map-icon1.png) no-repeat;
            background-size: 100% 100%;
        }
    }
    .item4{
        .icon{
            background: url(../../assets/sucai/map-icon1.png) no-repeat;
            background-size: 100% 100%;
        }
    }
}
</style>