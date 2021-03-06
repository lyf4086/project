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
  window.clearInterval(this.moveTimer)
  this.moveTimer = window.setInterval(() => {
    console.log('请求最新位置了,人数：', this.moveingPersonList.length,'sel-id:',this.$refs.alarmSelect.value)
    that.getNewPosition(this.$refs.alarmSelect.value)
  }, movingTime)
}

function getIMEI(IMEIArr) { //..........通过IMEI获取经纬度,参数为数组
  this.loading = this.$loading({
    lock: true,
    text: "Loading",
    spinner: "el-icon-loading",
    background: "rgba(0, 0, 0, 0.7)"
  });
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
  params.append('token', token);
  params.append('lid', objs.lid);
  this.$axios({
    url: this.$store.state.baseURL + '/weixin/project/index.php?m=home&c=position&a=positions',
    method: 'POST',
    changeOrigin: true,
    data: params
  }).then((data) => {
    this.loading.close()
    this.paixuarr=data.data.data.list.map(e=>e.IMEI)
    console.log(data.data.data.list)
    this.last_time_arr= data.data.data.list.map(e=>e.created) 
    this.newType= data.data.data.list.map(e=>e.ptype)
    this.newIsOnline=data.data.data.list.map(e=>e.heart)
    let that = this
    this.isChange = false //避免多次点击
    this.hasPerson = true;
    let newArr = this.checkedPersonArr
    newArr.unshift(this.selectedPerson)
    this.moveingPersonList = newArr //当前要做动画运动的人
    this.newShuaXinMap()
    let polyArr = data.data.data.list
    let arr = polyArr.map(item => {
      return [item.latitude * 1, item.longitude * 1]
    })

    let activeImg = require("@/assets/img/head-icon.png")
    let divIconArr = this.checkedPersonArr.map((item, index) => {
      let cln=polyArr[index].heart&&polyArr[index].heart==1?null:'is_lixian'
      let stateName=''
      if(polyArr[index].astate==1){
        stateName='litao';
      }else if(polyArr[index].astate==2){
        stateName='rutao';
      }else if(polyArr[index].astate==3){
        stateName='fanwei';
      }else{
        stateName='';
      }
      
      return this.BM.divIcon({
        html: `<div class="icon_wrap ${item.IMEI} ${cln}" title=${item.policeuser_name || ''} >
                <div class="img_wrap">
                  <img src="${this.header[this.headName] || item.policeuser.icon || activeImg}"/>
                </div>
                <div class="round_cover"><i></i></div>
                <div class="set-type ${stateName}"></div>
              </div>`
      })
    })

    let markerArr = arr.map((item, index) => {
      return this.BM.marker(item, {
        icon: divIconArr[index],
        title: this.checkedPersonArr[index].policeuser_name
      }).addTo(this.map)
    })
    this.markerArr = markerArr
    //把当前显示的标记点存一下
    markerArr.forEach((e, i) => {
        e.on('click',function (){
          const h = that.$createElement;
          that.$message({
            type:'none',
            duration:3000,
            message: h('div', {style:'font-size:16px;line-height:30px;'}, [
              h('p', null, `警员姓名：${that.checkedPersonArr[i].policeuser_name}`),
              h('p', null, `所属机构：${that.checkedPersonArr[i].mechanism_name}`),
              h('p', null, `枪支类型：${that.checkedPersonArr[i].gtype}`),
              h('p', null, `枪支编号：${that.checkedPersonArr[i].gun_code}`),
              h('p', null, `是否在线：${that.newIsOnline[i] == 1 ? "在线" : "不在线"}`),
              h('p', null, `定位类型：${that.newType[i]}`),
              h('p', null, `枪瞄编号：${that.checkedPersonArr[i].IMEI}`),
              h('p',null,`最后定位时间：${that.last_time_arr[i]}`)
            ])
          });
          that.showtols=true;
          setTimeout(()=>{
            that.showtols=false;
          },3000)
        })
    });
    this.fitBoundsArr = arr
    //地图自适应显示

    this.map.fitBounds(arr)
    let mes=this.$gscookie.getCookie("message_obj");
    if(mes.role_id==3){
      this.noClick = true
    }else{
      this.noClick = false
    }
    
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
    // url: this.$store.state.baseURL + '/weixin/project/index.php?m=home&c=position&a=position',
    url: this.$store.state.baseURL + '/weixin/project/index.php?m=home&c=position&a=rec_position',
    method: 'POST',
    changeOrigin: true,
    data: params
  }).then((data) => {
    this.loading.close()
    if (data.status == '200') {
      this.oldOrNew = 'old'
      this.checkTime = false
      if (!data.data) {
        this.$message('暂时没有轨迹数据')
        this.checkTime = false
      } else {
        
        let that = this
        // let lineArr = data.data.data.list.map((e) => {
        //   return {
        //     "alarm":e.alarm||null,
        //     "lat": e.latitude - 0,
        //     "lng": e.longitude - 0
        //   }
        // })
        //弃用
        // this.guijiHistory(lineArr)
      
        this.guijiHistory(data.data)


      }
    }

  }).catch((error) => {
    console.log(error)
  })
}

