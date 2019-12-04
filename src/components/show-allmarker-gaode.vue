<template>
  <div class="wrap">
    <div id="map-wrap">
        高德地图
    </div>
    <button @click="closeSelf">X</button>
  </div>
    
</template>
<style lang="less" scoped>
@rem:100rem;
@vw:19.2vw;
@vh:10.8vh;
.wrap{
  position: fixed;
  width:100vw;
  height:100vh;
  top:0;
  left: 0;
  button{
      position: absolute;
      z-index: 10;
      top:8/@vw;
      right:6/@vw;
      width:40/@vw;
      height:40/@vw;
      text-align: center;
      line-height: 40/@vw;
      background: cornflowerblue;
      color:#fff;
      border-radius: 50%;
      cursor: pointer;
    }
}
#map-wrap{
    position: absolute;
    top:0;
    left:0;
    right: 0;
    bottom:0;
    margin:auto;
    z-index: 9;
    width:1608/@vw;
    height:926/@vh;
    
}
/deep/.marker-route {
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
  /deep/.marker-route .cover {
    position: relative;
     z-index: 11;
    width: 100%;
    height: 100%;
    background: url(../assets/img/tou.png) no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
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

  /deep/.marker-route .img_wrap {
    position: absolute;
    top:1px;
    left:1px;
    width: 38/@rem;
    height: 38/@rem;
    margin-top: 1/@rem;
    margin-left: 0/@rem;
    border-radius: 50%;
    overflow: hidden;
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
  props:['arr'],
    data(){
        return {

        }
    },
    methods:{
      closeSelf(){
         this.$emit('close')
      },
        mapInit() {
            let map = new AMap.Map("map-wrap", {
                center: [116.397428, 39.90923],
                resizeEnable: true,
                zoom: 13
            }); 
            this.map=map 
            this.setMarker(this.arr)         
        },
        setMarker(arr) {
          if(!this.arr.length)return
            let that=this
            let activeImg = require("@/assets/img/head-icon.png")
           let markerArr=arr.map((item,index)=>{
               return new AMap.Marker({
                   content: `<div class="marker-route is_lixian">
                                <div class="cover"></div>
                                <div class="img_wrap">
                                <img src="${activeImg}" />
                                </div>
                                <div class="set-type litao-s"></div>
                            </div>`,
                   position:new AMap.LngLat(...item.latlng),
                   title:item.name
               })
           })
            this.map.add(markerArr);
            this.map.setFitView([...markerArr]);
            markerArr.forEach((item,index)=>{
                item.on('click',function (){
                  const h = that.$createElement;
                  let list=[]
                  for(let i in arr[index].message){
                    list.push(h('p',null,`${i}：${arr[index].message[i]}`))
                  }
                    that.$message({
                        type:"info",
                        message:h('div',{style:"font-size:16px;line-height:30px"},list),
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