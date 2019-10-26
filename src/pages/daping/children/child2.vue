<template>
    <div class="wrap">
        <div class="main-box">
            <button class="close" @click="cl"></button>
            <div class="top">
                <div class="l">
                    <span></span>
                    任务列表
                </div>
                <div class="r">查看全部位置</div>
            </div>
            <div class="header">
                <span>机构名称</span>
                <span>任务名称</span>
                <span>带队人员</span>
                <span>人员数量</span>
                <span>枪支数量</span>
                <span>子弹数量（发）</span>
                <span>查看详情</span>
            </div>
            <div class="list">
                <div class="item" v-for="e in 13">
                    <span>机构名称</span>
                    <span>任务名称</span>
                    <span>带队人员</span>
                    <span>人员数量</span>
                    <span>枪支数量</span>
                    <span>子弹数量（发）</span>
                    <span>查看详情</span>
                </div>
            </div>
            <div class="page">
               
                <el-pagination
                    :pager-count="5"
                    prev-text="上一页"
                    next-text="下一页"
                    layout="prev, pager, next"
                    :total="1000">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<style scoped>
@import url(./child2.css);
</style>
<script>
export default {
    data(){
        return {
            a:'2222'
        }
    },
    methods:{
        cl(){
            this.$emit('close')
        },
        
    },
    mounted(){
        
    }
}
</script>