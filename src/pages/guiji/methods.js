//一些事件函数模块


function GetDistance(lng1, lat1, lng2, lat2) { //..计算两坐标点之间的距离单位千米
  var radLat1 = lat1 * Math.PI / 180.0;
  var radLat2 = lat2 * Math.PI / 180.0;
  var a = radLat1 - radLat2;
  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137; // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  return s;
}

function personMoveing() {
  let that = this
  clearInterval(this.moveTimer)

  this.moveTimer = setInterval(() => {
    console.log('请求最新位置了', this.moveingPersonList, '嗯', this.$refs.alarmSelect.value)

    that.getNewPosition(this.$refs.alarmSelect.value)
  }, 10000)
}

function getAllPersonByIMEI(IMEIstr) {
  var key = this.$store.state.key
  var objs = {
    "IMEI": IMEIstr,
    "ps": 9999
  };
  var sign = this.$methods.mkSign(objs, key);
  var token = this.$gscookie.getCookie('gun')
  var params = new URLSearchParams();
  params.append('IMEI', objs.IMEI);
  params.append('ps', objs.ps);
  params.append('sign', sign);
  params.append('token', token)
  this.$axios({
    url: this.$store.state.baseURL + '/weixin/project/index.php?m=home&c=position&a=positions',
    method: 'POST',
    changeOrigin: true,
    data: params
  }).then((data) => {
    console.log('所有人的位置暂未完成', data)



  }).catch((error) => {
    console.log(error)
  })
}

function getIMEI(IMEIArr) { //..........通过IMEI获取经纬度,参数为数组
  let IMEIStr = IMEIArr.join(',')
  var key = this.$store.state.key
  var objs = {
    "IMEI": IMEIStr,
    "ps": 9999,
    "lid": this.value - 0
  };
  var sign = this.$methods.mkSign(objs, key);
  var token = this.$gscookie.getCookie('gun')
  var params = new URLSearchParams();
  params.append('IMEI', objs.IMEI);
  params.append('ps', objs.ps);
  params.append('sign', sign);
  params.append('token', token)
  params.append('lid', objs.lid)
  this.$axios({
    url: this.$store.state.baseURL + '/weixin/project/index.php?m=home&c=position&a=positions',
    method: 'POST',
    changeOrigin: true,
    data: params
  }).then((data) => {
    this.loading.close()
    let that = this
    this.hasPerson = true;
    this.isChange = false //避免多次点击
    let a1 = data.data.data.list.map(e => {
      return [e.longitude * 1, e.latitude * 1]
    })
    let dataList = data.data.data.list
    let newArr = this.checkedPersonArr
    newArr.unshift(this.selectedPerson)
    let aaa = dataList.map(item => {
      let o = newArr.find(e => e.IMEI == item.IMEI)
      return Object.assign(item, o)
    })

    this.moveingPersonList = newArr //当前要做动画运动的人

    var arrN = [];
    var d = data.data.data.list;
    for (var i = 0; i < d.length; i++) {
      var mycars = new Array(2)
      mycars['ponint'] = [d[i]['longitude'] * 1, d[i]['latitude'] * 1];
      mycars['IMEI'] = d[i]['IMEI'];
      arrN[i] = mycars;
    }

    let bbb = aaa.map(item => {
      let o = arrN.find(e => e.IMEI == item.IMEI)
      return Object.assign(item, o)
    })
    let warningtype=JSON.parse(sessionStorage.getItem('everBodyWarningType'))
    // console.log(warningtype)
    let activeImg = require("@/assets/img/head-icon.png");//引入默认图片
    let markerArr = bbb.map((e, i) => {
      return new AMap.Marker({
        content: `<div class="marker-route">
                    <div class="cover"></div>
                    <div class="img_wrap">
                      <img src="${this.header[this.headName] || e.policeuser.icon || activeImg}" />
                    </div>
                    <div class="set-type ${e.IMEI}"></div>
                  </div>`,
        position: e.ponint,
        jigou: e.mechanism_name,
        gtype: e.gtype,
        title: e.policeuser_name,
        src: e.policeuser.icon || activeImg,
        IMEI: e.IMEI,
        time: e.created,
        heart: e.heart,
        ptype: e.ptype,
        positions: e.gun_code,
        offset: new AMap.Pixel(-16, -39),
        policeuser_id: e.policeuser_id
      })
    })
    markerArr.forEach(item => {
      AMap.event.addListener(item, 'click', function (ev) {

        // $('#settype').addClass('litao-s')
        that.creatInfoBox(item)

      })
    })


    this.map.add(markerArr)
    this.map.setFitView([...markerArr])
    this.pointMark = a1
    this.noClick = false
    //..........................................................................................................

    this.markerArr = markerArr
    //..........................................................................................................

    this.personMoveing() //.执行动画


  }).catch((error) => {
    console.log(error)
  })

}

