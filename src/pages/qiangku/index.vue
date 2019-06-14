<template>
    <div class="qiangku">
        <div class="tree-menu">
            <h3>枪库</h3>
            <div class="nav-wrap">
                 <LeftNav/>
            </div>

        </div>
        <div class="top-nav">

        </div>
        <div class="page-index" >
            <el-pagination
            :page-size="20"
            :pager-count="11"
            layout="prev, pager, next"
            :total="1000">
            </el-pagination>
        </div>

        <div class="content">
            <Content/>
        </div>
        <div class="alert" style="display:none">
            <div class="text-wrap">
               <div class="text-title">新增人员</div>
               <div class="text-content">

                        <span>名称:</span>
                        <input type="text" />

                        <span>编号:</span>
                        <input type="text" />

                        <span>枪支数量:</span>
                        <input type="text" />

                        <span>警员数量:</span>
                        <input type="text" />

                        <span>所属单位:</span>
                        <input type="text" />

                        <span>创建日期:</span>
                        <input type="text" />

               </div>
               <div class="submit">确认</div>
            </div>
        </div>
    </div>
</template>
<style scoped>
@import url(./index.css);

</style>
<script>
import LeftNav from '@/components/leftnav'
import Content from './children/content'
    export default {
        components:{LeftNav,Content},
        created(){
            let str=this.$gscookie.getCookie('gun')
            if(JSON.stringify(str)=="{}"){
                this.$router.push("/loginput")
            }
        }

    }
</script>
