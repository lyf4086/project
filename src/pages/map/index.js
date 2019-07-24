//第一个选择框事件
function jigouSelChange(e) {
  this.isChange = true
  this.getPersonAndGunStr(e.target.value)

}
//通过第一个选择框动态生成第二个选择框的数据
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
    url: 'http://s.tronl.cn/weixin/project/index.php?m=home&c=position&a=guns',
    method: 'POST',
    changeOrigin: true,
    data: params
  }).then((data) => {
    if (data.data.code == 200) {
      let allPersonList = data.data.data.list.map(e => {
        return {
          ...e,
          checked: false
        }
      })

      this.activeIMEI = data.data.data.list.length ? data.data.data.list[0].IMEI : ''
      this.gunAndJingyuanOptionStr = `<option value="" disabled selected >请选择人员和枪支</option>` + optionStr(data.data.data.list)
      this.noCheckedList = allPersonList

    }

    function optionStr(arr) {
      let str = ''
      if (!arr.length) {
        return str = `<option >暂时没有数据</option>`
      }
      arr.forEach(e => {
        if (!e.policeuser.img) e.policeuser.img = "123";
        str += `<option value="${e.IMEI}|${e.policeuser.img}"  >枪支编号：${e.gun_code} , 所属警员：${e.policeuser_name ?e.policeuser_name:'暂未绑定人员'},枪瞄编号：${e.IMEI}</option>`
      })
      return str
    }
  }).catch((error) => {
    console.log(error)
  })

}
//点击去详情页
function spanToXiangQing(item) {

  this.$router.push({
    name: 'PersonMessage',
    params: item
  })
}
//点击去报警页
function spanToBaoJing(item) {
  this.$router.push({
    name: 'BaoJing',
    params: item
  })
}

function spanToDelete(item) {

  this.noCheckedList.forEach(obj => {
    if (obj.IMEI == item.IMEI) {
      obj.checked = false
    }
  })
  if (this.noCheckedList.filter(e => e.checked).length < 1) {

    this.shuaXinMap()
    this.getIMEI([this.activeIMEI])

    this.checkedPersonArr.length = 0
    return
  }
  this.yijingXuanze()
}

function toOnePersonData() {

  this.$router.push({
    name: 'PersonMessage',
    params: this.selectedPerson
  })
}

function toHistory() {
  this.oldOrNew = 'old'
  this.isChange = true
  this.checkTime = true

}

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

function alarmBoxShowOrHide() {
  this.oneAlarmPersonListBox = !this.oneAlarmPersonListBox
}

function stopSetArea() {
  this.setAreaTime = false;
  this.polygon.hide()
  this.markerArr.length = 0
  // console.log(this.markerArr)
}

function showOne() {
  let v = this.$refs.alarmSelect.value
  if (!v) {
    this.$message({
      type: "warning",
      message: '先选择区域'
    })
    return
  }
  setTimeout(() => {
    this.overArea(v);
  }, 500);
  clearInterval(this.areaTimer);
  this.areaTimer = setInterval(() => {
    this.overArea(v);
  }, 10000);

  this.delId = v
  this.getOneAlarmArea(v)
  this.noClick = true
  this.isChange = true

}

function showAll() {
  let v = this.$refs.alarmSelect.value
  // console.log(v)
  this.getOneAlarmArea(v)
  // this.showAllAlarmArea(this.allAlarmAreaList)
}

function submitSetAreaWarning() {

  let newArr1 = [...this.checkedPersonArr, this.selectedPerson]
  let gun_ids11 = newArr1.map(e => e.gun_id)
  // 废弃的方法 let pointsArr11=this.markerArr.map(e=>`${e.G.position.M}|${e.G.position.O}`)
  let pointsArr11 = this.polyLineArr.map(item => {
    return `${item[1]}|${item[0]}`
  })
  let policeuser_id = this.selectedPerson.policeuser_id
  let s_t = this.startTime.replace("T", ' ')
  let e_t = this.endTime.replace("T", ' ')
  let areaName = this.areaName
  let str = newArr1.map(e => e.IMEI).join(',')

  if (!areaName.trim()) {
    this.$message({
      type: 'warning',
      message: '请输入区域名称'
    })
    return
  }



  this.shezhiquyu(gun_ids11, pointsArr11, policeuser_id, s_t, e_t, areaName, str)
  // this.markerArr.length=0
  this.startTime = this.endTime = ''
  this.areaName = ''

}