function getJiGouStr() {
  var key = this.$store.state.key
  var objs = {
    p: 1,
    ps: 10,
    mechanism_id: 1
  };
  var sign = this.$methods.mkSign(objs, key);
  var token = this.$gscookie.getCookie('gun')
  var params = new URLSearchParams();
  params.append('p', objs.p);
  params.append('ps', objs.ps);
  params.append('mechanism_id', objs.mechanism_id);
  params.append('sign', sign);
  params.append('token', token)
  this.$axios({
    url: this.$store.state.baseURL + '/weixin/project/index.php?m=home&c=mechanism&a=mechanisms_tree',
    method: 'POST',
    changeOrigin: true,
    data: params
  }).then((data) => {

    function creatTreeStr(obj) {
      let str = ``;
      if (obj.length > 0) {
        for (let i = 0; i < obj.length; i++) {
          // let levelstr = levelStr(obj[i].level);

          str += `<option value="${obj[i].id}" >${"&nbsp;&nbsp;".repeat(obj[i].index)}${obj[i].mechanism_name}</option>`;
          if (obj[i]['child'].length > 0) {
            str += creatTreeStr(obj[i].child);
          }
        };
      }

      return str;
    }

    function levelStr(l) {
      var str = '';
      for (var i = 0; i < l; i++) {
        str += "&nbsp;&nbsp;";
      };
      return str;
    }
    // console.log(data.data.data.list)
    this.jigouOptionStr = `<option value="" disabled selected>请选择搜索的机构</option>` + creatTreeStr(data.data.data.list) //....存store以备轨迹用

  }).catch((error) => {
    console.log(error)
  })
}

function searchHistory(IMEI, stime, etime, ps = 999) { //......获取历史轨迹函数
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
    "ps": ps
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
    url: this.$store.state.baseURL + '/weixin/project/index.php?m=home&c=position&a=position',
    method: 'POST',
    changeOrigin: true,
    data: params
  }).then((data) => {
    let that=this
    if (data.data.code == '200') {
      this.loading.close()
      this.oldOrNew = 'old'
      this.checkTime = false
      if (!data.data.data.list.length) {
        this.$message('暂时没有轨迹数据')
        this.checkTime = false

      } else {
        let that = this
        let lineArrAndBaoJing = data.data.data.list.filter(e => e.alarm)
        let lineArr = data.data.data.list.map((e) => [e.longitude - 0, e.latitude - 0])
        let pathParam = data.data.data.list.map((item, index) => {
          return {
            "x": item.longitude - 0,
            "y": item.latitude - 0,
            "sp": 10,
            "ag": 0,
            "tm": 180
          }

        })


        let graspRoad;
        if (!graspRoad) {
          graspRoad = new AMap.GraspRoad()
        }

        graspRoad.driving(pathParam, function (error, result) {
          if (!error) {
            var path2 = [];
            var newPath = result.data.points;
            for (var i = 0; i < newPath.length; i += 1) {
              path2.push([newPath[i].x, newPath[i].y])
            }
            var newLine = new AMap.Polyline({
              path: path2,
              strokeWeight: 8,
              strokeOpacity: 0.8,
              strokeColor: '#147de9',
              // strokeColor:'#b9ddfb',
              showDir: true
            })
            that.map.add(newLine)
            that.map.setFitView()
          } else {
            console.log(error)
            that.$message({
              type:"error",
              message:"引擎返回数据异常！"
            })
          }
        })


        return

        // ...................原方法
        // this.guijiHistory(lineArr)
        // ..................原方法


        var polyline = new AMap.Polyline({
          path: lineArr,          //设置线覆盖物路径
          strokeColor: "#3366FF", //线颜色
          strokeWeight: 5,        //线宽
          strokeStyle: "solid",   //线样式
        });
        this.map.add(polyline);
        console.log('133', lineArr)
        this.map.setCenter([lineArr[0].M, lineArr[0].O])//....设置地图中心点
        this.map.setZoom(16)

        this.map.setFitView([lineArr])
        this.checkTime = false //...事件选择器隐藏

        let markerArr = lineArrAndBaoJing.map((e, i) => {
          return new AMap.Marker({
            content: `<div class="baojing ${e.alarm.alarm_type == 1 ? 'liqiang' : 'litao'}" ><span></span></div>`,
            position: [e.longitude - 0, e.latitude - 0],
            title: e.alarm.alarm_typename,
            created: e.created,
            src: e.alarm.icon,
            offset: new AMap.Pixel(-13, -30)
          })
        })
        // this.map.setCenter([a1[0][0],a1[0][1]])
        // this.map.setZoom(16)

        this.map.add(markerArr)

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
    }

  }).catch((error) => {
    console.log(error)
  })
}