function creatInfoBox(tit = '李业锋', jingweidu, item, ...res) {
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
  if(this.polyLineArr.length<3){
    this.$message({
      type:"error",
      message:"至少选择三个点"
    })
    return
  }
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
  this.$router.go(0)
  
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
    url: this.$store.state.baseURL + '/weixin/project/index.php?m=home&c=alarm&a=rewrite',
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
        console.log('两秒钟之后')
        this.alarmSel=this.allAlarmAreaList[this.allAlarmAreaList.length-1].area_alarm_id
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
      this.allAlarmAreaList = data.data.data
      this.options = data.data.ltype
      this.optionsStr = data.data.ltype.map(item => `<option value=${item.id}>${item.loca_name}</option>`)
      this.value = data.data.ltype[0].id
      let s1 = `<option value="" disabled selected >请选择报警区域</option>`
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
    this.loading.close()
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
    }else{    
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
  let IMEIArr = data.child.map(item => item.IMEI)

  let paixuarr=data.child.map(e=>e.IMEI)
  this.paixuarr=paixuarr
  this.last_time_arr=data.child.map(e=>e.created)
  this.newType=data.child.map(e=>e.ptype) 
    this.newIsOnline=data.child.map(e=>e.heart) 
  // this.setMarker(dianArr)

  let noimg = require('@/assets/img/head-icon.png')
  let divIconArr = data.child.map((item, index) => {
    let cln=item.heart==1?null:'is_lixian' //classname
      let stateName=''
      if(item.astate==1){
        stateName='litao';
      }else if(item.astate==2){
        stateName='rutao';
      }else if(item.astate==3){
        stateName='fanwei';
      }else{
        stateName='';
      }
    return this.BM.divIcon({
      html: `<div class="icon_wrap ${item.IMEI} ${cln}" title=${item.policeuser_name ||'暂无'}>
                <div class="img_wrap">
                  <img src="${item.icon ? item.icon : noimg}"/>
                </div>
                <div class="round_cover"><i></i></div>
                <div class="set-type ${stateName}"></div>
              </div>`
    })
  })


  let BM = this.BM;
  let map = this.map;
  let markerArr = dianArr.map((item, index) => {

    return BM.marker(item, {
      icon: divIconArr[index],
      title: data.child[index].policeuser_name
    }).addTo(map);
  });


  map.fitBounds(dianArr);
  this.markerArr = markerArr;
  markerArr.forEach((e, i) => {
      e.on('click',function (){       
        const h = that.$createElement;
          that.$message({
            type:'none',
            duration:3000,
            message: h('div', {style:'font-size:16px;line-height:30px'}, [
              h('p', null, `警员姓名：${data.child[i].policeuser_name}`),
              h('p', null, `所属机构：${data.child[i].mechanism.mechanism_name}`),
              h('p', null, `枪支类型：${data.child[i].gtype}`),
              h('p', null, `枪支编号：${data.child[i].gun_code}`),
              h('p', null, `是否在线：${that.newIsOnline[i] == 1 ? "在线" : "不在线"}`),
              h('p', null, `定位类型：${that.newType[i]}`),
              h('p', null, `枪瞄编号：${data.child[i].IMEI}`),
              h('p',null,`最后定位时间：${that.last_time_arr[i]}`)
            ])
          });
          that.showtols=true;
          setTimeout(()=>{
            that.showtols=false;
          },3000)
      })

    });


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
    "ps": 999,
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
  params.append('token', token);
  params.append('lid', objs.lid)
  this.$axios({
    url: this.$store.state.baseURL + '/weixin/project/index.php?m=home&c=position&a=positions',
    method: 'POST',
    changeOrigin: true,
    data: params
  }).then((data) => {

    if (data.data.code == 200) {
      console.log('获取了最新定位',data.data.data.list)
      let newArr=[]
      this.paixuarr.forEach(item=>{
        newArr.push(data.data.data.list.find(e=>e.IMEI==item))
      })
      this.last_time_arr=newArr.map(e=>e.created)
      this.newType=newArr.map(e=>e.ptype) 
      this.newIsOnline=newArr.map(e=>e.heart) 
      newArr.length&&newArr.forEach((item,index)=>{//每10秒更新状态
        if(item.heart==1){//判断是否离线
          $(`.${item.IMEI}`).removeClass('is_lixian')
        }else{
          $(`.${item.IMEI}`).addClass('is_lixian')
        }
        
        item.das.length&&item.das.forEach((e,i)=>{//动态添加报警状态
          setTimeout(()=>{
            if(e==1){
              $(`.${item.IMEI}`).find('.set-type').addClass('litao-a')
              $(`.${item.IMEI}`).find('.set-type').removeClass('fanwei-a rutao-a')
            }else if(e==2){
              $(`.${item.IMEI}`).find('.set-type').addClass('rutao-a')
              $(`.${item.IMEI}`).find('.set-type').removeClass('fanwei-a litao-a')
            }else if(e==3){
              $(`.${item.IMEI}`).find('.set-type').addClass('fanwei-a')
              $(`.${item.IMEI}`).find('.set-type').removeClass('rutao-a litao-a')
            }
          },i*1000)
        })
      })
      let BM = this.BM
      // console.log('10s请求一次数据更新位置')
      let xy = newArr.map(item => [item.latitude, item.longitude])
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
    url: this.$store.state.baseURL + '/weixin/project/index.php?m=home&c=Alarm&a=area_sta',
    method: 'POST',
    changeOrigin: true,
    data: params
  }).then((data) => {

    if (data.data.code == 200) {

      if (!this.polygon) {
        return
      }
      let state = data.data.state
      console.log('是否存在报警state:', state)
      this.polygon.remove()
      this.setPolyGon(this.quyuArr, state)

    }
  }).catch((error) => {
    console.log(error)
  })
}

function getAllJiGouName(mechanism_id, ip_id) {
  var objs = {
    "mechanism_id": mechanism_id,
    "ip_id": ip_id
  };
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
  getNewPosition,//获取一组人最新定位数据
  setDian,
  overArea,
  getAllJiGouName
}
