<template>
    <div class="wrap">
        <div class="title">
            <span>单位</span>
            <span>{{type==='danyao'?'弹药':'枪支'}}总量</span>
            <span>{{type==='danyao'?'在库':'在位'}}数量</span>
            <span>{{type==='danyao'?'出库':'不在位'}}数量</span>
        </div>
        <div class="list">
            <div class="item11" v-for="(item,index) in list" :key="index">
                 <span>{{type==='danyao'?item.sname:item.mechanism_name}}</span>
                <span>{{type==='danyao'?item.total:item.toal}}</span>
                <span>{{type==='danyao'?item.zaiku:item.zaiwei}}</span>
                <span>{{type==='danyao'?item.chuku:item.nowei}}</span>
               
            </div>
        </div>
    </div>
</template>
<script>
import {danyaoxiangqing,qiangxingxiangqing} from '../apis'
export default {
    props:{
        id:{
            type:String,
            required:true
        },
        type:{
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
        danyaoxiangqing,
        qiangxingxiangqing
    },
    created(){
        if(this.type=='danyao'){
            this.danyaoxiangqing({server_id:this.id}).then(res=>{
                if(res.status==200){
                    this.list=res.data.data
                }
            })
        }else{
            this.qiangxingxiangqing({server_id:this.id}).then(res=>{
                console.log(res)
            if(res.status==200){
                this.list=res.data.data
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
    position: relative;
    box-sizing: border-box;
    padding-top: 150/@vh;
    
}
.title{
    position: absolute;
    top:76/@vh;
    width:990/@vw;
    height:76/@vh;
    background: rgba(17,69,129,1);
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 30/@vw;
    color:#9fb4cc;
    span{
        text-align: center;
    }
    span:nth-child(1){
        width: 266/@vw;
        height:36/@vh;
        border-right: 1px solid #9fb4cc;
    }
    span:nth-child(2){
        width: 224/@vw;
        height:36/@vh;
        border-right: 1px solid #9fb4cc;
    }
    span:nth-child(3){
        width: 212/@vw;
        height:36/@vh;
        border-right: 1px solid #9fb4cc;
    }
    span:nth-child(4){
        width: 260/@vw;
        height:36/@vh;
    }
}
.list{
    box-sizing: border-box;
    max-height: 760/@vh;
    overflow: auto;
    .item11{
        width:990/@vw;
        height:76/@vh;
        display: flex;
        justify-content: space-around;
        align-items: center;
        font-size: 26/@vw;
        color:#fff;
        span{
            
            text-align: center;
        }
        span:nth-child(1){
            width: 266/@vw;
            height:36/@vh;
        }
        span:nth-child(2){
            width: 224/@vw;
            height:36/@vh;
            color:#51a4e4;
        }
        span:nth-child(3){
            width: 212/@vw;
            height:36/@vh;
            color:#37d6f9;
        }
        span:nth-child(4){
            width: 260/@vw;
            height:36/@vh;
            color:#e6a953;
        }
    }
    .item11:nth-child(even){
        background: rgba(17,69,129,0.2);
    }
    .item11:hover{
        box-shadow: inset 0 0 10px 0px #21a8c9,0px 0px 5px 0px #21a8c9;
    }
}
</style>