function showOneAlarmArea(arr, id) {
  // console.log('185', arr, id)
  let map = this.map
  let that = this
  let arr2 = arr.map(e => e.G.position)
  var polygon = new AMap.Polygon({
    path: arr2,
    fillColor: 'rgba(165,233,170,0.5)', // 多边形填充颜色
    borderWeight: 2, // 线条宽度，默认为 1
    strokeColor: 'rgb(66,92,248)', // 线条颜色
    area_alarm_id: id
  });

  polygon.on('rightclick', function (ev) {
    var contextMenu = new AMap.ContextMenu();
    contextMenu.addItem("删除该区域", function () {
      polygon.hide()
      that.delOneAlarmArea(ev.target.G.area_alarm_id)

    }, 0);
    contextMenu.addItem("显示该区域人员", function () {
      console.log('可以获取单个区域')

    }, 1);
    contextMenu.open(map, ev.lnglat);

    // console.log('showOneAlarmArea',ev)
    // console.log('showOneAlarmArea',ev.target.G.area_alarm_id)

    // that.$confirm('此操作将永久删除该q区域, 是否继续?', '提示', {
    //   confirmButtonText: '确定',
    //   cancelButtonText: '取消',
    //   type: 'warning'
    // }).then(() => {
    //   that.delOneAlarmArea(ev.target.G.area_alarm_id)
    //   this.$message({
    //     type: 'success',
    //     message: '删除成功!'
    //   });
    // }).catch(() => {
    //   this.$message({
    //     type: 'info',
    //     message: '已取消删除'
    //   });
    // });

  })
  this.polygon = polygon
  map.add(polygon)
  this.map.setFitView(polygon)

}

function showAllAlarmArea(arr) { //........参数必须为数组
  if (arr == '') {
    this.$message('暂时没有报警区域')
    return
  }
  let that = this
  let map = this.map
  let arr2 = arr.length ? arr : [arr] || this.allAlarmAreaList
  let arr3 = arr2.map(e => {
    let pointArr = e.points.split(',').map(e => e.split('|'))
    return {
      ...e,
      pointArr
    }
  })
  let polygonArr = arr3.map(item => {
    return new AMap.Polygon({
      path: item.pointArr,
      fillColor: 'rgba(165,233,170,0.5)', // 多边形填充颜色
      borderWeight: 2, // 线条宽度，默认为 1
      strokeColor: 'rgb(66,92,248)', // 线条颜色
      area_alarm_id: item.area_alarm_id,
      stime: item.stime,
      etime: item.etime,
      isenable: item.isenable
    });
  })
  // polygonArr.forEach(e=>{
  //   e.on('rightclick',function (ev){
  //      var contextMenu = new AMap.ContextMenu();
  //       contextMenu.addItem("删除该区域", function () {
  //           e.hide()//
  //           that.delOneAlarmArea(ev.target.G.area_alarm_id)
  //       }, 0);
  //       contextMenu.addItem("显示该区域人员", function () {
  //          console.log('显示该区域人员',ev.target.G.area_alarm_id)
  //          that.getOneAlarmArea(ev.target.G.area_alarm_id)
  //       }, 1);
  //        contextMenu.open(map, ev.lnglat);
  //         // contextMenuPositon = ev.lnglat;


  //   })
  // })

  this.polygonArr = polygonArr
  map.add(polygonArr)
  this.map.setFitView(polygonArr)

}

function outIn() {
  if (this.allAlarmShow) {
    $('.alarm_list').animate({
      right: '-2.4rem'
    }, function () {
      $('.goback').animate({
        right: '2.08rem'
      })
      $('.ii').css('transform', 'rotateY(180deg)')
    })
  } else {
    $('.goback').animate({
      right: '0'
    }, function () {
      $('.alarm_list').animate({
        right: '-0.33rem'
      })
      $('.ii').css('transform', 'rotateY(0deg)')
    })
  }
  this.allAlarmShow = !this.allAlarmShow
}

function changeGuiJiType(e) {
  this.isChange = true //..改变了数据避免多次点击
  this.oldOrNew = e.target.value
  if (e.target.value == 'new') {
    this.lineArr.length = 0
  } else {
    this.pointMark = [1, 1]
  }
}

function toBaoJing() { //去报警管理页面
  let p = this.activeIMEI

  this.$router.push({
    name: 'BaoJing',
    params: this.selectedPerson
  })
}

function searchByTime() { //.....根据时间搜索历史轨迹
  let t1 = this.startTime.replace("T", " ")
  let t2 = this.endTime.replace("T", " ")
  if (!t1 || !t2) {
    this.$message({
      message: '请选择时间',
      type: 'warning'
    })
    return
  }
  this.newShuaXinMap()

  this.searchHistory(this.activeIMEI, t1, t2) //通过起止时间搜索历史轨迹
  this.startTime = this.endTime = ''
}

