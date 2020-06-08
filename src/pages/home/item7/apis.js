export  function getTop5() {
    let objs = {};
    var token = this.$gscookie.getCookie("gun");
    var key = this.$store.state.key;
    var sign = this.$methods.mkSign(objs, key);
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    this.$axios({
        url:
            this.$store.state.baseURL +
            "/weixin/project/index.php?m=home&c=Index&a=out_work",
        method: "POST",
        changeOrigin: true,
        data: params
    })
        .then(data => {
            this.list = data.data.data;
        })
        .catch(error => {
            console.log(error);
        });
}

export function zanbi(){
    
      let objs = {};
      var token = this.$gscookie.getCookie("gun");
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);
      var params = new URLSearchParams();
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=Index&a=out_device",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.status == 200) {
            this.mes = {
              ip_id: data.data.ip_id,
              mid: data.data.mid,
              tt: data.data.tt
            };
            this.outData=data.data.data.map(item=>item.out)
            this.inputData=data.data.data.map(item=>item.input)
            this.times=data.data.data.map(item=>item.time)
            this.initChart()
          }
        })
        .catch(error => {
          console.log(error);
        });
}