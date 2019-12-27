<template>
  <div class="wrap">
      <div class="cover" v-show="coverShow"></div>
    <div id="new-map"></div>
  </div>
</template>
<style scoped>
@import url(./index.css);
/* @import url(./item5.css); */
</style>
<script>
export default {
  data() {
    return {
      coverShow:false,
      map: null,
      BM: null,
      loading:null,
      markerList:[],//在线状态存放所有标记点
      lixianArr:[],//离线状态存放所有标记点
      timer:null
    };
  },
  methods: {
    initMap() {
      let zaixian = this.$store.state.zaixian;
      if (zaixian) {
        let map = new AMap.Map("new-map", {
          center: [116.397428, 39.90923],
          resizeEnable: true,
          zoom: 13
        });
        this.map = map;
      } else {
        let that = this;
        let liXianMapKey = this.$store.state.liXianMapKey;
        let lixianMapCenter = this.$store.state.lixianMapCenter;
        BM.Config.HTTP_URL = this.$store.state.lixianStr;
        var map = BM.map("new-map", liXianMapKey, {
          center: lixianMapCenter,
          zoom: 1,
          zoomControl: true
        });
        map.setZoom(10);
        this.BM = BM;
        this.map = map;
      }
    },
    setMarkerZaiXian(list,num,vtask,headerPerson) {
      let that = this;
      let activeImg = require("@/assets/img/head-icon.png"); //引入默认图片
      let markerArr = list.map((item, i) => {
        let xy = [item.longitude, item.latitude];
        let html =
          item.leader && item.leader == 1 ? `<div class=${'leader'+num}></div>` : "";
          let cln='cover'+num+''+num
          
        return new AMap.Marker({
          content: `<div class="marker-route11 ${
            !!item.heart && item.heart == 1 ? "" : "is_lixian"
          }" >
                      <div class="${cln}" ></div>
                      <div class="img_wrap11">
                        <img src="${activeImg}" />
                      </div>
                      <div class="set-type ${item.IMEI} ${
            item.astate === "1" ? "litao" : null
          } ${item.astate === "2" ? "rutao" : null} ${
            item.astate === "3" ? "fanwei" : null
          }"
                        title="报警类型" 
                      ></div>
                      ${html}
                    </div>`,
          position: xy,
          vtask:vtask,
          headerPerson:headerPerson,
          IMEI: item.IMEI,
          created: item.created,
          gun_code: item.gun_code,
          heart: item.heart,
          mechanism_name: item.mechanism_name,
          ptype: item.ptype,
          title: item.policeName,
          offset: new AMap.Pixel(-16, -39)
        });
      });
        this.markerList.push(...markerArr)
      markerArr.forEach(item => {
        AMap.event.addListener(item, "click", function(ev) {
          that.coverShow = true;
          setTimeout(() => {
            that.coverShow = false;
          }, 3000);
          const h = that.$createElement;
          that.$message({
            type: "none",
            duration: 3000,
            message: h("div", { style: "font-size:18px;line-height:30px;" }, [
                 h("p", null, `任务名称：${item.Ge.vtask}`),
                 h("p", null, `带队警员：${item.Ge.headerPerson}`),
              h("p", null, `警员姓名：${item.Ge.title}`),
              h("p", null, `所属机构：${item.Ge.mechanism_name}`),
              h("p", null, `枪瞄编号：${item.Ge.IMEI}`),
              h("p", {}, `枪支编号：${item.Ge.gun_code || ""}`),
              h("p", {}, `是否在线：${item.Ge.heart == 0 ? "不在线" : "在线"}`),
              h("p", {}, `定位类型：${item.Ge.ptype}`)
            ])
          });
        });
      });
        
      this.map.add(markerArr);
      this.map.setFitView([...this.markerList]);
    },
    setMarkerLiXian(arr,num=0,vtask,headerPerson) {
        console.log(arr.length)
      let that = this;
      let BM = this.BM;
      let map = this.map;
      let markerArr = arr.map(item => {
        let cln = item.heart == 1 ? null : "is_lixian";
        let stateName = "";
        if (item.astate == 1) {
          stateName = "litao";
        } else if (item.astate == 2) {
          stateName = "rutao";
        } else if (item.astate == 3) {
          stateName = "fanwei";
        } else {
          stateName = "";
        }
        let clnColor='cover'+num+''+num
        let html =
          item.leader && item.leader == 1 ? `<div class=${'leader'+num}></div>` : "";
        let activeImg = require("@/assets/img/head-icon.png");
        let icon = this.BM.divIcon({
          html: `<div class="marker-route11 lixian ${cln}" style="margin-top:-50px;margin-left:-20px;">
                      <div class="${clnColor}" ></div>
                      <div class="img_wrap11">
                        <img src="${activeImg}" />
                      </div>
                      <div class="set-type ${stateName}"></div>
                      ${html}
                    </div>`
        });
        return BM.marker([item.latitude - 0, item.longitude - 0], {
          title: item.policeName,
          icon: icon
        }).addTo(map);
      });
      let lixianArr = arr.map(item => {
        return [item.latitude - 0, item.longitude - 0];
      });
      this.lixianArr.push(...lixianArr)
      map.fitBounds(this.lixianArr);
      this.markerArr = markerArr;
      markerArr.forEach((item, index) => {
        item.on("click", function() {
            that.coverShow = true;
          setTimeout(() => {
            that.coverShow = false;
          }, 3000);
          const h = that.$createElement;
          that.$message({
            type: "none",
            duration: 3000,
            message: h(
              "div",
              { style: "font-size:0.18rem;line-height:0.32rem" },
              [
                h("h1", null, `任务名称：${vtask}`),
                h("h1", null, `带队警员：${headerPerson}`),
                h("h1", null, `警员姓名：${arr[index].policeName}`),
                h("p", {}, `所属机构：${arr[index].mechanism_name}`),
                h("p", {}, `定位类型：${arr[index].ptype}`),
                h(
                  "p",
                  {},
                  `是否在线：${arr[index].heart == 1 ? "在线" : "不在线"}`
                ),
                h("p", {}, `定位时间：${arr[index].created}`)
              ]
            )
          });
          that.coverShow = true;
          setTimeout(() => {
            that.coverShow = false;
          }, 3000);
        });
      });
    },
    getData(server_id) {
        this.loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
        });
      var objs = {

      };
      if(server_id){
          objs.server_id=server_id
      }
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);
      var token = this.$gscookie.getCookie("gun");
      var params = new URLSearchParams();
      params.append("sign", sign);
      params.append("token", token);
       if(server_id){
          params.append("server_id", objs.server_id);
      }
      this.$axios({
        url:this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=Page&a=map_task",
        method: "POST",
        changeOrigin: true,
        data: params
      }).then(res=>{
          let zaixian=this.$store.state.zaixian
          if(res.status==200){
              this.loading.close()
              if(zaixian){
                  let dataList=res.data.data.data
                  dataList.forEach((item,index)=>{
                      if(item.child.length){
                          this.setMarkerZaiXian(item.child,index,item.vtask,item.policeuser_name)
                      }
                  })
                  
              }else{
                   let dataList=res.data.data.data
                  dataList.forEach((item,index)=>{
                      if(item.child.length){
                          this.setMarkerLiXian(item.child,index,item.vtask,item.policeuser_name)
                      }
                  })
                  
              }
          }
      }).catch(err=>{
          console.log(err)
      })
    }
  },
  mounted() {
    this.initMap();
    this.getData()
    this.timer=window.setInterval(()=>{
        this.$router.go(0)
    },600000)//暂定10分钟刷新一次
  },
  beforeDestroy(){
      window.clearInterval(this.timer)
  }
};
</script>