function searchOnePerson() { //.........搜索人员后弹出该人员信息
  this.oneAlarmPersonList.length = 0
  if (this.polygon) {
    this.polygon.remove()
    this.polygon = ''
  }
  if (!this.isChange) {
    console.log('重复点击')
    this.map.fitBounds(this.fitBoundsArr)
    return
  }
  this.noCheckedList.forEach(e => e.checked = false)
  this.checkedPersonArr.length = 0

  this.$refs.alarmSelect.value = ''
  this.setWarning = false //..........关闭设置报警区域

  this.IMEI_img = [];
  this.IMEI_img[this.activeIMEI] = this.aaimg;
  this.filterMessage.uname = this.selectedPerson.policeuser_name
  this.filterMessage.bianhao = this.selectedPerson.policeuser.police_number
  this.filterMessage.imgSrc = this.selectedPerson.policeuser.icon
  // this.filterMessage.newOrOld=this.oldOrNew

  this.$refs.star.max = nowTime()
  if (this.oldOrNew == 'old') {
    this.checkTime = true
    return
  }

  // this.IMEI_img[this.activeIMEI] = this.activeimg ;
  this.active_person_show = true;
  this.getIMEI([this.activeIMEI]) //..............搜索一个人员
  function nowTime() { //...获取当前时间串
    let str = ''
    var date_now = new Date();
    var year = date_now.getFullYear()
    var month = date_now.getMonth() + 1 < 10 ? "0" + (date_now.getMonth() + 1) : (date_now.getMonth() + 1)
    var date = date_now.getDate() < 10 ? "0" + date_now.getDate() : date_now.getDate()
    return str = `${year}-${month}-${date}`
  }
  let that = this


}

function bianZuList() { //....选择编组人员列表
  this.bianzu_list_show = !this.bianzu_list_show
  this.checked_person_show = false
}

function yijingXuanze() { //.................编组后搜索一组人员

  let arrCED = this.noCheckedList.filter(e => e.checked)

  if (!arrCED.length) {
    this.$message('请选择编组人员')
    return
  } else {

    for (var i = 0; i < arrCED.length; i++) {
      this.IMEI_img[arrCED[i]['IMEI']] = arrCED[i]['policeuser']['img'];
    }

    this.checkedPersonArr = arrCED
    this.bianzu_list_show = false
    this.checked_person_show = true

    let arrIMEI = arrCED.map(e => e.IMEI)

    arrIMEI.unshift(this.activeIMEI)

    this.newShuaXinMap()

    this.getIMEI(arrIMEI) //....................................
  }

}

function binaZuBack() {
  this.checked_person_show = !this.checked_person_show
}

function jingyuanSelChange(e) {
  this.isChange = true //..改变了数据避免多次点击
  this.str = e.target.value.split('|') //..........记录当前选择的IMEI号

  this.activeIMEI = this.str[0];
  var img = this.str[1];

  this.aaimg = img

  let person = this.noCheckedList.filter(e => e.IMEI == this.activeIMEI)
  this.selectedPerson = person[0]
  // console.log(this.selectedPerson)
}

function closeToLeft() {
  //  bianzu_list_show:false,
  //   checked_person_show:false,
  if (this.bianzu_list_show || this.checked_person_show || this.oneAlarmPersonListBox) {
    this.bianzu_list_show = false
    this.checked_person_show = false
    this.oneAlarmPersonListBox = false
  }
  if (!this.onLeft) {
    $('.main_mes').animate({
      left: '-1.7rem'
    }, function () {
      $('.left_btn').animate({
        left: '1.7rem'
      })
    })
    $('.l_r').css('transform', 'rotateY(180deg)')

  } else {
    $('.left_btn').animate({
      left: '0rem'
    }, function () {
      $('.main_mes').animate({
        left: '0rem'
      })
    })
    $('.l_r').css('transform', 'rotateY(0deg)')
  }
  this.onLeft = !this.onLeft
}

function guijiHistory(path) { //.........使用历史轨迹坐标做动画
  let that = this
  let BM = this.BM
  let map = this.map
  var marker = BM.marker(path[0]).addTo(map);
  this.markerArr.push(marker)
  var index = 0;
  setInterval(function () {
    var c = index % path.length;
    marker.setLatLng(path[c]);
    index++;
  }, 400);
  var poly = BM.polyline(path).addTo(map);
  this.polyLineArr.push(poly)
  map.fitBounds(poly.getBounds());


}


export {
  jigouSelChange, //机构选择框事件
  getPersonAndGunStr, //第二个选择框的option字符串
  spanToXiangQing,
  spanToBaoJing,
  spanToDelete,
  toOnePersonData,
  toHistory,
  changeTime,
  alarmBoxShowOrHide,
  stopSetArea,
  showOne,
  showAll,
  submitSetAreaWarning,
  showOneAlarmArea,
  showAllAlarmArea,
  outIn,
  changeGuiJiType,
  toBaoJing,
  searchByTime,
  searchOnePerson,
  bianZuList,
  yijingXuanze,
  binaZuBack,
  jingyuanSelChange,
  closeToLeft,
  guijiHistory
}
