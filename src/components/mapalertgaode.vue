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
@import url(./mapalertgaode.css);
</style>
<script>
export default {
    props:["arr","mes","title"],
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
        
        mapInit(obj) {
            //  console.log(this.title,this.arr)
             let a=this.arr[0]>this.arr[1]?[this.arr[0],this.arr[1]]:[this.arr[1],this.arr[0]]
            let map = new AMap.Map("map", {
                // center: [116.397428, 39.90923],
                center:a,
                resizeEnable: true,
                zoom: 13
            }); 
            this.map=map 
            this.setMarker(a)         
        },
        setMarker(arr) {
            let that=this
            let a=arr||[116.397428, 39.90923]
             var marker = new AMap.Marker({
                position: new AMap.LngLat(...a),
                // position: new AMap.LngLat(obj.longitude, obj.latitude), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                title: this.title
            });
           
            this.map.add(marker);
            this.map.setFitView([...marker]);
            
            marker.on('click',function (){
    
               that.$message({
                   type:"none",
                   message:that.mes,
                   duration:4000
               })
            })
        }
    },
    mounted(){       
        this.mapInit()        
    }
}
</script>