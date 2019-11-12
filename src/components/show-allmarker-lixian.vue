<template>
    <div id="map-wrap">
        离线地图
    </div>
</template>
<style scoped>
@import url('./show-allmarker-lixian.css');
</style>
<script>
export default {
    data(){
        return {

        }
    },
    methods:{
       mapInit(arr) {
            let that = this;
            BM.Config.HTTP_URL = this.$store.state.lixianStr           
            var map = BM.map("map-wrap", "bigemap.ap8r91ep", {
                center: [39.9, 116.32],
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
            }]
        this.mapInit(arr)
    }
}
</script>