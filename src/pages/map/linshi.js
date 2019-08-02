
let that = this
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

this.moveingPersonList = newArr//当前要做动画运动的人



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

let markerArr = bbb.map((e, i) => {
  return new AMap.Marker({
    content: `<div class="marker-route" >
                  <div class="cover" ></div>
                  <div class="img_wrap">
                    <img src="${this.IMEI_img[e.IMEI]}" />
                  </div>
                </div>`,
    position: e.ponint,
    jigou: e.mechanism_name,
    gtype: e.gtype,
    title: e.policeuser_name,
    IMEI: e.IMEI,
    offset: new AMap.Pixel(-20, -45)
  })
})

markerArr.forEach(item => {
  AMap.event.addListener(item, 'click', function (ev) {

    that.creatInfoBox(ev.target.G.title, ev.target.G.position, item)

  })
})



this.map.add(markerArr)
this.map.setFitView([...markerArr])
this.pointMark = a1
















































