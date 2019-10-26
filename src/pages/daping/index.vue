<template>
    <div class="wrap">
        <div class="top">
            <div class="time">
                <div class="l">{{timestr}}</div>
                <div class="r">
                    <p>{{weekstr}}</p>
                    <span>{{datestr}}</span>
                </div>
            </div>
        </div>
        <div class="content">
            <div class="left">
                <div class="item1 animated bounceInLeft">
                    <div class="t">重要报警情况</div>
                    <div class="c">
                        <div class="l">
                            共<i>{{zybj.total}}</i>条
                        </div>
                        <div class="r">
                            <p>离套报警<i>{{zybj.litao}}</i>条</p>
                            <p>预期报警<i>{{zybj.yuqi}}</i>条</p>
                        </div>
                    </div>
                </div>
                <div class="item2 animated bounceInLeft">
                    <div class="t">一般报警情况</div>
                    <div class="c">
                        <p>入套警报警<i>{{ybbj.rutao}}</i>条 &nbsp;&nbsp;&nbsp;&nbsp;   区域报警<i>{{ybbj.quyu}}</i>条</p>
                        <div class="yuan" >
                            <div id="round1"></div>
                        </div>
                    </div>
                </div>
                <div class="item3 animated bounceInLeft" @click="toRenWu">
                    <div class="t">重点任务情况</div>
                    <div class="c">
                        <p>全部任务数<i>{{rwtj.total}}</i>条</p>
                        <p>一级任务数<i>{{rwtj.yiji}}</i>条</p>
                    </div>
                </div>
                <div class="item4 animated bounceInLeft" @click="toRenWu" >
                    <div class="t">其它任务情况</div>
                    <div class="c">
                        <div class="round" >
                            <div id="round2"></div>
                            <p>二级任务</p>
                        </div>
                        <div class="round">
                            <div id="round3"></div>
                            <p>三级任务</p>
                        </div>
                        <div class="round" >
                            <div id="round4"></div>
                            <p>四级任务</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="center animated fadeInDown">
                <div class="top">
                    <div class="item1" @click="lookQiangZhi">
                        <div class="number">
                            <span v-for="(item,index) in qdtj.toal" :key="index" >{{item}}</span>
                            
                        </div>
                        <div class="t">全国枪支总量</div>
                        <p>在库数 <i>{{qdtj.zaiwei}}</i>把 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;出库数<i>{{qdtj.nowei}}</i>把</p>
                    </div>
                    <div class="item2" @click="toDanYAo">
                        <div class="number">
                            <span v-for="(item,index) in qdtj.nCount" :key="index">{{item}}</span>
                    
                        </div>
                        <div class="t">弹药总量</div>
                        <p>在库数 <i>{{qdtj.zCount}}</i>把 &nbsp;&nbsp;&nbsp;出库数<i>{{qdtj.xCount}}</i>把</p>
                    </div>
                </div>
                <div class="left-bg"></div>
                <div class="main">
                    <div class="nav">
                        <div class="up" id="up"></div>
                        <div class="list" id="list">
                            <div class="item" 
                                v-for="(e,i) in citys" 
                                :class="{'active':e.checked}"
                                :key="i" 
                                @click="checkcity(e)"
                            >{{e.cname}}</div>
                        </div>
                        <div class="down" id="down"></div>
                    </div>
                    <div id="main">
                        
                    </div>
                </div>
                <div class="right-bg"></div>
            </div>
            <div class="right animated bounceInRight" @click="lookTop5">
                <div class="title">全国当日任务TOP5</div>
                <div class="con">
                    <div class="title-floor">
                        <span>排名</span>
                        <span>省市</span>
                        <span>任务数（次）</span>
                    </div>
                    <div class="content-floor" v-for="(item,index) in rwtop5" :key="index">
                        <span>{{index+1}}</span>
                        <span>{{item.cname}}</span>
                        <div class="bar">
                            <span>{{item.total}}</span>
                        </div>
                    </div>
                    
                </div>
                <div class="title">全国当日报警TOP5</div>
                <div class="con last">
                    <div class="title-floor">
                        <span>排名</span>
                        <span>省市</span>
                        <span>任务数（次）</span>
                    </div>
                    <div class="content-floor" v-for="(item,index) in bjtop5" :key="index">
                        <span>{{index+1}}</span>
                        <span>{{item.cname}}</span>
                        <div class="bar">
                            <span>{{item.total}}</span>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
        <div class="footer animated bounceInUp">
            <div class="item1" id="item1"  @click="lookQiangZhi"></div>
            <div class="xiegang"></div>
            <div class="item2">
                <div class="t">实时报警情况</div>
                <div class="txt-title">
                    <span>机构</span>
                    <span>姓名</span>
                    <span>报警类型</span>
                    <span>时间</span>
                    <span>枪型</span>
                    <span>枪号</span>
                </div>
                <div class="list-wrap">
                    <div class="txt-list" id="move-list">
                        <div class="item" v-for="(item,index) in bjqk" :key="index">
                            <span>{{item.mname}}</span>
                            <span>{{item.policeuser_name}}</span>
                            <span>{{item.tname}}</span>
                            <span>{{item.datetime}}</span>
                            <span>{{item.gtype ||'暂无'}}</span>
                            <span>{{item.gun_code}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="xiegang"></div>
            <div class="item3">
                <div class="t">监测枪瞄在线情况</div>
                <div class="txt">
                    <p>在线<i>{{zaixian.zai}}</i>台</p>
                    <p>离线<i>{{zaixian.nozai}}</i>台</p>
                </div>
                <div class="chart">
                    <div class="bg">
                        <div class="round-bg">
                            <!-- <Yuan/> -->
                        </div>
                        <div class="tt">
                            <h3>{{zaixian.ratio}}%</h3>
                            <p>在线率</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Child1 v-if="danyaoShow" @close="closeDanYao"/>
        <Child2 v-if="renwuxiangqingShow" @close="closeRenWu"/>
        <Child3 v-if="renwutongjiShow" @close="closerenwuxiangqing" @lookxiangqing="openrenwuxiangqing"/>
        <Child4 v-if="qiangzhizongliangShow" @close="closeQiangZhiZongLiang"/>
        <Child5 v-if="top5Show" @close="closeTop5"/>
    </div>
</template>
<style scoped>
@import url(./index.css);
@import url(../../assets/style/animate.min.css);
</style>
<script>
import  'echarts/lib/chart/map';
import 'echarts/map/js/china.js';
import * as getMethods from './getData'
import * as echartsmethods from './echarts'
import Yuan from './children/round'
import Child1 from './children/child1.vue'
import Child2 from './children/child2.vue'
import Child3 from './children/child3.vue'
import Child4 from './children/child4.vue'
import Child5 from './children/child5.vue'
import { resolve } from 'url';
export default {
    components:{Yuan,Child1,Child2,Child3,Child4,Child5},
    data(){
        return {
            cityData:[],
            danyaoShow:false,
            renwutongjiShow:false,
            renwuxiangqingShow:false,
            qiangzhizongliangShow:false,
            top5Show:false,
            timer:null,
            timestr:'',
            weekstr:'',
            datestr:'',
            citys:[],
            zybj:{//重要报警
                litao:'',
                total:'',
                yuqi:''
            },
            ybbj:{//一般报警
                quyu:'',
                rutao:'',
                total:''
            },
            rwtj:{//任务统计
                total:0,
                yiji:''
            },
            qdtj:{//中部枪弹统计
                toal:"0",//枪支总量
                nowei:'0',//枪支出库总量
                nCount:"0",//弹药统计
                xCount:'0',//出库弹药统计
                zaiwei:'0',//枪支在库总量
                zCount:'0'//弹药在库总量
            },
            bjqk:[],//报警情况
            zaixian:{//枪瞄在线情况
                nozai:0,
                ratio:0,
                zai:0
            },
            rwtop5:[],//任务top5
            bjtop5:[],//报警top5
            changeCityTimer:null,
            changeCityIndex:0
        }
    },
    methods:{
        ...echartsmethods,
        ...getMethods,
        toDanYAo(){
            this.danyaoShow=true
        },
        closeDanYao(){
            this.danyaoShow=false
        },
        toRenWu(){
            
            this.renwutongjiShow=true
        },
        closeRenWu(){
            // this.renwutongjiShow=false
            this.renwuxiangqingShow=false
        },
        openrenwuxiangqing(){
            this.renwutongjiShow=false
            this.renwuxiangqingShow=true
        },
        closerenwuxiangqing(){
            this.renwutongjiShow=false
        },
        lookTop5(){
            this.top5Show=true
        },
        closeTop5(){
            this.top5Show=false
        },
        lookQiangZhi(){
            this.qiangzhizongliangShow=true
        },
        closeQiangZhiZongLiang(){
            this.qiangzhizongliangShow=false
        },
        checkcity(e){
            this.citys.forEach(item=>{
                if(item==e){
                    item.checked=true
                }else{
                    item.checked=false
                }
            })

            // console.log(e,this.cityData)
            let num=this.cityData.findIndex(item=>item[0].name==e.cname)
            let a=0
            this.initMap(num)
            clearInterval(this.changeCityTimer)
            this.changeCityTimer=null
            this.changeCityTimer=setInterval(() => {
                ++a;
                if(a<this.cityData.length){
                    this.initMap(a)
                    
                }else{
                    a=0
                }
            }, 3000);

        },
        starMove(){
            this.$methods.listMove("#move-list",2000) 
        },
        realSysTime(){
            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth();
            var date = now.getDate();
            var day = now.getDay();
            var hour = now.getHours();
            var minu = now.getMinutes();
            var sec = now.getSeconds();
            month = month+1;
            var arr_week = new Array("星期日","星期一","星期二","星期三","星期四","星期五","星期六");
            var week = arr_week[day];
            hour=hour<10? '0'+hour:hour
            minu=minu<10 ? '0'+minu:minu
            sec=sec<10? '0'+sec:sec
            this.timestr=hour+":"+minu+":"+sec;
            this.weekstr=week
            this.datestr=year+"年"+month+"月"+date+"日"
        }
    },
    mounted (){
        this.timer=setInterval(this.realSysTime, 1000);
        $('#up').click(function (){
            let top=$('#list').scrollTop()
            if(top>50){
                $('#list').scrollTop(top-50)
            }else{
                $('#list').scrollTop(0)
            }
        })
        $('#down').click(function (){
            let top=$('#list').scrollTop()
            let h= $('#list').height()
            let sh=$('#list').outerHeight() 
            $('#list').scrollTop(top+50)
        })
        this.getCitysDate()
        this.getCitys()
        this.importantAlarm()
        this.yibanAlarm()
        this.renwutongji()
        this.quanguoqiangzhi()
        this.qiangdan()
        this.baojingqingkuang()
        this.qiangmiaozaixian()
        this.renwutop5()
        this.baojingtop5()
        // new Promise((resolve,reject)=>{
        //     setTimeout(() => {
        //         this.danyaoShow=true;
        //         resolve('999')
        //     }, 6000);
        // }).then((data)=>{
        //     setTimeout(() => {
        //         this.danyaoShow=false;
        //         resolve('999')
        //     }, 6000);
        // })
        // danyaoShow:false,
        //     renwutongjiShow:false,
        //     renwuxiangqingShow:false,
        //     qiangzhizongliangShow:false,
        //     top5Show:false,
    },
    beforeDestroy(){
        clearInterval(this.timer)
        clearInterval(this.changeCityTimer)
        this.changeCityTimer=null
        this.timer=null
    }
}
</script>