<template>
    <div class="wrap">
        <div class="title">
            <div class="left">
               <i></i> 
               北京市公安局一大队
            </div>
            <button @click="startMoveing">{{bl?"关闭自动播放":"开启自动播放"}}</button>
            <div class="right">
                <i></i>
                北京市
            </div>
        </div>
        <div class="moveimg"></div>
        <div class="content">
            <div class="left1 move-item animated" @click="lookitem1" ref="left1">
                <div class="item">
                    <Round data="20" title="离套报警"/>
                </div>
                <div class="item">
                    <Round data="56" title="离枪报警"/>
                </div>
                <div class="item">
                    <Round data="70" title="区域报警"/>
                </div>
            </div>
            <div class="left2 move-item"  @click="lookitem2" ref="left2">
                <div class="top">枪支类型分别统计</div>
                <div class="down"></div>
            </div>
            <div class="left3 move-item" @click="lookitem3" ref="left3" >
                <div class="top">定位</div>
                <div class="down"></div>
                <i class="jiao jiao1"></i>
                <i class="jiao jiao2"></i>
                <i class="jiao jiao3"></i>
                <i class="jiao jiao4"></i>
            </div>
            <div class="right1 move-item" @click="lookitem4" ref="left4">
                <i class="jiao jiao1"></i>
                <i class="jiao jiao2"></i>
                <i class="jiao jiao3"></i>
                <i class="jiao jiao4"></i>
            </div>
            <div class="right2 move-item" @click="lookitem5" ref="left5">
                <i class="jiao jiao1"></i>
                <i class="jiao jiao2"></i>
                <i class="jiao jiao3"></i>
                <i class="jiao jiao4"></i>
            </div>
            <div class="right3 move-item" @click="lookitem6" ref="left6">
                <div class="title">
                    <span>机构名称</span>
                    <span>警员名称</span>
                    <span>警员编号</span>
                    <span>借出时间</span>
                </div>
                <div class="list" >
                    <div id="move_list">
                        <div class="item">
                            <span>机构名称</span>
                            <span>警员名称</span>
                            <span>警员编号</span>
                            <span>借出时间</span>
                        </div>
                        
                        <div class="item">
                            <span>机构名称</span>
                            <span>警员名称</span>
                            <span>警员编号</span>
                            <span>借出时间</span>
                        </div>
                        <div class="item">
                            <span>机构名称</span>
                            <span>警员名称</span>
                            <span>警员编号</span>
                            <span>借出时间</span>
                        </div>
                        <div class="item">
                            <span>机构名称</span>
                            <span>警员名称</span>
                            <span>警员编号</span>
                            <span>借出时间</span>
                        </div>
                        <div class="item">
                            <span>机构名称</span>
                            <span>警员名称</span>
                            <span>警员编号</span>
                            <span>借出时间</span>
                        </div>
                        <div class="item">
                            <span>机构名称</span>
                            <span>警员名称</span>
                            <span>警员编号</span>
                            <span>借出时间</span>
                        </div>
                        <div class="item">
                            <span>机构名称</span>
                            <span>警员名称</span>
                            <span>警员编号</span>
                            <span>借出时间</span>
                        </div>
                    </div>
                </div>
                <i class="jiao jiao1"></i>
                <i class="jiao jiao2"></i>
                <i class="jiao jiao3"></i>
                <i class="jiao jiao4"></i>
            </div>
            <div class="right4">
                <div class="con">
                    <div class="ti">
                        <i></i>
                        <span>最新报警类型--离套报警</span>
                    </div>
                    <p>
                        <span>报警人：王小明</span> 
                        <span>警员编号：2343434</span> 
                    </p>
                    <p>
                        <span class="span1">盐城市公安局</span>
                        <span class="span2">2019-09-03 14:23:22</span>
                    </p>
                </div>
            </div>
            <div class="right5">
                <div class="con">
                    <p>ip:686:6:66:6</p>
                    <p>服务器ip地址：s.tronl.cn</p>
                    <p>服务器主机名：阿克苏v话uv</p>
                    <p>服务器运行时常：233天34小时34分</p>
                </div>
            </div>
            <div class="right6">
                <button></button>
                <button></button>
            </div>
            <i class="jiao jiao1"></i>
            <i class="jiao jiao2"></i>
            <i class="jiao jiao3"></i>
            <i class="jiao jiao4"></i>
            <div class="alert alert1" ref="alert1">
                <button @click="closeitem1" v-show="!bl">X</button>
            </div>
            <div class="alert alert2" ref="alert2">
                <button @click="closeitem2" v-show="!bl">X</button>
            </div>
            <div class="alert alert3" ref="alert3">
                <button @click="closeitem3" v-show="!bl">X</button>
            </div>
            <div class="alert alert4" ref="alert4">
                <button @click="closeitem4" v-show="!bl">X</button>
            </div>
            <div class="alert alert5" ref="alert5">
                <button @click="closeitem5" v-show="!bl">X</button>
            </div>
            <div class="alert alert6" ref="alert6">
                <button @click="closeitem6" v-show="!bl">X</button>
            </div>
        </div>
        
    </div>
