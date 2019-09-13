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
    props:["arr","title"],
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
            var map = BM.map("map", "bigemap.awiawk58", {
                center: [39.9, 116.32],
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
            BM.marker(a,{title:this.title}).addTo(map);          
            map.fitBounds([a]);           
        }
    },
    mounted(){
        this.mapInit()        
    }
}
</script>