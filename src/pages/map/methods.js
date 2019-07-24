let movingTime = 10000 //.轮询请求最新位置的时间


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
    console.log('请求最新位置了', this.moveingPersonList.length)
    that.getNewPosition()
  }, movingTime)
}

function getIMEI(IMEIArr) { //..........通过IMEI获取经纬度,参数为数组
  let IMEIStr = IMEIArr.join(',')
  var key = this.$store.state.key
  var objs = {
    "IMEI": IMEIStr,
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
    url: 'http://s.tronl.cn/weixin/project/index.php?m=home&c=position&a=positions',
    method: 'POST',
    changeOrigin: true,
    data: params
  }).then((data) => {
    let that = this
    this.isChange = false //避免多次点击

    let newArr = this.checkedPersonArr
    newArr.unshift(this.selectedPerson)


    this.moveingPersonList = newArr //当前要做动画运动的人



    this.newShuaXinMap()
    let polyArr = data.data.data.list
    let arr = polyArr.map(item => {
      return [item.latitude * 1, item.longitude * 1]
    })

    let styleStr1 = `position:relative;width:2.5vw;height:3vw;
                    top:-3vw;left:-1.3vw;`
    let styleStr2 = `position:absolute;top:0;left:0;width:2.5vw;height:3vw;
                    box-sizing:border-box;border:2px solid red;
                    border-radius:1.2vw;`
    let styleStr3 = `position:absolute;width:2.5vw;height:3vw;border:1px solid red;
                    border-radius:1.2vw; overflow: hidden;`
    let styleStr4 = `position:absolute;bottom:-1vw;left:0.65vw;
                    width:0;height:0;border-width:0.5vw;border-style:solid;
                    border-color:red transparent transparent transparent;

                    `
    let styleImg = `width:2.5vw`
    let divIconArr = this.checkedPersonArr.map((item, index) => {
      return this.BM.divIcon({
        html: `<div class="icon_wrap" style="${styleStr1}">
                <div class="img_wrap" style="${styleStr3}">
                  <img src="${item.policeuser.icon}" style="${styleImg}"/>
                </div>
                <div class="round_cover" style="${styleStr2}"><i style="${styleStr4}"></i></div>
              </div>`
      })
    })

    let markerArr = arr.map((item, index) => {
      return this.BM.marker(item, {
        icon: divIconArr[index],
        title: this.checkedPersonArr[index].policeuser_name
      }).addTo(this.map)
    })

    // markerArr.forEach(item => {
    //   console.log(item)
    //   item.bindPopup(`<div>${item.options.title}</div>`)
    // })
    this.markerArr = markerArr
    //把当前显示的标记点存一下
    this.fitBoundsArr = arr
    //地图自适应显示

    this.map.fitBounds(arr)
    this.noClick = false
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
    url: 'http://s.tronl.cn/weixin/project/index.php?m=home&c=mechanism&a=mechanisms_tree',
    method: 'POST',
    changeOrigin: true,
    data: params
  }).then((data) => {
    function creatTreeStr(obj) {
      let str = ``;
      if (obj.length > 0) {
        for (let i = 0; i < obj.length; i++) {
          // let levelstr = levelStr(obj[i].level);
          str += `<option value="${obj[i].id}" > ${"&nbsp;&nbsp;".repeat(obj[i].index)}${obj[i].mechanism_name}</option>`;
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
    this.jigouOptionStr = `<option value="" disabled selected>请选择搜索的机构</option>` + creatTreeStr(data.data.data.list) //....存store以备轨迹用

  }).catch((error) => {
    console.log(error)
  })
}

function searchHistory(IMEI, stime, etime, ps = 999) { //......获取历史轨迹函数
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
    url: 'http://s.tronl.cn/weixin/project/index.php?m=home&c=position&a=position',
    method: 'POST',
    changeOrigin: true,
    data: params
  }).then((data) => {
    if (data.data.code == '200') {
      this.oldOrNew = 'old'
      this.checkTime = false
      // console.log('119',data.data.data.list)
      if (!data.data.data.list.length) {
        this.$message('暂时没有轨迹数据')
        this.checkTime = false
      } else {

        let that = this
        let lineArrAndBaoJing = data.data.data.list.filter(e => e.alarm)
        let lineArr = data.data.data.list.map((e) => {
          return {
            "lat": e.latitude - 0,
            "lng": e.longitude - 0
          }
        })

        this.guijiHistory(lineArr)



      }
    }

  }).catch((error) => {
    console.log(error)
  })
}

