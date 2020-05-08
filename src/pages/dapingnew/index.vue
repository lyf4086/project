<template>
<div id="wrap">
    <div class="top">
        <button @click="$router.go(-1)">返回</button>
    </div>
    <div class="content">
        <div class="left">
            <div class="item1">
                <div class="title">枪弹统计</div>
                <div class="btns">
                    <button @click="play1">全部位置</button>
                    <button @click="play2">热力分布</button>
                </div>
                <div class="bar">
                    <div><span>{{cityName}}弹药消耗统计 </span><span>{{qiangdanTJ.xCount}}</span></div>
                    <div class="chart">
                        <jindu :num="xiaohaozanbi"></jindu>
                    </div>
                </div>
                <div class="bar">
                    <div><span>{{cityName}}弹药在库统计 </span><span>{{qiangdanTJ.zCount}}</span></div>
                    <div class="chart">
                        <jindu :num="zaikuzanbi"></jindu>
                    </div>
                </div>
            </div>
            <div class="item2">
                <div class="title">{{cityName}}枪型统计</div>
                <div class="item-wrap" @click="item2childclick">
                    <div class="nodata" v-show="qiangxinglist.length==0">该区域没有此数据</div>
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
                        <div class="nodata" v-show="baojinglist.length==0">该区域没有此数据</div>
                        <div class="item" v-for="(item,index) in baojinglist" :key="index">
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
                <list11 :id="activeAreaID"></list11>
                <pie :data1="chart1Data"></pie>
            </div>
        </div>
        <dialoglong v-if="dialoglongShow" @close="closeDialog"></dialoglong>
        <dialoglist v-if="dialoglistShow" @close="closeDialog" :sid="activeAreaID" :tid="tsakTypeID"></dialoglist>
        <dialogtongji v-if="dialogtongjiShow" @close="closeDialog"></dialogtongji>
        <hot v-if="hotshow" @close="closeDialog"></hot>
        <center class="center" @colseDialog="closeDialog"
            @openDialog="openDialog" :numbers="qiangdanTJ"
             @changeCity="changeCity"
            :cityName="cityName" 
        ></center>
        <right class="right" @openDialog="openDialog"
            :tasklist="renwujibielist" :top5="top5" :zanbiData="zanbiData"
            :cityName="cityName" :qiangdan_typelist="qiangdan_typelist"
        ></right>
    </div>
    <div class="cover" v-show="dialog11||dialoglongShow||dialoglistShow||dialogtongjiShow||hotshow"></div>
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
import hot from './hot'
export default {
    components:{
        center,right,jindu,list11,pie,dialoglong,dialoglist,dialogtongji,hot
    },
    data(){
        return {
            dialog11:false,
            dialoglongShow:false,
            dialoglistShow:false,
            dialogtongjiShow:false,
            hotshow:false,
            qiangdanTJ:{
                total:'0',
                nowei:'0',
                nCount:'0',
                xCount:'0',
                zaiwei:0,
                zCount:0
            },
            qiangxinglist:[],
            baojinglist:[],
            renwujibielist:[],
            top5:[],
            qiangdan_typelist:[],
            mapcitylist:[],
            cityName:'全国',
            activeAreaID:'',//当前显示哪个区域
            chart1Data:{},
            zanbiData:{},
            tsakTypeID:'11',//任务类型id
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
            
            this.cityName=option.name
            if(option.name=='全国'&&option.id==''){
                this.activeAreaID=''
                this.getAlldata()
            }else{
                if(option.name&&option.id){//省份名字和省份id都有才请求数据
                    this.activeAreaID=option.id
                    this.getAlldata(option.id)
                }
            }
        },
        openDialog(name){
            if(typeof name=='string'){
                this[name]=true
            }else{
                this[name.name]=true
                this.tsakTypeID=name.id
            }
            
        },
        closeDialog(){
            this.dialog11=false
            this.dialoglongShow=false
            this.dialoglistShow=false
            this.dialogtongjiShow=false
            this.hotshow=false
        },
        move() {
            this.$methods.listMove("#list-wrap11",3000)      
        },
        play1(){
            // this.$store.commit('playAudio','sort')
            this.$router.push({name:'mapMarkers'})
        },
        play2(){
            this.hotshow=true
            // this.$store.commit('playAudio','long')
        },
        item2childclick(){
            this.dialog11=true;
            this.danyaoxiangqing({server_id:this.activeAreaID}).then(res=>{
            if(res.status==200){
                let arr1=res.data.data.map(item=>item.zaiku).join('+')
                let zaiku=eval(arr1)
                let arr2=res.data.data.map(item=>item.chuku).join('+')
                let chuku=eval(arr2)
                let list=res.data.data.map(item=>{
                    return {
                        name:item.sname,
                        value:item.total
                    }
                })
                let data1=[{name:'在库',value:zaiku},{name:'出库',value:chuku}]
                let data2=list
                this.chart1Data={
                    data1,data2
                }
            }
        })
        },
        getAlldata(server_id=''){
            let load=this.$loading({background:'rgba(0,0,0,0.8)'})
            this.qiangdan({server_id}).then(res=>{
                if(res.status==200){
                    console.log('qiangdan',res.data.data)
                    this.qiangdanTJ=Object.assign(this.qiangdanTJ,res.data.data)
                }
            })
            this.qiangxing({server_id}).then(res=>{
                if(res.status==200){
                    this.qiangxinglist=res.data.data||[]
                }
            })
            this.baojing({server_id}).then(res=>{
                if(res.status==200){
                    load.close()
                    // console.log('baojing',res)
                    this.baojinglist=res.data.data||[]
                }
            })
            this.renwujibie({server_id}).then(res=>{
                if(res.status==200){
                    // console.log('renwujibie',res)
                    this.renwujibielist=res.data.data||[]
                }
            })
            this.tasktop5({server_id}).then(res=>{
                if(res.status==200){
                    console.log('tasktop5',res)
                    this.top5=res.data.data||[]
                    this.zanbiData=res.data.dat
                }
            })
            this.qiangdan_types({server_id}).then(res=>{
                if(res.status==200){
                    this.qiangdan_typelist=res.data||[]
                }
            })
            
        }
    },
    created(){
        // this.cityNames().then(res=>{
        //     if(res.status==200){
        //         console.log('cityNames',res.data)
        //         this.mapcitylist=res.data
        //     }
        // })
        this.getAlldata()
    },
    mounted(){
        this.move()
        
    }
}
</script>