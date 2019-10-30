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
        </div>
    </div>
</template>
<style scoped>
@import url(./child2.css);
</style>
<script>
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
             showMap:false
        }
    },
    methods:{
        lookmap(item){
            console.log(item)
            this.rewuditu(item.iTask,this.sid)
            this.showMap=true
            this.initMap()
        },
        cl(){
            this.$emit('close')
        },
        initMap(){
            let map = new AMap.Map("item2map", {
                center: [116.397428, 39.90923],
                resizeEnable: true,
                zoom: 13
            });
            this.map = map;
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
                    this.dataList=data.data.data
                }
                
            })
            .catch(error => {
                console.log(error);
            });
        },
         setMarker(list) {
             console.log(list)
            let that=this
            let activeImg = require("@/assets/img/head-icon.png"); //引入默认图片
            let markerArr = list.map((item, i) => {
                let xy = [item.longitude, item.latitude];
                // 
                return new AMap.Marker({
                // content: `<div class="marker-route11" >
                //             <div class="cover11" ></div>
                //             <div class="img_wrap11">
                //                 <img src="${activeImg}" />
                //             </div>
                //             </div>`,
                position: xy,
                IMEI:item.IMEI||'',
                created:item.created||'',
                gun_code:item.gun_code||'',
                heart:item.heart||'',
                mechanism_name:item.mechanism_name||'',
                ptype:item.ptype||'',
                title: item.policeName||'',
                offset: new AMap.Pixel(-16, -56)
                });
            });

            // markerArr.forEach(item => {
            //     AMap.event.addListener(item, "click", function(ev) {
            //     // console.log(item.Ge)
            //     that.$alert(`
            //         <p>枪瞄编号：${item.Ge.IMEI}</p>
            //         <p>枪支编号：${item.Ge.gun_code}</p>
            //         <p>是否在线：${item.Ge.heart==0?"不在线":"在线"}</p>
            //         <p>所属机构：${item.Ge.mechanism_name}</p>
            //         <p>定位类型：${item.Ge.ptype}</p>
            //     `, item.Ge.title, {
            //         dangerouslyUseHTMLString: true,
            //         showClose:false
            //         });
                
            //     });
            // });

            this.map.add(markerArr);
            this.map.setFitView([...markerArr]);
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
                    // console.log(data.data)
                    this.setMarker(data.data)
                }
                
            })
            .catch(error => {
                console.log(error);
            });
        }
    },
    mounted(){
        this.renwuliebiao(this.activeid, this.data.ID ,this.data.sid)
        // console.log(this.data)
        this.sid=this.data.sid
    }
}
</script>