function creatInfoBox(tit = '李业锋', jingweidu, item, ...res) {
  // console.log('911',item)
  function toTxet(n) {
    if (n == 1) {
      return '92式'
    } else if (n == 2) {
      return '95式'
    } else if (n == 3) {
      return '77式'
    } else if (n == 4) {
      return '64式'
    } else if (n == 5) {
      return '92改'
    }
  }
  let that = this
  let map = this.map
  var title = `警员姓名：<span style="font-size:11px;color:#F00;">${tit}</span>`,
    content = [];
  content.push(`<img src='http://tpc.googlesyndication.com/simgad/5843493769827749134'>所属机构：${item.G.jigou}<br/>枪支类型：${toTxet(item.G.gtype)}`);
  // content.push("电话：010-64733333");
  content.push(`<span class="toxiangqing" >详细信息</span>`);

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
      return pathData.name + '，点数量' + pathData.path.length;
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
  this.setWarning = true
}
//  function setMarker(ev){
//   let map=this.map
//   var marker = new AMap.Marker({
//     position: new AMap.LngLat(ev.lnglat.M, ev.lnglat.O)

//   });

//   this.markerArr.push(marker)

//   map.add(marker)

// }
function startSetArea() {
  let map = this.map;
  let that = this
  this.markerArr.length = 0

  map.on('click', that.setDian)

}

function setDian(e) {
  let that = this
  let map = this.map
  let BM = this.BM
  this.polyLineArr.push([e.latlng.lat, e.latlng.lng])
  let polyLine = this.BM.polyline(that.polyLineArr, {
    color: 'blue'
  }).addTo(map);
  this.newXianArr.push(polyLine)
}

function confirmSetArea() {

  let map = this.map
  let that = this
  let BM = this.BM

  let polygon = BM.polygon(that.polyLineArr, {
    color: 'blue'
  }).addTo(map)
  map.off('click', that.setDian)


  this.polygon = polygon



  this.setAreaTime = true

  this.setWarning = false
}

function resetArea() {
  let map = this.map
  // console.log(this.markerArr)
  map.remove(this.polygon)
  this.polygon = null

}

