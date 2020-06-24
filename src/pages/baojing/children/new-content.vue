<template>
    <div class="wrap">
        <div class="new_main">
            <div class="new_item hvr-float-shadow" :class="{selected:item.checked}" v-for="(item,index) in list" :key="index">
                <div class="new_top">
                    <div class="sel_wrap" :class="{selected:item.checked}" 
                    v-show="!item.desc && item.types!='08'&&item.type!='逾期报警'"
                    @click="changeSelect(index)"></div>
                    <div class="img_wrap">
                        <img v-if="item.policeuser.img" :src="item.policeuser.img"/>
                        <img v-if="!item.policeuser.img" src="../../../assets/img/head-icon.png" >
                    </div>
                    <div class="text_wrap">
                        <div>{{item.policeuser.policeuser_name}}<i>{{item.policeuser.police_number}}</i></div>
                        <div>{{item.created | changeTime}}</div>
                    </div>
                </div>
                <div class="new_con">
                    <div class="new_floor">
                        <span>报警类型</span>
                        <span>{{item.type}}</span>
                    </div>
                    <div class="new_floor">
                        <span>处理人</span>
                        <span>{{item.uname || "暂无"}}</span>
                    </div>
                    <div class="new_floor">
                        <span>枪支编号</span>
                        <span>{{item.gun.gun_code}}</span>
                    </div>
                    <div class="new_floor">
                        <span>枪瞄编号</span>
                        <span>{{item.IMEI}}</span>
                    </div>
                    <div class="new_floor">
                        <span>是否处理</span>
                        <span :style="{color:!item.desc?'#fa6400':''}">{{item.desc|shifouchuli}}</span>
                    </div>
                    <div class="btn_wrap">
                        <button class="hvr-sweep-to-right" @click="showNew(item)">最新位置</button>
                        <button class="hvr-sweep-to-right" @click="showAlert(item)">报警位置</button>
                    </div>
                    <div class="more" @click="showMore(item)">查看详情</div>
                </div>
            </div>
           
        </div>
    </div>
</template>
<style scoped>
@import url('./new-content.css');
</style>
<script>
export default {
    props:{
        list:{
            type:Array,
            required:true
        }
    },
    filters:{
        changeTime(timestamp) {
            var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + "-";
            var M =
                (date.getMonth() + 1 < 10
                ? "0" + (date.getMonth() + 1)
                : date.getMonth() + 1) + "-";
            var D = date.getDate() + " ";
            var h = date.getHours() + ":";
            var m = date.getMinutes() + ":";
            var s = date.getSeconds();
            return Y + M + D + h + m + s;
        },
        shifouchuli(str){
            return str? "已处理" : "未处理";
        }
    },
    methods:{
        changeSelect(index){
            this.list[index].checked=!this.list[index].checked
        },
        showMore(item){
            this.$emit('showxiangqing',item)
        },
        showNew(item){
            this.$emit('showNew',item)
        },
        showAlert(item){
            this.$emit('showAlert',{
                id:item.alarm_info_id,
                name:item.policeuser.policeuser_name,
                type:item.type
            })
        },
    }
}
</script>