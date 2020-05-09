<template>
<div>
  <div class="left">
    <div class="item1">
      <div class="title">任务统计</div>
      <div class="chartwrap">
          <div class="item" :title="`数量：${zanbiData.dt_total||0}，占比：${zanbiData.roid||0}%`">
              <div class="txt">
                  <span>{{cityName}}当日任务</span>
                  <span>{{zanbiData.roid}}%</span>
              </div>
              <div class="bar">
                  <jindu2 :num="zanbiData.roid"></jindu2>
              </div>
          </div>
          <div class="item" :title="`出勤率：${parseInt((numbers.nowei)/(numbers.toal)*100)||0}%`">
              <div class="txt">
                  <span>{{cityName}}持枪出勤率</span>
                  <span>{{parseInt((numbers.nowei)/(numbers.toal)*100)||0}}%</span>
              </div>
              <div class="bar">
                  <jindu2 :num="(numbers.nowei)/(numbers.toal)*100||0"></jindu2>
              </div>
          </div>
      </div>
      <div class="itemwrap">
          <div class="nodata" v-show="tasklist.length==0">该区域没有此数据</div>
          <div class="item" v-for="item in tasklist" :key="item.ID" @click="linshi1(item)">
              <div class="icon">
                  <span></span>
              </div>
              <div class="text">
                  <div>{{item.total}}</div>
                  <span>{{item.vtask}}总量</span>
              </div>
          </div>
      </div>
    </div>
    <div class="item2" @click="linshi2">
      <div class="title">弹药类型统计</div>
      <div class="itemwrap">
          <div class="nodata" v-show="qiangdan_typelist.length==0">该区域没有此数据</div>
          <div class="item" v-for="(item,index) in qiangdan_typelist" :key="index">
              <p>{{item.vQXingHao}}</p>
              <p>{{item.sums}}</p>
          </div>
         
      </div>
    </div>
    <div class="item3" @click="linshi3">
      <div class="title">{{cityName}}今日任务TOP5</div>
      <div class="list">
          
          <div class="item" v-for="(item,i) in top5" :key="item.cname">
              <span>{{i+1}}</span>
              <span>{{item.cname}}</span>
              <span>{{item.total}}</span>
          </div>
          <div class="nodata" v-show="top5.length==0">该区域没有此数据</div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import jindu2 from './children/jindu2'
export default {
    props:{
        tasklist:{
            type:Array,
            required:true
        },
        top5:{
            type:Array,
            required:true
        },
        cityName:{
            type:String,
            required:true
        },
        qiangdan_typelist:{
            type:Array,
            required:true
        },
        zanbiData:{
            type:Object,
            required:true
        },
        numbers:{
            type:Object,
            required:true
        },
    },
    components:{jindu2},
    methods:{
        linshi1(item){
           
            this.$emit('openDialog',{name:'dialoglistShow',id:item.id})
        },
        linshi2(){
            this.$emit('openDialog','dialoglongShow')
        },
        linshi3(){
            this.$emit('openDialog','dialogtongjiShow')
        }
    }
};
</script>
<style lang="less" scoped>
@import url("./right.less");
</style>