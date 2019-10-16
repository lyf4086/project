<template>
    <div class="main">
        <ul class="nav-list">
            <li class="nav-item" v-for="(item,index) in 6" >
                <div class="bg-pic"></div>
                <div class="text-wrap">
                    <span>持枪人员</span>
                    <i>X</i>
                </div>
            </li>
            
        </ul>
        <div class="search-wrap">
           <div class="more"></div>
            <div class="input-wrap">
               <div class="sel">
                    <span class="text">{{text}}</span>
                    <span class="btn-l" :class="{'btn-b':this.isShow}" @click="seltext"></span>
                    <ul class="list " :class="{'active':this.isShow}">
                        <li v-for="i in txtarr" @click="seltxt(i)">{{i}}</li>
                       
                    </ul>
               </div>
               <div class="put-btn">
                    <input type="text" />
                    <button></button>
               </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
@import url(./topnav.css);

</style>
<script>
    export default {
        data(){
            return {
                input5:'',
                select:'',
                isShow:false,
                text:'默认文字',
                txtarr:['111111','22222','333333','4444','55555']
            }
        },
        methods: {
            seltext(){
                this.isShow=!this.isShow
            },
            seltxt(i){
                this.text=i;
                this.isShow=false
            }
        }
    }
</script>