function shezhiquyu(gun_ids, pointsArr, policeuser_id, stime, etime, text, IMEIStr) {

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
    url: 'http://s.tronl.cn/weixin/project/index.php?m=home&c=alarm&a=rewrite',
    method: 'POST',
    changeOrigin: true,
    data: params
  }).then((data) => {

    if (data.data.code == 200) {

      this.activeAreaAlarmId = data.data.data.area_alarm_id
      this.setAreaTime = false
      // this.polygon.hide()//...先把原来红色区域删除
      // this.showOneAlarmArea(this.markerArr,this.activeAreaAlarmId)

      // this.markerArr.length=0
      this.getAlarmList()
      this.$message({
        type: 'success',
        message: '设置区域成功'
      })
      this.polyLineArr.length = 0
      //刷新当前页面
      setTimeout(() => {
        this.$router.go(0)
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
    url: 'http://s.tronl.cn/weixin/project/index.php?m=home&c=alarm&a=area_alarms',
    method: 'POST',
    changeOrigin: true,
    data: params
  }).then((data) => {

    if (data.data.code == 200) {
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
    url: 'http://s.tronl.cn/weixin/project/index.php?m=home&c=alarm&a=area_alarm',
    method: 'POST',
    changeOrigin: true,
    data: params
  }).then((data) => {

    if (data.data.code == 200) {
      let state = data.data.data.list.state //是否存在报警，0为没有，1为又报警
      let id = this.$refs.alarmSelect.value
      this.newShuaXinMap()
      this.showOneAreaAllMarker(data.data.data.list)
      this.showOneAlarmPolygon(data.data.data.list.points, state)

      this.oneAlarmPersonList = data.data.data.list.child
      this.moveingPersonList = this.oneAlarmPersonList
      this.oneAlarmMessage = data.data.data.arr
      this.personMoveing()
    }
  }).catch((error) => {
    console.log(error)
  })

}

function showOneAlarmPolygon(arr, state = 0) {

  let that = this
  let map = this.map
  let arr2 = arr.map(e => {
    return [e[1] * 1, e[0] * 1]
  })
  if (this.shangyigequyu) { //先把刚才查看的区域清空
    this.shangyigequyu.remove()
  }
  let gangcaide = this.setPolyGon(arr2, state)
  this.shangyigequyu = gangcaide // 更新刚才的区域

}

function showOneAreaAllMarker(data) { //显示一个区域的人员标记
  if (this.markerArr.length) {
    this.markerArr.forEach(e => e.remove())
  }

  let that = this
  this.filterMessage.uname = data.policeuser_name
  this.filterMessage.bianhao = data.police_number
  this.filterMessage.newOrOld = 'old'
  this.filterMessage.imgSrc = data.icon
  let dianArr = data.child.map((e, i) => [e.position.latitude * 1, e.position.longitude * 1])
  // this.newShuaXinMap()
  let IMEIArr = data.child.map(item => item.IMEI)

  console.log(IMEIArr)
  this.setMarker(dianArr)


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
    url: 'http://s.tronl.cn/weixin/project/index.php?m=home&c=alarm&a=del',
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

function getNewPosition() {

  let IMEIstr = this.moveingPersonList.map(e => e.IMEI).join()
  var objs = {
    "IMEI": IMEIstr,
    "ps": 999
  };
  var key = this.$store.state.key;
  var sign = this.$methods.mkSign(objs, key);
  var token = this.$gscookie.getCookie('gun')
  var params = new URLSearchParams();
  params.append('IMEI', objs.IMEI);
  params.append('ps', objs.ps);
  params.append('sign', sign);
  params.append('token', token)
  this.$axios({
    url: 'http://s.tronl.cn/weixin/project/index.php?m=home&c=position&a=positions',
    method: 'POST',
    changeOrigin: true,
    data: params
  }).then((data) => {

    if (data.data.code == 200) {
      let BM = this.BM
      // console.log('10s请求一次数据更新位置', this.markerArr, this.moveingPersonList, data.data.data.list)
      let xy = data.data.data.list.map(item => [item.latitude, item.longitude])
      //讲返回的坐标值生成信坐标位置
      let latLngArr = xy.map(item => BM.latLng(item))
      //将现有的标记点移动到新位置
      this.markerArr.forEach((item, index) => {
        item.setLatLng(latLngArr[index])
      })

    }
  }).catch((error) => {
    console.log(error)
  })
}

function overArea(id) { //..区域内是否存在超出区域的报警
  var objs = {
    "area_id": id
  };
  var key = this.$store.state.key;
  var sign = this.$methods.mkSign(objs, key);
  var token = this.$gscookie.getCookie('gun')
  var params = new URLSearchParams();
  params.append('sign', sign);
  params.append('token', token);
  params.append('area_id', objs.area_id);
  this.$axios({
    url: 'http://s.tronl.cn/weixin/project/index.php?m=home&c=Alarm&a=area_sta',
    method: 'POST',
    changeOrigin: true,
    data: params
  }).then((data) => {

    if (data.data.code == 200) {

      if (!this.polygon) {
        return
      }
      let state = data.data.state
      console.log('是否存在报警state', state)
      this.polygon.remove()
      this.setPolyGon(this.quyuArr, state)

    }
  }).catch((error) => {
    console.log(error)
  })
}

export {
  GetDistance, //..计算两坐标点之间的距离单位千米
  personMoveing, //..做动画
  getIMEI,
  getJiGouStr,
  searchHistory,
  creatInfoBox,
  // mapInit,
  initPage,
  extend,
  setWarningRange,
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
  setDian,
  overArea
}