</template>
<style scoped>
@import url(./index.css);
@import url(../../assets/style/animate.min.css);
</style>
<script>
import Round from './round'
export default {
    components:{ Round },
    data(){
        return{
           bl:false,
           active:false,
           timer1:null,
           timer2:null,
           timer3:null
        }
    },
    methods:{
        lookitem1(){
            this.$refs.left1.classList.add('tada')
            setTimeout(()=>{
                //  this.$refs.left1.classList.add('active')
            },600)
            setTimeout(()=>{
                // this.$refs.alert1.classList.add('bigalert')
                this.$refs.left1.classList.remove('tada')
                setTimeout(()=>{
                    // this.$refs.alert1.classList.add('rubberBand')
                },600)
            },800)
        },
        closeitem1(){
            this.$refs.alert1.classList.remove('bigalert')
            setTimeout(()=>{
                this.$refs.left1.classList.remove('active')
            },800)
        },
        lookitem2(){
            this.$refs.left2.classList.add('active')
            setTimeout(()=>{
                this.$refs.alert2.classList.add('bigalert')
            },800)
        },
        closeitem2(){
            this.$refs.alert2.classList.remove('bigalert')
            setTimeout(()=>{
                this.$refs.left2.classList.remove('active')
            },800)
        },
        lookitem3(){
            this.$refs.left3.classList.add('active')
            setTimeout(()=>{
                this.$refs.alert3.classList.add('bigalert')
            },800)
        },
        closeitem3(){
            this.$refs.alert3.classList.remove('bigalert')
            setTimeout(()=>{
                this.$refs.left3.classList.remove('active')
            },800)
        },
        lookitem4(){
            this.$refs.left4.classList.add('active')
            setTimeout(()=>{
                this.$refs.alert4.classList.add('bigalert')
            },800)
        },
        closeitem4(){
            this.$refs.alert4.classList.remove('bigalert')
            setTimeout(()=>{
                this.$refs.left4.classList.remove('active')
            },800)
        },
        lookitem5(){
            this.$refs.left5.classList.add('active')
            setTimeout(()=>{
                this.$refs.alert5.classList.add('bigalert')
            },800)
        },
        closeitem5(){
            this.$refs.alert5.classList.remove('bigalert')
            setTimeout(()=>{
                this.$refs.left5.classList.remove('active')
            },800)
        },
        lookitem6(){
            this.$refs.left6.classList.add('active')
            setTimeout(()=>{
                this.$refs.alert6.classList.add('bigalert')
            },800)
        },
        closeitem6(){
            this.$refs.alert6.classList.remove('bigalert')
            setTimeout(()=>{
                this.$refs.left6.classList.remove('active')
            },800)
        },
        startMoveing(){
            let that=this
            let moveitems=document.querySelectorAll('.move-item');
            let alertList=document.querySelectorAll('.alert');
            let num=0
            if(!this.bl){
                aa()
                this.timer1=setInterval(()=>{
                    moveitems.forEach(e=>e.classList.remove('active'))
                    moveitems[num].classList.add('active')
                    ~(function (num){
                        that.timer2=setTimeout(()=>{
                                alertList.forEach(e=>e.classList.remove('bigalert'))
                                alertList[num].classList.add('bigalert');
                                ~(function (num){
                                    that.timer3=setTimeout(()=>{
                                        alertList[num].classList.remove('bigalert');
                                    },5000)
                                })(num);
                                num<alertList.length-1?++num:num=0
                        },600)
                    })(num);
                    num<moveitems.length-1?++num:num=0
                },6000)
            }else{
                clearInterval(this.timer1)
                clearInterval(this.timer2)
                clearInterval(this.timer3)
                this.timer1=this.timer2=this.time3=null
                moveitems.forEach(e=>e.classList.remove('active'))
                alertList.forEach(e=>e.classList.remove('bigalert'))
            }
            this.bl=!this.bl
            function aa(){
                that.$refs.left1.classList.remove('active')
                that.$refs.alert1.classList.remove('bigalert')
                that.$refs.left2.classList.remove('active')
                that.$refs.alert2.classList.remove('bigalert')
                that.$refs.left3.classList.remove('active')
                that.$refs.alert3.classList.remove('bigalert')
                that.$refs.left4.classList.remove('active')
                that.$refs.alert4.classList.remove('bigalert')
                that.$refs.left5.classList.remove('active')
                that.$refs.alert5.classList.remove('bigalert')
                that.$refs.left6.classList.remove('active')
                that.$refs.alert6.classList.remove('bigalert')

                moveitems.forEach(e=>e.classList.remove('active'))
                moveitems[num].classList.add('active')
                ~(function (num){
                    setTimeout(()=>{
                            alertList.forEach(e=>e.classList.remove('bigalert'))
                            alertList[num].classList.add('bigalert');
                            ~(function (num){
                                setTimeout(()=>{
                                    alertList[num].classList.remove('bigalert');
                                },5000)
                            })(num);
                            num<alertList.length-1?++num:num=0
                    },600)
                })(num);
                num<moveitems.length-1?++num:num=0
            }
        }
    },
    mounted(){
        $('.jiao').css('border','none')
        let m=this.$methods.listMove('#move_list');
        
    },
    beforeDestroy(){
        this.timer1=this.timer2=this.timer3=null
    }
}
</script>