function creatInfoBox(item, ...res) {
  setTimeout(() => { //如果没有手动关闭，20秒之后自动关闭
    closeInfoWindow()
  }, 15000)

  function changeTime() {
    var date = new Date(); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + "-";
    var M =
      (date.getMonth() + 1 < 10 ?
        "0" + (date.getMonth() + 1) :
        date.getMonth() + 1) + "-";
    var D =
      (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
    var h =
      (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
    var m =
      (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
      ":";
    var s =
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
  }

  let that = this
  let map = this.map
  var title = `警员姓名：<span style="font-size:11px;color:#F00;">${item.Ge.title}</span>`,
    content = [];
  content.push(`<img alt="头像" src='${item.Ge.src}' style="width:1rem;">`)
  content.push(`所属机构：${item.Ge.jigou}<br/>枪支类型：${item.Ge.gtype}`); 
  // content.push(`最后定位时间:${changeTime()}`);
  content.push(`枪支编号:${item.Ge.positions}`);
  // content.push(`<span class="toxiangqing" >详细信息</span>`);
  content.push(`是否在线:${item.Ge.heart == 1 ? "在线" : "不在线"}`);
  content.push(`定位类型:${item.Ge.ptype}`);
  content.push(`枪瞄编号:${item.Ge.IMEI}`);
  content.push(`最后定位时间:${item.Ge.time}`);
  var infoWindow = new AMap.InfoWindow({
    isCustom: true, //使用自定义窗体
    content: createInfoWindow(title, content.join("<br/>")),
    offset: new AMap.Pixel(16, -80)
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
    var toxiangqing = document.createElement("span");
    toxiangqing.className = "toxiangqing"
    // toxiangqing.onclick=function (){
    //   alert(999)
    // }
    document.addEventListener('click', function (ev) {
      if (ev.target.className == 'toxiangqing') {

        that.$router.push({
          name: "ChiQiang",
          params: {
            item
          }
        })
      }

    })
    top.className = "info-top";
    titleD.innerHTML = title;
    closeX.src = "https://webapi.amap.com/images/close2.gif";
    closeX.onclick = closeInfoWindow;

    top.appendChild(titleD);
    top.appendChild(closeX);
    info.appendChild(top);
    info.style.minWidth = '300px'
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

function getPersonAndGunStr(id) {
  var key = this.$store.state.key
  var objs = {
    p: 1,
    ps: 10,
    mechanism_id: id
  };
  var sign = this.$methods.mkSign(objs, key);
  var token = this.$gscookie.getCookie('gun')
  var params = new URLSearchParams();
  params.append('p', objs.p);
  params.append('ps', objs.ps);
  params.append('mechanism_id', objs.mechanism_id);
  params.append('sign', sign);
  params.append('token', token)
  this.$axios({
    url: this.$store.state.baseURL + '/weixin/project/index.php?m=home&c=position&a=guns',
    method: 'POST',
    changeOrigin: true,
    data: params
  }).then((data) => {
    if (data.data.code == 200) {
       this.startTime=data.data.start+'T'+"01:00"
      this.endTime =data.data.start+'T'+"23:00"
      if (data.data.arr) {
        this.allMechanismData = data.data.arr
        let strArr = data.data.arr.map(item => {
          return `<option value="${item.id}|${item.ip_id}" >${item.mechanism_name}</option>`
        })
        strArr.unshift(`<option value="" disabled selected >请选择</option>`)
        this.allMechanism = strArr.join()
        
      } else {
        console.log('无跨机构数据')
      }
      this.loading.close()
      this.allPersonIEMIStr = data.data.IMEIs
      let allPersonList = data.data.data.list.map(e => {
        return {
          ...e,
          checked: false
        }
      })
      if (!data.data.data.list.length) {
        this.gunAndJingyuanOptionStr = ''
        this.activeIMEI = ''
        this.$message({
          type: "warning",
          message: '该机构未建立绑定关系',
          duration:5000
        })
        return
      }
      
      this.activeIMEI = data.data.data.list.length ? data.data.data.list[0].IMEI : ''
      this.gunAndJingyuanOptionStr = `
            <option value="" disabled selected >请选择人员和枪支</option>

            ` + optionStr(data.data.data.list)
      this.noCheckedList = allPersonList

    }

    function allOptionStr(arr) {

    }

    function optionStr(arr) {
      let img = require('@/assets/img/head-icon.png')
      let str = ''
      if (!arr.length) {
        return str = `<option >暂时没有数据</option>`
      }
      arr.forEach(e => {
        if (!e.policeuser.img) e.policeuser.img = img;
        str += `<option value="${e.IMEI}|${e.policeuser.img}"  >枪支编号：${e.gun_code} , 所属警员：${e.policeuser_name ? e.policeuser_name : '暂未绑定人员'},枪瞄编号：${e.IMEI}</option>`
      })
      return str
    }
  }).catch((error) => {
    console.log(error)
  })

}

function mapInit() {
  // var marker = new AMap.Marker({//....地图设置标记点
  //     position:this.pointMark[0]//位置
  // })

  let markerArr = this.pointMark.map((e, i) => {
    return new AMap.Marker({
      position: e
    })
  })

  var map = new AMap.Map('container', {
    center: [116.397428, 39.90923],
    resizeEnable: true,
    zoom: 9
  })
  AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {
    map.addControl(new AMap.ToolBar())
    map.addControl(new AMap.Scale())
  })
  // map.add(marker);//添加到地图
  map.add(markerArr)
  var lineArr = this.lineArr
  var polyline = new AMap.Polyline({
    path: lineArr, //设置线覆盖物路径
    strokeColor: "#3366FF", //线颜色
    strokeWeight: 5, //线宽
    strokeStyle: "solid", //线样式
  });
  map.add(polyline);
  let a = document.querySelector('.amap-toolbar')
  a.style.cssText = "position:absolute;right:0.1rem;top:0.1rem"
}

function initPage(PathSimplifier, $, heads, paths) {

  var emptyLineStyle = {
    lineWidth: 0,
    fillStyle: null,
    strokeStyle: null,
    borderStyle: null
  };

  var pathSimplifierIns = new PathSimplifier({
    zIndex: 100,
    //autoSetFitView:false,
    map: this.map, //所属的地图实例
    autoSetFitView: false,

    getPath: function (pathData, pathIndex) {
      //返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
      return pathData.path;
    },
    getHoverTitle: function (pathData, pathIndex, pointIndex) {
      //返回鼠标悬停时显示的信息
      if (pointIndex >= 0) {
        //鼠标悬停在某个轨迹节点上
        return pathData.name + '，点:' + pointIndex + '/' + pathData.path.length;
      }
      //鼠标悬停在节点之间的连线上
      // return pathData.name + '，点数量' + pathData.path.length;
    },
    renderOptions: {
      //轨迹线的样式
      eventSupport: false,
      eventSupportInvisible: false,
      pathLineStyle: {
        strokeStyle: 'white',
        lineWidth: 0,
        borderWidth: 0,
        dirArrowStyle: false,
      },
      startPointStyle: {
        radius: 0
      },
      endPointStyle: {
        radius: 0
      }
    }
  });
  window.PathSimplifier = PathSimplifier;
  window.pathSimplifierIns = pathSimplifierIns;

  var data = [];
  for (var i = 0; i < paths.length; i++) {
    var obj = {
      name: 'name',
      path: PathSimplifier.getGeodesicPath(paths[i][0], paths[i][1], 10)
    }
    data.push(obj);
  };
  // pathSimplifierIns.setData([{
  //     name: '只有两个点拆分成100份',
  //     path: PathSimplifier.getGeodesicPath(paths[i][0],paths[i][1], 10)
  //  }]);
  pathSimplifierIns.setData(data);

  //initRoutesContainer(d);

  function onload() {
    pathSimplifierIns.renderLater();
  }

  function onerror(e) {
    alert('图片加载失败！');
  }

  var pathNavigatorStyles = [];
  for (var i = 0; i < heads.length; i++) {
    var obj = {
      width: 50,
      height: 60,
      autoRotate: false,
      content: PathSimplifier.Render.Canvas.getImageContent(heads[i], onload, onerror),
      pathLinePassedStyle: {
        strokeStyle: 'white',
        lineWidth: 0,
        borderWidth: 0
      }
    }
    pathNavigatorStyles.push(obj);
  }



  var idx = 0;

  var bl = [];
  for (var i = 0; i < heads.length; i++) {
    bl[i] = {};
    bl[i].fn = pathSimplifierIns.createPathNavigator(i, {
      loop: false,
      speed: 5,
      pathNavigatorStyle: this.extend({}, pathNavigatorStyles[i])
    });
    bl[i].fn.start();
  };



}

function extend(dst) {
  if (!dst) {
    dst = {};
  }

  var slist = Array.prototype.slice.call(arguments, 1);

  for (var i = 0, len = slist.length; i < len; i++) {
    var source = slist[i];

    if (!source) {
      continue;
    }

    for (var prop in source) {
      if (source.hasOwnProperty(prop)) {
        dst[prop] = source[prop];
      }
    }
  }
  return dst;
}

function setWarningRange() {
  this.$confirm('此操作将开始设置报警区域, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    this.setWarning = true
  }).catch(() => {
    this.$message({
      type: 'info',
      message: '已取消设置'
    });
  });

}

function setMarker(ev) {

  let map = this.map
  var marker = new AMap.Marker({
    position: new AMap.LngLat(ev.lnglat.Q, ev.lnglat.P)

  });

  this.markerArr.push(marker)

  map.add(marker)

}

function startSetArea() {
  if (!this.clickTrue) return;
  this.clickTrue = false
  let map = this.map;
  this.markerArr.length = 0
  map.on('click', this.setMarker)

}

function confirmSetArea() {
  this.clickTrue = true
  let map = this.map
  let that = this
  let arr = this.markerArr.map(e => e.Ge.position)

  //.....................下面式设置带背景色区域，暂时不会清除这个区域
  var polygon = new AMap.Polygon({
    path: arr,
    fillColor: 'rgba(255,0,0,0.3)', // 多边形填充颜色
    borderWeight: 2, // 线条宽度，默认为 1
    strokeColor: 'red', // 线条颜色
    strokeStyle: 'dashed'
  });

  this.polygon = polygon
  map.add(polygon)
  this.markerArr.forEach(e => map.remove(e))

  map.off('click', this.setMarker)
  //............................................设置区域报警数据请求

  this.setAreaTime = true

  // let newArr1=[...this.checkedPersonArr,this.selectedPerson]
  // let gun_ids11=newArr1.map(e=>e.gun_id)
  // let pointsArr11=this.markerArr.map(e=>`${e.G.position.M}|${e.G.position.O}`)
  // let policeuser_id=this.selectedPerson.policeuser_id
  // console.log(gun_ids11,pointsArr11.join(),policeuser_id)
  // this.shezhiquyu(gun_ids11,pointsArr11,policeuser_id,12345432,23454323)
  // this.markerArr.length=0



  this.setWarning = false
}

function resetArea() {
  let map = this.map
  this.clickTrue = true
  // console.log(this.markerArr)
  map.remove(this.polygon)
  this.polygon = null

}

function shezhiquyu(gun_ids, ip_ids, pointsArr, policeuser_id, stime, etime, text, IMEIStr) {

  let date = new Date()
  let Y = date.getFullYear()
  let M = date.getMonth() + 1
  let D = date.getDate() + 1

  function toTwo(s) {
    return s < 10 ? '0' + s : s
  }
  let dateStr = `${Y}-${toTwo(M)}-${toTwo(D)}`
  let idsStr = gun_ids.join(',')
  let pointsStr = pointsArr.join(',')
  let newStime = stime.length < 6 ? dateStr + ' ' + stime : stime;
  let newEtime = etime.length < 6 ? dateStr + ' ' + etime : etime;
  let typeNumber = etime.length < 6 ? 2 : 1;
  var objs = {
    "gun_ids": idsStr,
    "ip_ids": ip_ids,
    "points": pointsStr,
    "policeuser_id": policeuser_id,
    "stime": newStime,
    "etime": newEtime,
    "type": typeNumber,
    "mechanism_id": this.selectedPerson.mechanism_id,
    "area_alarm_name": text,
    "IMEI": IMEIStr
  };

  var key = this.$store.state.key;
  var sign = this.$methods.mkSign(objs, key);
  var token = this.$gscookie.getCookie('gun')
  var params = new URLSearchParams();
  params.append('gun_ids', objs.gun_ids);
  params.append('ip_ids', objs.ip_ids);
  params.append('points', objs.points);
  params.append('policeuser_id', objs.policeuser_id);
  params.append('stime', objs.stime);
  params.append('etime', objs.etime);
  params.append('type', objs.type);
  params.append('mechanism_id', objs.mechanism_id);
  params.append('area_alarm_name', objs.area_alarm_name);
  params.append('IMEI', objs.IMEI);
  params.append('sign', sign);
  params.append('token', token)

  this.$axios({
    url: this.$store.state.baseURL + '/weixin/project/index.php?m=home&c=alarm&a=rewrite',
    method: 'POST',
    changeOrigin: true,
    data: params
  }).then((data) => {

    if (data.data.code == 200) {
      this.activeAreaAlarmId = data.data.data.area_alarm_id
      this.setAreaTime = false
      this.polygon.hide() //...先把原来红色区域删除
      this.showOneAlarmArea(this.markerArr, this.activeAreaAlarmId)

      this.markerArr.length = 0
      this.getAlarmList()
      // this.$refs.alarmSelect.value=data.data.data.area_alarm_id
      // this.alarmId=data.data.data.area_alarm_id

      setTimeout(() => {
        // this.$router.go(0)

        this.showOne(null,this.allAlarmAreaList[this.allAlarmAreaList.length-1].area_alarm_id)
      }, 2000)
      
    }

  }).catch((error) => {
    console.log(error)
  })

}

function getAlarmList() { //.....获取报警区域列表
  var objs = {};
  var key = this.$store.state.key;
  var sign = this.$methods.mkSign(objs, key);
  var token = this.$gscookie.getCookie('gun')
  var params = new URLSearchParams();
  params.append('sign', sign);
  params.append('token', token)
  this.$axios({
    url: this.$store.state.baseURL + '/weixin/project/index.php?m=home&c=alarm&a=area_alarms',
    method: 'POST',
    changeOrigin: true,
    data: params
  }).then((data) => {
    if (data.data.code == 200) {
      this.options = data.data.ltype

      this.optionsStr = data.data.ltype.map(item => `<option value=${item.id}>${item.loca_name}</option>`)
      this.value = data.data.ltype[0].id
      this.allAlarmAreaList = data.data.data

      let s1 = `<option value="" disabled selected >请选择</option>`
      let str = this.allAlarmAreaList.map(item => {
        return `<option value="${item.area_alarm_id}">${item.area_alarm_name}</option>`
      })
      this.allAlarmSelectStr = s1 + str
    }
  }).catch((error) => {
    console.log(error)
  })

}

function getOneAlarmArea(id) { //.....获取一个报警区域
  var objs = {
    "area_alarm_id": id
  };
  var key = this.$store.state.key;
  var sign = this.$methods.mkSign(objs, key);
  var token = this.$gscookie.getCookie('gun')
  var params = new URLSearchParams();
  params.append('area_alarm_id', objs.area_alarm_id);
  params.append('sign', sign);
  params.append('token', token)
  this.$axios({
    url: this.$store.state.baseURL + '/weixin/project/index.php?m=home&c=alarm&a=area_alarm',
    method: 'POST',
    changeOrigin: true,
    data: params
  }).then((data) => {
    // console.log(data)
    if (data.data.code == 200) {
      // console.log(data)
      let state = data.data.data.list.state
      let id = this.$refs.alarmSelect.value
      this.shuaXinMap()
      this.showOneAreaAllMarker(data.data.data.list)
      this.showOneAlarmPolygon(data.data.data.list.points, id, state)
      this.oneAlarmPersonList = data.data.data.list.child
      this.moveingPersonList = this.oneAlarmPersonList
      this.oneAlarmMessage = data.data.data.arr
      // console.log(data.data.data.arr)
      this.personMoveing()
    }else{
      // this.$message({
      //   type:"warning",
      //   message:data.data.msg,
      //   duration:5000
      // })
      let that=this
      this.$alert(data.data.msg+'是否要删除该区域？', '系统错误', {
        confirmButtonText: '确定',
        callback: action => {
          if(action=='confirm'){
            that.del()
          }
        }
      });
    }
    this.loading.close()
  }).catch((error) => {
    console.log(error)
  })

}

function showOneAlarmPolygon(arr, id, state = 0) {
  clearInterval(this.shezhiyanse)
  let fillColor = state == 1 ? 'rgba(195,13,35,0.4)' : 'rgba(1,221,156,0.4)';
  console.log('初始的颜色', fillColor)
  let that = this
  let map = this.map
  let polygon = new AMap.Polygon({
    path: arr,
    fillColor: fillColor, // 多边形填充颜色
    borderWeight: 2, // 线条宽度，默认为 1
    strokeColor: 'rgb(66,92,248)', // 线条颜色
    area_alarm_id: id
  });


  polygon.on('rightclick', function (ev) {
    var contextMenu = new AMap.ContextMenu();
    contextMenu.addItem("删除该区域", function () {
      polygon.hide()
      that.delOneAlarmArea(ev.target.Ge.area_alarm_id)
      that.shuaXinMap()
      that.filterMessage.uname = ''
    }, 0);
    // contextMenu.addItem("显示该区域人员", function () {
    //    console.log('显示该区域人员',ev.target.G.area_alarm_id)
    //    that.getOneAlarmArea(ev.target.G.area_alarm_id)
    // }, 1);
    contextMenu.open(map, ev.lnglat);

  })

  this.polygon = polygon //存储这个报警区域
  map.add(polygon)
  this.map.setFitView(polygon)


}

function showOneAreaAllMarker(data) { //显示一个区域的人员标记
  let that = this
  let noneImg = require('@/assets/img/head-icon.png')
  this.filterMessage.uname = data.policeuser_name
  this.filterMessage.bianhao = data.police_number
  this.filterMessage.newOrOld = 'old'
  this.filterMessage.imgSrc = data.icon
  let markerArr = data.child.map((e, i) => {
    let imgurl = e.img ? `<img src="${e.img}" />` : `<img src="${noneImg}" />`;
    let title=e.policeuser_name||""
    let src=e.icon||noneImg;
    let jigou=(e.mechanism)?(e.mechanism.mechanism_name):""
    let time=e.created||"";
    return new AMap.Marker({
      content: `<div class="marker-route" >
                <div class="cover" ></div>
                <div class="img_wrap">
                  ${imgurl}
                </div>
                <div class="set-type ${e.IMEI}"></div>
              </div>`,
      position: [e.position.longitude, e.position.latitude],
      title:title,
      src:src,
      jigou: jigou,
      gtype: e.gtype,
      time:time,
      IMEI: e.IMEI,
      heart: e.heart,
      ptype: e.ptype,
      positions: e.gun_code,
      offset: new AMap.Pixel(-16, -43)
    })
  })
  this.markerArr = markerArr //...存储当前状态下显示的标记点
  markerArr.forEach(item => {
    AMap.event.addListener(item, 'click', function (ev) {
      // infoWindow.open(map, item.getPosition());
      that.creatInfoBox(item)

    })
  })





  this.map.add(markerArr)
  // this.map.setFitView([ ...markerArr ])

}

function delOneAlarmArea(id) { //.....删除一个报警区域
  var objs = {
    "area_alarm_id": id
  };
  var key = this.$store.state.key;
  var sign = this.$methods.mkSign(objs, key);
  var token = this.$gscookie.getCookie('gun')
  var params = new URLSearchParams();
  params.append('area_alarm_id', objs.area_alarm_id);
  params.append('sign', sign);
  params.append('token', token)
  this.$axios({
    url: this.$store.state.baseURL + '/weixin/project/index.php?m=home&c=alarm&a=del',
    method: 'POST',
    changeOrigin: true,
    data: params
  }).then((data) => {

    if (data.data.code == 200) {
      this.$router.go(0) //刷新当前页面
      this.$message('删除成功')
      this.getAlarmList()
    }
  }).catch((error) => {
    console.log(error)
  })

}

function getNewPosition(id) {
  let IMEIstr = this.moveingPersonList.map(e => e.IMEI).join()
  var objs = {
    "IMEI": IMEIstr,
    "ps": 99,
    "area_id": id || '',
    "lid": this.value
  };
  var key = this.$store.state.key;
  var sign = this.$methods.mkSign(objs, key);
  var token = this.$gscookie.getCookie('gun')
  var params = new URLSearchParams();
  params.append('IMEI', objs.IMEI);
  params.append('ps', objs.ps);
  params.append('area_id', objs.area_id);
  params.append('sign', sign);
  params.append('token', token)
  params.append('lid', objs.lid)
  this.$axios({
    url: this.$store.state.baseURL + '/weixin/project/index.php?m=home&c=position&a=positions',
    method: 'POST',
    changeOrigin: true,
    data: params
  }).then((data) => {
    if (data.data.code == 200) {
      // ...匀速运动有问题
      this.unifromSpeedMoveing(data.data.data.list)
    }
  }).catch((error) => {
    console.log(error)
  })
}

function unifromSpeedMoveing(newPositionArr) { //匀速运动
  // if (this.setWarning) {
  //   console.log(this.setWarning)
  //   return
  // }
  let that = this
  this.oldPositionArr = this.markerArr.map(item => {
    return {
      "IMEI": item.Ge.IMEI,
      "astate":"",
      "lng": item.Ge.position.lng - 0,
      "lat": item.Ge.position.lat - 0
    }
  })
// astate    1离套   2入套   3范围
  let newA = newPositionArr.map(item => {
    return {
      "IMEI": item.IMEI,
      "astate":item.astate,
      "lng": item.longitude - 0,
      "lat": item.latitude - 0
    }
  })

  //给返回的数据排序
  let paixuArr = this.oldPositionArr.map((item) => {
    return newA.find(e => e.IMEI == item.IMEI)
  })


  let juliArr = newA.map((item, index) => { //..计算两坐标点之间的距离单位千米

    return GetDistance(item.lng, item.lat, this.oldPositionArr[index].lng, this.oldPositionArr[index].lat)
  })

  // let speedArr = juliArr.map(e => e * 20) // 最新速度数组3分钟走完的速度
  // let speedArr = juliArr.map(e => e * 30) // 最新速度数组2分钟走完的速度
  // let speedArr = juliArr.map(e => 3) //临时
  let speedArr = juliArr.map(e => e * 360) //  10秒走完的速度
  console.log('距离', juliArr, '速度', speedArr)
  let targetPosition = paixuArr.map(item => { //...新的目标点数组
    return [item.lng, item.lat]
  })

  
  //标记点所有动画停止
  // 王瑞军  900019300102007
  newA.forEach((item,index)=>{
    if(item.astate==="1"){
      $(`.${item.IMEI}`).addClass('litao-s')
    }else if(item.astate==="2"){
      $(`.${item.IMEI}`).addClass('rutao-s')
    }else if(item.astate==="3"){
      $(`.${item.IMEI}`).addClass('fanwei-s')
    }else{
      $(`.${item.IMEI}`).removeClass('fanwei-s rutao-s litao-s')
    }
  })

  // console.log($('.900019300102007').addClass('litao-s'))
  targetPosition.forEach((item, index) => {
    let speed = speedArr[index] ? speedArr[index] : 10
    this.markerArr[index].moveTo(item, speed)
  })

  this.oldPositionArr = newA

}

function getAllJiGouName(mechanism_id, ip_id) {


  var objs = {
    "mechanism_id": mechanism_id,
    "ip_id": ip_id
  };
  // console.log(objs)
  var key = this.$store.state.key;
  var sign = this.$methods.mkSign(objs, key);
  var token = this.$gscookie.getCookie('gun')
  var params = new URLSearchParams();
  params.append('sign', sign);
  params.append('token', token);
  params.append('mechanism_id', objs.mechanism_id);
  params.append('ip_id', objs.ip_id);
  this.$axios({
    url: this.$store.state.baseURL + '/weixin/project/index.php?m=home&c=position&a=person',
    method: 'POST',
    changeOrigin: true,
    data: params
  }).then((data) => {
    if (data.data.code == 200) {
      console.log(data.data.data.list)
      this.allMechanismPersonList.push(data.data.data.list)
    }
  }).catch((error) => {
    console.log(error)
  })
}










export {
  GetDistance, //..计算两坐标点之间的距离单位千米
  personMoveing, //..做动画
  getIMEI,
  getAllPersonByIMEI,
  getJiGouStr,
  searchHistory,
  creatInfoBox,
  getPersonAndGunStr,
  // mapInit,
  initPage,
  extend,
  setWarningRange,
  setMarker,
  startSetArea,
  confirmSetArea,
  resetArea,
  shezhiquyu,
  getAlarmList,
  getOneAlarmArea,
  delOneAlarmArea,
  showOneAreaAllMarker,
  showOneAlarmPolygon,
  getNewPosition,
  unifromSpeedMoveing,
  getAllJiGouName
}
