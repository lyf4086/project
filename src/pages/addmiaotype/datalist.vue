<template>
    <div class="slot-wrap">
        <div class="slot-title" style="grid-template-columns: repeat(4,1fr)">
            <span>时间</span>
            <span>地点</span>
            <span>任务</span>
            <span>操作</span>
        </div>
        <div class="slot-item" v-for="item in 5" style="grid-template-columns: repeat(4,1fr)">
            <span>时间</span>
            <span>地点</span>
            <span>任务</span>
            <span>
                 <el-button class="slot-btn" size="mini" type="primary">主要按钮</el-button>
            </span>
        </div>
    </div>
</template>
<script>
export default {
    
}
</script>