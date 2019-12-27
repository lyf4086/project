<template>
    <div class="wrap">
        <div class="map_wrap">
            <div id="map"></div>
            <button class="close" @click="closeMap">取消</button>
            <div class="del"  @click="closeMap">X</div>
        </div>
    </div>
</template>
<style  scoped>
@import url(./map-marker.css);
</style>
<script>
export default {
    props:["arr","title","mes"],
    data(){
        return {
            BM:null,
            map:null
        }
    },
    methods:{
        closeMap(){
            this.$emit('closeMap')
        },
        mapInit() {
            let that = this;
            BM.Config.HTTP_URL = this.$store.state.lixianStr 
             let liXianMapKey=this.$store.state.liXianMapKey;
            let lixianMapCenter=this.$store.state.lixianMapCenter;         
            var map = BM.map("map", liXianMapKey, {
                center:lixianMapCenter,
                zoom: 1,
                zoomControl: true
            });

            map.setZoom(10);
            this.BM = BM;
            this.map = map;
           
            this.setMarker(this.arr)
        },
        setMarker(arr) {
            let a=arr[0]>arr[1]?[arr[1],arr[0]]:[arr[0],arr[1]]
            let that = this;
            let BM = this.BM;
            let map = this.map;
            let mar=BM.marker(a,{title:this.title}).addTo(map); 
            mar.on('click',function (){
                if(!that.mes)return
                that.$message({
                    type:'none',
                    message:`${that.mes.mechanism_name}`
                })
            })         
            map.fitBounds([a]);           
        }
    },
    mounted(){
        this.mapInit()        
    }
}
</script>