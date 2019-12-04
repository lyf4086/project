<template>
    <div class="wrap">
        <div class="main-box">
            <button class="close" @click="cl"></button>
            <div id="item2map" v-show="showMap"></div>
            <div class="top" >
                <div class="l">
                    <span></span>
                    任务列表
                </div>
                <div class="r" @click="lookAllMarker" v-show="false">查看全部位置</div>
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
                <div class="item" v-for="(item,index) in dataList" :key="index">
                    <span>{{item.mname}}</span>
                    <span>{{item.taskType}}</span>
                    <span>{{item.pname||"无"}}</span>
                    <span>{{item.num}}</span>
                    <span>{{item.guns}}</span>
                    <span>{{item.bulletCount}}</span>
                    <span @click="lookmap(item)">查看详情</span>
                </div>
            </div>
            <div class="page" v-if="false">
                <el-pagination
                    :pager-count="5"
                    prev-text="上一页"
                    next-text="下一页"
                    layout="prev, pager, next"
                    :total="1000">
                </el-pagination>
            </div>
            <ShowAllMarkerLiXian @close="close" v-if="mapShowLiXian" :arr="personList"/>
            <ShowAllMarkerGaoDe @close="close" v-if="mapShowZaiXian" :arr="personList"/>
        </div>
    </div>
</template>
<style scoped>
@import url(./child2.css);
</style>
<script>
import ShowAllMarkerLiXian from '@/components/show-allmarker-lixian.vue'
import ShowAllMarkerGaoDe from '@/components/show-allmarker-gaode.vue'
export default {
    props:{
        data:{
            type:Object,
            default:{}
           
        },
         activeid:{
            type:String,
            default:''
        }
    },
    data(){
        return {
            sid:'',
            loading:null,
            dataList:[],
             showMap:false,
             mapShowLiXian:false,
             mapShowZaiXian:false,
             personList:[{
                latlng:["40.217396104601","116.265447591146"],
                name:'56787654',
                heart:1,
                astate:'2',
                message:{
                    a:1111,
                    b:22222,
                    c:3333
                }
            },{
               latlng:["40.212396104601","116.265447591146"],
                name:'56787654',
                heart:0,
                astate:'',
                message:{
                    a:1111,
                    b:22222,
                    c:3333
                }
            }]
        }
    },
    components:{ShowAllMarkerLiXian,ShowAllMarkerGaoDe},
    methods:{
        lookmap(item){
            this.rewuditu(item.iTask,this.sid)

        },
        lookAllMarker(){
            console.log('lookall')
            
        },
        close(){
            this.mapShowZaiXian=false
            this.mapShowLiXian=false
        },
        cl(){
            this.$emit('close')
        },
        renwuliebiao(server_id='', tid ,sid){
            this.loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            var objs = {"server_id":server_id ,"tid":tid,"sid":sid};
            var key = this.$store.state.key;
            var sign = this.$methods.mkSign(objs, key);
            var token = this.$gscookie.getCookie("gun");
            var params = new URLSearchParams();
            params.append("sign", sign);
            params.append("token", token);
            params.append("server_id", objs.server_id);
            params.append("tid", objs.tid);
            params.append("sid", objs.sid);
            this.$axios({
            url:
                this.$store.state.baseURL +
                "/weixin/project/index.php?m=Home&c=Page&a=task_list",
            method: "POST",
            changeOrigin: true,
            data: params
            })
            .then(data => {
                if(data.status==200){
                    this.loading.close()
                    console.log(data.data.data)
                    this.dataList=data.data.data
                }
                
            })
            .catch(error => {
                console.log(error);
            });
        },
        rewuditu(tid,sid){
            this.loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
             var objs = {"tid":tid,"sid":sid};
            var key = this.$store.state.key;
            var sign = this.$methods.mkSign(objs, key);
            var token = this.$gscookie.getCookie("gun");
            var params = new URLSearchParams();
            params.append("sign", sign);
            params.append("token", token);
            params.append("tid", objs.tid);
            params.append("sid", objs.sid);
            this.$axios({
            url:
                this.$store.state.baseURL +
                "/weixin/project/index.php?m=Home&c=Page&a=task_map",
            method: "POST",
            changeOrigin: true,
            data: params
            })
            .then(data => {
                if(data.status==200){
                    this.loading.close()
                    let zaixian=this.$store.state.zaixian
                    let personList=data.data.map(item=>{
                        if(zaixian){
                            return {
                                latlng:[item.longitude,item.latitude],
                                name:item.policeName,
                                heart:1,
                                astate:'',
                                message:{
                                    "持枪类型":item.gunType,
                                    "用途":item.taskType
                                }
                            }
                        }else{
                            return {
                                latlng:[item.latitude,item.longitude],
                                name:item.policeName,
                                heart:1,
                                astate:'',
                                message:{
                                    "持枪类型":item.gunType,
                                    "用途":item.taskType
                                }
                            }
                        }
                        
                    })
                    this.personList=personList
                    
                    if(zaixian){
                        this.mapShowZaiXian=true
                    }else{
                        this.mapShowLiXian=true
                    }
                }
                
            })
            .catch(error => {
                console.log(error);
            });
        }
    },
    mounted(){
        this.renwuliebiao(this.activeid, this.data.ID ,this.data.sid)
        console.log('child2打开')
        this.sid=this.data.sid
    }
}
</script>