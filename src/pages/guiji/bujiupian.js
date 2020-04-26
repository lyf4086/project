function getBujiupian(IMEI,stime,etime){
  this.loading = this.$loading({
    lock: true,
    text: "Loading",
    spinner: "el-icon-loading",
    background: "rgba(0, 0, 0, 0.7)"
  });
    var key = this.$store.state.key
    var objs = {
        "IMEI": IMEI,
        "stime": stime,
        "etime": etime,
        "ps": 999
    };
    var sign = this.$methods.mkSign(objs, key);
    var token = this.$gscookie.getCookie('gun')
    var params = new URLSearchParams();
    params.append('IMEI', objs.IMEI);
    params.append('stime', objs.stime);
    params.append('etime', objs.etime);
    params.append('ps', objs.ps);
    params.append('sign', sign);
    params.append('token', token)
    this.$axios({
        url: this.$store.state.baseURL + '/weixin/project/index.php?m=Home&c=Position&a=rec_position',
        method: 'POST',
        changeOrigin: true,
        data: params
    }).then((data) => {
     
      this.loading.close()
      if(!data.data){
        this.$message('没有数据')
        return
      }
        if (!data.data.length) {
            this.$message('暂时没有轨迹数据')
            this.checkTime = false
        } else {
          
            let that = this
             let lineArr=data.data.map((e)=>[e.longitude-0,e.latitude-0])

            //  this.guijiHistory(lineArr) //暂时去掉轨迹线
             this.checkTime = false //...事件选择器隐藏
           
            let lineArrAndBaoJing = data.data.filter(e => e.state)
              let markerArr = lineArrAndBaoJing.map((e, i) => {
                return new AMap.Marker({
                  content: `<div class="jiupian" >
                              <div class="alarm_type ${e.astate==="1" ?'litao':null} ${e.astate==="2" ?'rutao':null} ${e.astate==="3" ?'fanwei':null}"></div>
                              <div class="j-icon ${e.state==2?'wx':''} ${e.state==3?'jz':''} ${e.state==4?'wf':''}"></div>
                              <div class="j-cover"></div>
                            </div>`,
                  position: [e.longitude - 0, e.latitude - 0],
                  title: `定位类型：${e.sname}\n定位时间：${e.time}`,
                  type:e.sname,
                  time:e.time,
                  offset: new AMap.Pixel(-17, -40)
                })
              })
              this.map.add(markerArr)
              this.map.setFitView()  
              let map = this.map
      
              markerArr.forEach(item => {
                AMap.event.addListener(item, 'click', function (ev) {
                  creatInfoBox(item)     
                })
              })
      
              function creatInfoBox(item) {
                var title = `定位类型：<span style="font-size:11px;color:#F00;">${item[that.fuckName].type}</span>`,
                  content = [];
              content.push(`定位时间：${item[that.fuckName].time}`);
                content.push("<br/>");      
                var infoWindow = new AMap.InfoWindow({
                  isCustom: true, //使用自定义窗体
                  content: createInfoWindow(title, content.join("<br/>")),
                  offset: new AMap.Pixel(19, -40)
                });
      
                //构建自定义信息窗体
                function createInfoWindow(title, content) {
                  var info = document.createElement("div");
                  info.className = "custom-info input-card content-window-card";
      
                  //可以通过下面的方式修改自定义窗体的宽高
                  //info.style.width = "400px";
                  // 定义顶部标题
                  var top = document.createElement("div");
                  var titleD = document.createElement("div");
                  var closeX = document.createElement("img");
      
                  top.className = "info-top";
                  titleD.innerHTML = title;
                  closeX.src = "https://webapi.amap.com/images/close2.gif";
                  closeX.onclick = closeInfoWindow;
                  window.setTimeout(()=>{closeInfoWindow()},5000)
                  top.appendChild(titleD);
                  top.appendChild(closeX);
                  info.appendChild(top);
      
                  // 定义中部内容
                  var middle = document.createElement("div");
                  middle.className = "info-middle";
                  middle.style.backgroundColor = 'white';
                  middle.innerHTML = content;
                  info.appendChild(middle);
      
                  // 定义底部内容
                  var bottom = document.createElement("div");
                  bottom.className = "info-bottom";
                  bottom.style.position = 'relative';
                  bottom.style.top = '0px';
                  bottom.style.margin = '0 auto';
                  var sharp = document.createElement("img");
                  sharp.src = "https://webapi.amap.com/images/sharp.png";
                  bottom.appendChild(sharp);
                  info.appendChild(bottom);
                  return info;
                }
      
                //关闭信息窗体
                function closeInfoWindow() {
                  map.clearInfoWindow();
                }
      
      
                return infoWindow.open(map, item.getPosition());
      
              }





        }
    }).catch((error) => {
        console.log(error)
    })
}

export {
    getBujiupian
}