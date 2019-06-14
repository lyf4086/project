<template>
    <div class="danyao-zaiku">
        <div class="top-list">
            <div class="title">
                <p>弹柜总量：{{dataArr.length?dataArr.length:0}}</p>
            </div>
            <div class="item-wrap">
                <div class="item" v-for="item,index in dataArr" :key="index">
                    <p class="title">单位：{{item.org_name}}</p>
                    <img src="../../../assets/img/qingguitest.png" />
                    <p>弹柜名称：{{item.vdevSN}}</p>
                    <p>弹柜类型：{{item.vtype}}</p>
                    <p>弹柜编号：{{item.vCaption}}</p>
                    <p>弹药数量：{{item.bulletcount}}</p>
                    <h6 @click="xiangqing(item)" style="color:#fff;">&nbsp;&nbsp;&nbsp;&nbsp;</h6>
                </div>
            </div>
        </div>
        <div class="mes">
            <div class="title">
                <span>弹柜名称</span>
                <span>弹药类型</span>
                <span>弹药数量</span>
            </div>
            <ul class="list">
              <li class="item" v-for="(item,index) in list" :key="index">
                <span>{{item.org_name}}</span>
                <span>{{item.bulletType}}</span>
                <span>{{item.sums}}</span>
              </li>
            </ul>
        </div>
        <div class="xiangqing-wrap" v-show="xiangqingshow">
           <div class="xiangqing">
                <p class="title">弹药详情</p>
                <div class="content">
                    <div class="cabinet">
                      <div class="item"  v-for="item,index in xiangqingData" :key="index">

                        <div class="text">
                          <p>弹药名称：{{item.bullname}}</p>
                          <p>弹药类型：{{item.bulletType}}</p>
                          <!-- <p>类型代码：{{item.typecode}}</p> -->
                          <p>弹药数量：{{item.bulletcount}}</p>

                          <div class="line">
                            <div class="dian"></div>
                          </div>
                        </div>
                      </div>

                    </div>
                    <div class="chassis">
                        <div class="up"></div>
                        <div class="down"></div>
                    </div>
                </div>
                <button class="close" @click="close">取消</button>
           </div>
        </div>
    </div>
</template>
<style scoped>
@import url(./content.css);
</style>
<script>
    export default {
      props:{
        dataArr:{
          type:Array,
          default:function (){return []}
        },
        list:{
          type:Array,
          default:function (){return []}
        }
      },
        data(){
            return{
                xiangqingData:'',
                xiangqingindex:0,
                xiangqingshow:false
            }
        },
        computed:{

        },
        methods: {
            xiangqing(index){
                this.xiangqingindex=index
                // this.xiangqingshow=true
                // console.log(index.id)
                this.getXiangQing(index.id)
            },
            close(){
                this.xiangqingindex=0
                this.xiangqingshow=false
            },
            getXiangQing(id){
               //................详情信息函数

                var key=this.$store.state.key
                var objs = {"vdeid":id};

                var sign =  this.$methods.mkSign(objs,key);
                var token=this.$gscookie.getCookie('gun')
                var params = new URLSearchParams();

                params.append('vdeid',objs.vdeid);
                params.append('sign',sign);
                params.append('token',token)
                this.$axios({
                    url:'http://s.tronl.cn/weixin/project/index.php?m=home&c=Bulletlist&a=index',
                    method:'POST',
                    changeOrigin:true,
                    data:params
                }).then((data)=>{
                    if(data.data.code==200){
                      this.xiangqingData=data.data.data
                      if(!this.xiangqingData.length){
                        this.$message('暂无数据')
                        this.xiangqingshow=false
                      }else{
                        this.xiangqingshow=true
                      }
                    }

                }).catch((error)=>{
                    console.log(error)
                })

            }
        }
    }
</script>
