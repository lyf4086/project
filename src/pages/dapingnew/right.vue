<template>
<div>
  <div class="left">
    <div class="item1" @click="linshi1">
      <div class="title">任务统计</div>
      <div class="chartwrap">
          <div class="item">
              <div class="txt">
                  <span>全国当日任务</span>
                  <span>1506</span>
              </div>
              <div class="bar">
                  <jindu2 :num="98"></jindu2>
              </div>
          </div>
          <div class="item">
              <div class="txt">
                  <span>全国枪支总量</span>
                  <span>1813</span>
              </div>
              <div class="bar">
                  <jindu2 :num="38"></jindu2>
              </div>
          </div>
      </div>
      <div class="itemwrap">
          <div class="item" v-for="item in tasklist" :key="item.ID">
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
          <div class="item">
              <p>77式</p>
              <p>104359</p>
          </div>
          <div class="item">
              <p>92式</p>
              <p>104359</p>
          </div>
          <div class="item">
              <p>97式</p>
              <p>104359</p>
          </div>
          <div class="item">
              <p>77式</p>
              <p>104359</p>
          </div>
          <div class="item">
              <p>77式</p>
              <p>104359</p>
          </div>
      </div>
    </div>
    <div class="item3" @click="linshi3">
      <div class="title">全国当日任务TOP5</div>
      <div class="list">
          <div class="item" v-for="(item,i) in top5" :key="item.cname">
              <span>{{i+1}}</span>
              <span>{{item.cname}}</span>
              <span>{{item.total}}</span>
          </div>
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
        }
    },
    components:{jindu2},
    methods:{
        linshi1(){
            this.$emit('openDialog','dialoglistShow')
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