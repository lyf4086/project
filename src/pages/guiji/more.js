
function hasWarning(){//..区域内是否存在报警
  var objs = {};
  var key=this.$store.state.key;
  var sign =  this.$methods.mkSign(objs,key);
  var token=this.$gscookie.getCookie('gun')
  var params = new URLSearchParams();
  params.append('sign',sign);
  params.append('token',token)
  this.$axios({
      url:'http://s.tronl.cn/weixin/project/index.php?m=home&c=alarm&a=isalarm',
      method:'POST',
      changeOrigin:true,
      data:params
  }).then((data)=>{

    if(data.data.code==200){
      // console.log('more.js-3分钟一次',data)

    }
  }).catch((error)=>{
    console.log(error)
  })
}


export {
  hasWarning
}
