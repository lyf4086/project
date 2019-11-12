<template>
    <div id="map-wrap">
        高德地图
    </div>
</template>
<style lang="less" scoped>
@rem:100rem;
@vw:19.2vw;
#map-wrap{
    position: fixed;
    top:0;
    left:0;
    z-index: 9;
    width:100%;
    height:100%;
    background: pink;
}
.marker-route {
    position: relative;
    width: 40/@rem;
    height: 46/@rem;
  }
  .is_lixian{
    .cover{
      filter: grayscale(90%);
    }
    .img_wrap{
      filter: grayscale(90%);
    }
  }
  .marker-route .cover {
    // position: relative;
     
    width: 100%;
    height: 100%;
    background: url(../assets/img/tou.png) no-repeat;
    background-size: 100% 100%;
    .warningtype{
      position: absolute;
      right:0;
      bottom: 0;
      width: 20/@rem;
      height:20/@rem;
      
    }
    .litao{
      // background: red;
    }
  }

  .marker-route .img_wrap {
    width: 38/@rem;
    height: 38/@rem;
    margin-top: 1/@rem;
    margin-left: 0/@rem;
    border-radius: 50%;
    overflow: hidden;
   box-shadow: 0 0 20px red;
    img {
      width: 102%;
    }
  }
  .marker-route .set-type{
    position: absolute;
    z-index: 999;
    top:-9/@rem;
    right:-9/@rem;
    width:22/@rem;
    height:22/@rem;
  }
  .marker-route .litao-s{
    background: url(../assets/img/litao-s.png);
    background-size: 100% 100%;;
  }
  .marker-route .rutao-s{
    background: url(../assets/img/rutao-s.png);
    background-size: 100% 100%;;
  }
  .marker-route .fanwei-s{
    background: url(../assets/img/fanwei-s.png);
    background-size: 100% 100%;;
  }


</style>
<script>
export default {
    data(){
        return {

        }
    },
    methods:{
        mapInit(obj) {
            //  console.log(this.title,this.arr)
            //  let a=this.arr[0]>this.arr[1]?[this.arr[0],this.arr[1]]:[this.arr[1],this.arr[0]]
            let map = new AMap.Map("map-wrap", {
                center: [116.397428, 39.90923],
                // center:a,
                resizeEnable: true,
                zoom: 13
            }); 
            this.map=map 
            this.setMarker()         
        },
        setMarker(arr) {
            let that=this
            let a=arr||[{lnglat:[116.397428, 39.90923]}]
            let activeImg = require("@/assets/img/head-icon.png")
           let markerArr=a.map((item,index)=>{
               return new AMap.Marker({
                   content: `<div class="marker-route is_lixian">
                                <div class="cover"></div>
                                <div class="img_wrap">
                                <img src="" />
                                </div>
                                <div class="set-type litao-s"></div>
                            </div>`,
                   position:new AMap.LngLat(...item.lnglat),
                   title:"8888"
               })
           })
            this.map.add(...markerArr);
            this.map.setFitView([...markerArr]);
            markerArr.forEach(item=>{
                item.on('click',function (){
                    const h = that.$createElement;
                    that.$message({
                        type:"info",
                        message:h('div',{style:"font-size:12px"},[
                            h('p',null,`所属机构：xxx`),
                            h('p',null,`报警类型：xxx`)
                        ]),
                        duration:4000
                    })
                })
            })
            
        }
    },
    mounted(){
        this.mapInit()
    }
}
</script>