<template>
    <div class="wrap">
        <div class="map_wrap">
            <div id="map"></div>
            <button class="close" @click="closeMap">取消</button>
            <div class="del"  @click="closeMap">X</div>
        </div>
    </div>
</template>

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
             let liXianMapKey=this.$store.state.liXianMapKey;
            let lixianMapCenter=this.$store.state.lixianMapCenter;         
            var map = BM.map("map", liXianMapKey, {
                center: lixianMapCenter,
                zoom: 1,
                zoomControl: true
            });

            map.setZoom(10);
            this.BM = BM;
            this.map = map;
            this.setMarker(this.arr)
        },
        setMarker(arr) {
            let that=this
            let a=arr.map(item=>{
                return [item.lat-0,item.lon-0]
            })
           let marks=a.map(item=>{
               return BM.marker(item,{title:this.title}).addTo(this.map);
           })   
           marks.forEach((item,index)=>{
               this.map.on('click',function (){
                   that.$message({
                       type:'none',
                       message:`报警时间：${that.arr[index].date}`
                   })
               })
           })              
            this.map.fitBounds(a); 
        }
    },
    mounted(){
        this.mapInit()        
    }
}
</script>
<style lang="less"  scoped>

@vw:19.2vw;
@rem:100rem;
.wrap{
    position: fixed;
    z-index: 99;
    top:0;
    left:0;
    width:100vw;
    height:100vh;
    background: rgba(0, 0, 0, 0.3);
}
.map_wrap {
    position: absolute;
    width: 50%;
    height: 80%;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    background: url(../assets/img/qiangguixiangqing.png) no-repeat;
    background-size: 100% 100%;
    .del{
      position: absolute;
      right:20/@rem;
      top:20/@rem;
      width:30/@rem;
      height:30/@rem;
      text-align: center;
      line-height: 30/@rem;
      font-size: 20/@rem;
      color:#fff;
      border:1/@rem solid #fff;
      border-radius: 50%;
      cursor: pointer;
    }
    .close {
      position: absolute;
      right: 105/@rem;
      bottom: 6/@rem;
      width: 170/@rem;
      height: 30/@rem;
      font-size: 18/@rem;
      background: none;
      color: #fff;
      cursor: pointer;
    }
  
    .no {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      width: 60%;
      height: 10%;
      text-align: center;
    }
  
    #map {
      position: absolute;
      top: 4%;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      width: 98%;
      height: 84%;
    }
  }
</style>