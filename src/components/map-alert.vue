<template>
    <div class="map" v-show="isShow">
        地图弹窗
        <button @click="del">X</button>
    </div>
</template>
<style>
@import url(./map-alert.css);
</style>
<script>
    export default {
        props:{
            isShow:{
                type:Boolean,
                default:false
            },
            delthis:{
                type: Function,
                default:null
            }
        },
        methods: {
            del(){
                // alert(999)
                this.delthis()
            }
        }
    }
</script>
