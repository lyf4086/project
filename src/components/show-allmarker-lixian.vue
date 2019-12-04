<template>
    <div class="wrap">
        <div id="map-wrap">
            离线地图
        </div>
        <button @click="closeSelf">X</button>
        <div class="list-mian">
            <div class="list-title">
                <span>111</span>
                <span>222</span>
                <span>333</span>
                <span>44</span>
                <span>55</span>
            </div>
            <div class="list-content" v-show="listShow">
                <div class="item" v-for="e in 20">
                    <span>1111</span>
                    <span>2222</span>
                    <span>3333</span>
                    <span>4444</span>
                    <span>55555</span>
                </div>
            </div>
            <div class="show-hide">
                <i></i>
            </div>
        </div>
    </div>
</template>
<style scoped>
@import url('./show-allmarker-lixian.css');
</style>
<script>
export default {
    props:{
        arr:{
            type:Array,
            required:false
        }
    },
    data(){
        return {
            listShow:false
        }
    },
    methods:{
        closeSelf(){
            this.$emit('close')
        },
       mapInit(arr) {
            let that = this;
            BM.Config.HTTP_URL = this.$store.state.lixianStr 
            let liXianMapKey=this.$store.state.liXianMapKey;
            let lixianMapCenter=this.$store.state.lixianMapCenter;          
            var map = BM.map("map-wrap", liXianMapKey, {
                center: lixianMapCenter,
                zoom: 1,
                zoomControl: true
            });

            map.setZoom(10);
            this.BM = BM;
            this.map = map;
           
            this.setMarker(arr)
        },
        setMarker(arr) {            
            let that = this;
            let BM = this.BM;
            let map = this.map;
            
            let markers=arr.map(item=>{
                let activeImg =item.img|| require("@/assets/img/head-icon.png");
                let stateName=''
                if(item.astate==1){
                stateName='litao';
                }else if(item.astate==2){
                stateName='rutao';
                }else if(item.astate==3){
                stateName='fanwei';
                }else{
                stateName='';
                }
                let icon=this.BM.divIcon({
                    html:`<div class="marker-route11 ${item.heart==1?null:'lixian'}" style="margin-top:-50px;margin-left:-20px;">
                            <div class="cover11" ></div>
                            <div class="img_wrap11">
                                <img src="${activeImg}" />
                            </div>
                            <div class="set-type ${stateName}"></div>
                            </div>`
                })
                return BM.marker(item.latlng,{
                    title:item.name,
                    icon:icon
                }).addTo(map)
            })
            markers.forEach((item,index)=>{
                item.on('click',function (){
                    let h=that.$createElement;
                    let a=[]
                    for(let e in arr[index].message){
                        a.push(h('p',{},arr[index].message[e]))
                    }
                    
                    that.$message({
                        type:'none',
                        duration:5000,
                        message:h('div',{style:"color:#000;font-size:0.18rem;line-height:0.4rem"},a)
                    })
                })
            })  
            let a=arr.map(e=>e.latlng)    
            map.fitBounds([a]);           
        }
    },
    mounted(){
            let arr=[{
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
            },{
                latlng:["40.215396104601","116.263447591146"],
                name:'56787654',
                heart:0,
                astate:'3',
                message:{
                    a:4444,
                    b:5555,
                    c:6666
                }
            }]
           
        this.mapInit(this.arr)
    }
}
</script>