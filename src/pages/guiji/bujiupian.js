function getBujiupian(IMEI,stime,etime){
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
       
        if (!data.data.length) {
            this.$message('暂时没有轨迹数据')
            this.checkTime = false
        } else {
            let that = this
             let lineArr=data.data.map((e)=>[e.longitude-0,e.latitude-0])

             this.guijiHistory(lineArr)
             this.checkTime = false //...事件选择器隐藏
            /*
             //下面的方法暂时不用
            var polyline = new AMap.Polyline({
                path: lineArr,          //设置线覆盖物路径
                strokeColor: "#3366FF", //线颜色
                strokeWeight: 5,        //线宽
                strokeStyle: "solid",   //线样式
              });
              this.map.add(polyline);
// return
              this.map.setCenter([lineArr[0].Q, lineArr[0].P])//....设置地图中心点
              this.map.setZoom(16)
            //   this.map.setFitView([lineArr])
              this.checkTime = false //...事件选择器隐藏
              */
 //  console.log(data.data)
            let lineArrAndBaoJing = data.data.filter(e => e.state)
            console.log('报警点',lineArrAndBaoJing)
// return
              let markerArr = lineArrAndBaoJing.map((e, i) => {
                return new AMap.Marker({
                  content: `<div class="jiupian" >
                              <div class="j-icon ${e.state==2?'wx':''} ${e.state==3?'jz':''} ${e.state==4?'wf':''}"></div>
                              <div class="j-cover"></div>
                            </div>`,
                  position: [e.longitude - 0, e.latitude - 0],
                  title: e.sname,
                  offset: new AMap.Pixel(-17, -40)
                })
              })
      
              this.map.add(markerArr)
 return     
              let map = this.map
      
              markerArr.forEach(item => {
                AMap.event.addListener(item, 'click', function (ev) {
                  // infoWindow.open(map, item.getPosition());
                  creatInfoBox(item, item.G.created)
      
                })
              })
      
              function creatInfoBox(item, timer) {
                let t = changeTime(timer)
      
                function changeTime(timestamp) {
                  var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
                  var Y = date.getFullYear() + '-';
                  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                  var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
                  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
                  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
                  var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
                  return Y + M + D + h + m + s;
                }
                var title = `报警类型：<span style="font-size:11px;color:#F00;">${tit}报警</span>`,
                  content = [];
                content.push(`<div class="tou_wrap"><img alt="null" src='${item.G.src}'></div>报警时间：${t}<br/>警员姓名：${that.filterMessage.uname}`);
                // content.push("电话：010-64733333");
                content.push("<br/>");
                // content.push(`<span class="to_xiangqing" data-d="${tit}">详细信息</span>`);
      
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