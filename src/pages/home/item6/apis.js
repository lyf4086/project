export function getDataOne() {
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
        "/weixin/project/index.php?m=home&c=Index&a=gun_device",
      method: "POST",
      changeOrigin: true,
      data: params
    })
      .then(data => {
        if(data.status==200){
          this.citys = data.data.mname;            
          this.mid = data.data.mid;
          this.ip_id = data.data.ip_id;
          this.numbers = data.data.number;
          this.timer1=setTimeout(() => {
            this.echartLeft();
          }, 0);
        }
        
      })
      .catch(error => {
        console.log(error);
      });
  }
  export function getDataTwo() {
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
        "/weixin/project/index.php?m=home&c=Index&a=days_alarm",
      method: "POST",
      changeOrigin: true,
      data: params
    })
      .then(data => {
        if(data.status==200){
          this.chart2Names = data.data.tname;
          this.chart2Day = data.data.date.map(item => {
            return {
              name: item
            };
          });
          this.chart2Data = data.data.cou;
          this.timer2=setTimeout(() => {
            this.echartCenter();
          }, 0);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
  export function getDataThree() {
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
        "/weixin/project/index.php?m=home&c=Index&a=early",
      method: "POST",
      changeOrigin: true,
      data: params
    })
      .then(data => {
        if (data.status == 200) {
          this.dataList3 = data.data.data;
          this.startMove();
        }
        // console.log('逾期',data)
      })
      .catch(error => {
        console.log(error);
      });
  }