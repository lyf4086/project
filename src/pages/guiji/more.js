function hasWarning() { //..区域内是否存在报警
  var objs = {};
  var key = this.$store.state.key;
  var sign = this.$methods.mkSign(objs, key);
  var token = this.$gscookie.getCookie('gun')
  var params = new URLSearchParams();
  params.append('sign', sign);
  params.append('token', token)
  this.$axios({
    url: this.$store.state.baseURL + '/weixin/project/index.php?m=home&c=alarm&a=isalarm',
    method: 'POST',
    changeOrigin: true,
    data: params
  }).then((data) => {

    if (data.data.code == 200) {
      // console.log('more.js 10秒钟一次', data)
      // return

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
      console.log('是否存在报警state为', state)
      window.clearInterval(this.shezhiyanse)
      
      this.shezhiyanse = window.setTimeout(() => {
        if (state === 1) {

          this.polygon.setOptions({
            fillColor: 'rgba(195,13,35,0.4)'
          })

        } else {

          this.polygon.setOptions({
            fillColor: 'rgba(1,221,156,0.4)'
          })
        }
      }, 10000)

    }
  }).catch((error) => {
    console.log(error)
  })
}

function getOnePersonDate(item, policeuser_id, IMEI) {
  var objs = {
    "policeuser_id": policeuser_id,
    "IMEI": IMEI
  };
  var key = this.$store.state.key;
  var sign = this.$methods.mkSign(objs, key);
  var token = this.$gscookie.getCookie('gun')
  var params = new URLSearchParams();
  params.append('sign', sign);
  params.append('token', token);
  params.append('policeuser_id', objs.policeuser_id);
  params.append('IMEI', objs.IMEI);
  this.$axios({
    url: this.$store.state.baseURL + '/weixin/project/index.php?m=home&c=position&a=dingwei',
    method: 'POST',
    changeOrigin: true,
    data: params
  }).then((data) => {

    if (data.data.code == 200) {
      console.log(data)

      this.onePersonMessage.created = data.data.data.created
      this.onePersonMessage.IMEI = data.data.data.IMEI
      this.onePersonMessage.gtype = data.data.data.gtype
      this.onePersonMessage.ptype = data.data.data.ptype
      // this.creatInfoBox(item)
    }
  }).catch((error) => {
    console.log(error)
  })
}
export {
  hasWarning,
  overArea,
  getOnePersonDate
}
