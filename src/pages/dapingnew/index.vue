<template>
<div id="wrap">
    <div class="top">
        <button @click="$router.go(-1)">返回</button>
    </div>
    <div class="content">
        <div class="left">
            <div class="item1" @click="item1Click">
                <div class="title">枪弹统计</div>
                <div class="btns">
                    <button @click="play1">全部位置</button>
                    <button @click="play2">热力分布</button>
                </div>
                <div class="bar">
                    <div><span>全国弹药消耗统计 </span><span>{{qiangdanTJ.xCount}}</span></div>
                    <div class="chart">
                        <jindu :num="xiaohaozanbi"></jindu>
                    </div>
                </div>
                <div class="bar">
                    <div><span>全国弹药在库统计 </span><span>{{qiangdanTJ.zCount}}</span></div>
                    <div class="chart">
                        <jindu :num="zaikuzanbi"></jindu>
                    </div>
                </div>
            </div>
            <div class="item2">
                <div class="title">全国枪型统计</div>
                <div class="item-wrap" @click="item2childclick">
                    <div class="item" v-for="item in qiangxinglist" :key="item.vQXingHao">
                        <div class="icon"></div>
                        <div class="name">{{item.vQXingHao}}</div>
                        <div class="num">{{item.number}}</div>
                    </div>
                </div>
            </div>
            <div class="item3">
                <div class="title">报警情况</div>
                <div class="list-wrap">
                    <div class="list" id="list-wrap11">
                        <div class="item" v-for="item in baojinglist" :key="item.id">
                            <div class="l">
                                <i></i>
                            </div>
                            <div class="c">
                                <span>{{item.mname}}</span>
                                <span>{{item.policeuser_name}}</span>
                                <span>携带{{item.gun_id}}（{{item.gtype}}）于{{item.datetime}} 产生</span>
                                <span>{{item.tname}}</span>
                            </div>
                            <div class="r"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="dialog"  v-if="dialog11">
            <button class="del" @click="closeDialog">X</button>
            <div class="title">枪弹药详情</div>
            <div class="content">
                <list11></list11>
                <pie></pie>
            </div>
        </div>
        <dialoglong v-if="dialoglongShow" @close="closeDialog"></dialoglong>
        <dialoglist v-if="dialoglistShow" @close="closeDialog"></dialoglist>
        <dialogtongji v-if="dialogtongjiShow" @close="closeDialog"></dialogtongji>
        <center class="center" @colseDialog="closeDialog"
            @openDialog="openDialog" :numbers="qiangdanTJ"
            :citylist="mapcitylist" @changeCity="changeCity"
        ></center>
        <right class="right" @openDialog="openDialog"
            :tasklist="renwujibielist" :top5="top5"
        ></right>
    </div>
    <div class="cover" v-show="dialog11||dialoglongShow||dialoglistShow||dialogtongjiShow"></div>
</div>
</template>
<style lang="less" scoped>
@import url('./index.less');
</style>
<script>
import * as apis from './apis'//所有数据请求函数
import center from './center'
import right from './right'
import jindu from './children/jindu'
import list11 from './children/list'
import pie from './children/pie'
import dialoglong from './dialoglong'
import dialoglist from './dialoglist'
import dialogtongji from './dialogtongji'
export default {
    components:{
        center,right,jindu,list11,pie,dialoglong,dialoglist,dialogtongji
    },
    data(){
        return {
            dialog11:false,
            dialoglongShow:false,
            dialoglistShow:false,
            dialogtongjiShow:false,
            qiangdanTJ:{
                total:'',
                nowei:'',
                nCount:'',
                xCount:'',
                zaiwei:0,
                zCount:0
            },
            qiangxinglist:[],
            baojinglist:[],
            renwujibielist:[],
            top5:[],
            mapcitylist:[]
        }
    },
    computed:{
        xiaohaozanbi(){
            let total=this.qiangdanTJ.nCount
            let xiaohao=this.qiangdanTJ.xCount
            let num=xiaohao/total
            return parseInt(num*10)<1?1:parseInt(num*10)
        },
        zaikuzanbi(){
            let total=this.qiangdanTJ.nCount
            let zaiku=this.qiangdanTJ.zCount
            let num=Math.ceil(zaiku/total)
            return parseInt(num*10)
        }
    },
    methods:{
        ...apis,//所有数据请求函数
        changeCity(option){
            console.log('changeCity',option)
        },
        openDialog(name){
            this[name]=true
        },
        closeDialog(){
            this.dialog11=false
            this.dialoglongShow=false
            this.dialoglistShow=false
            this.dialogtongjiShow=false
        },
        move() {
            this.$methods.listMove("#list-wrap11",3000)      
        },
        play1(){
            this.$store.commit('playAudio','sort')
        },
        play2(){
            this.$store.commit('playAudio','long')
        },
        item2childclick(){
            this.dialog11=true
        },
        item1Click(){//点击都是临时事件
            this.dialoglongShow=true
        },
        getAlldata(){
            this.qiangdan().then(res=>{
                if(res.status==200){
                    console.log('qiangdan',res)
                    this.qiangdanTJ=Object.assign(this.qiangdanTJ,res.data.data)
                }
            })
            this.qiangxing().then(res=>{
                if(res.status==200){
                    this.qiangxinglist=res.data.data
                }
            })
            this.baojing().then(res=>{
                if(res.status==200){
                    console.log('baojing',res)
                    this.baojinglist=res.data.data
                }
            })
            this.renwujibie().then(res=>{
                if(res.status==200){
                    console.log('renwujibie',res)
                    this.renwujibielist=res.data.data
                }
            })
            this.tasktop5().then(res=>{
                if(res.status==200){
                    console.log('tasktop5',res)
                    this.top5=res.data.data
                }
            })
            
        }
    },
    created(){
        this.cityNames().then(res=>{
            if(res.status==200){
                console.log('cityNames',res.data)
                this.mapcitylist=res.data
            }
        })
        this.getAlldata()
    },
    mounted(){
        this.move()
        
    }
}
</script>