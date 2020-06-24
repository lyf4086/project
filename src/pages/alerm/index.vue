<template>
    <div class="">
        <div class="on_off" v-show="!zhankai" :class="zhankai?'zhankai':''" @click="changeAlarm">
            <div class="btn">显示列表</div>
            <div class="icon"></div>
        </div>
        <div class="new_alarm_list" :class="zhankai?'':'guanbi'">
            <div class="btn_change" @click="close">
                <i></i>
            </div>
            <div class="list_wrap">
                <div class="move_list" id="arlarm_move_list">
                    <transition name="slide-fade" v-for="(item,index) in list" :key="item.alarm_info_id" v-if="item.show">
                        <div class="item">
                            <div class="bg">
                                <div class="clo"></div>
                            </div>
                            <div class="num" :class="`number${index}`">{{index+1}}</div>
                            <div class="text" @click="personClick(item)">{{item.policeuser_name}} （{{item.type}}）</div>
                            <button @click="done(item,index)">急速处理</button>
                            
                        </div>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
@import url(./index.css);
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(-1rem);
  opacity: 0;
}
</style>
<script>
export default {
    props:{
        list:{
            type:Array,
            required:true
        }
    },
    data(){
        return{
            zhankai:true,
            
        }
    },
    methods:{
       
        changeAlarm(){
            this.zhankai=!this.zhankai
        },
        close(){
            this.zhankai=!this.zhankai
        },
        personClick(item){
            this.$emit('nameClick',item)
        },
        done(item,index){
            
            this.$emit('doneClick',{item,index})
        }
    },
    mounted(){
        this.$methods.listMove("#arlarm_move_list");
    }
}
</script>