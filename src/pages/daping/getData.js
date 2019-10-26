function getCitysDate(){
    var objs = { };
    var key = this.$store.state.key;
    var sign = this.$methods.mkSign(objs, key);
    var token = this.$gscookie.getCookie("gun");
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    this.$axios({
    url:
        this.$store.state.baseURL +
        "/weixin/project/index.php?m=Home&c=Page&a=map_data",
    method: "POST",
    changeOrigin: true,
    data: params
    })
    .then(data => {
        if(data.status==200){
           this.cityData=data.data.map(item=>{
               return [{
                   ...item,
                   selected:true
               }]
           })
           console.log(this.cityData)
           
           let n=0
           this.changeCityTimer=setInterval(()=>{
                if(n<this.cityData.length){
                    ++n;
                    this.initMap(n)
                }else{
                    n=0
                    // clearInterval(t)
                }
           },3000)
        }
    })
    .catch(error => {
        console.log(error);
    });
}



function getCitys(){
    var objs = { };
    var key = this.$store.state.key;
    var sign = this.$methods.mkSign(objs, key);
    var token = this.$gscookie.getCookie("gun");
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    this.$axios({
    url:
        this.$store.state.baseURL +
        "/weixin/project/index.php?m=Home&c=Page&a=city",
    method: "POST",
    changeOrigin: true,
    data: params
    })
    .then(data => {
        if(data.status==200){
            this.citys=data.data.data.map((e,i)=>{
                if(i==0){
                    return {
                        ...e,
                        checked:true
                    }
                }else{
                    return {
                        ...e,
                        checked:false
                    }
                }
            }) 
            console.log('getcity')
            // this.changeCityTimer=setInterval(() => {
            //     // console.log(this.changeCityIndex)
            //     this.changeCityIndex++
            //     if(this.changeCityIndex==this.citys.length){
            //         // clearInterval(this.changeCityTimer)
            //         this.changeCityIndex=0
            //     }
            //     this.initMap([[{name: this.citys[this.changeCityIndex].cname,selected:true}]])
            // }, 3000);
        }
    })
    .catch(error => {
        console.log(error);
    });
}

function importantAlarm(server_id=''){
    var objs = {"server_id":server_id };
    var key = this.$store.state.key;
    var sign = this.$methods.mkSign(objs, key);
    var token = this.$gscookie.getCookie("gun");
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    params.append("server_id", objs.server_id);
    this.$axios({
    url:
        this.$store.state.baseURL +
        "/weixin/project/index.php?m=Home&c=page&a=alarm_zhy",
    method: "POST",
    changeOrigin: true,
    data: params
    })
    .then(data => {
        if(data.status==200){
            Object.assign(this.zybj,data.data.data)
        }
    })
    .catch(error => {
        console.log(error);
    });
}

function yibanAlarm(server_id=''){
    var objs = {"server_id":server_id };
    var key = this.$store.state.key;
    var sign = this.$methods.mkSign(objs, key);
    var token = this.$gscookie.getCookie("gun");
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    params.append("server_id", objs.server_id);
    this.$axios({
    url:
        this.$store.state.baseURL +
        "/weixin/project/index.php?m=Home&c=page&a=alarm_yib",
    method: "POST",
    changeOrigin: true,
    data: params
    })
    .then(data => {
        if(data.status==200){
            Object.assign(this.ybbj,data.data.data)
            this.round1(data.data.data.rutao,data.data.data.quyu,data.data.data.total)
        }
    })
    .catch(error => {
        console.log(error);
    });
}

function quanguoqiangzhi(server_id=''){
    var objs = {"server_id":server_id };
    var key = this.$store.state.key;
    var sign = this.$methods.mkSign(objs, key);
    var token = this.$gscookie.getCookie("gun");
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    params.append("server_id", objs.server_id);
    this.$axios({
    url:
        this.$store.state.baseURL +
        "/weixin/project/index.php?m=Home&c=Page&a=guns",
    method: "POST",
    changeOrigin: true,
    data: params
    })
    .then(data => {
        if(data.status==200){
            let xname=data.data.data.map(item=>item.vQXingHao);
            let datanumber=data.data.data.map(item=>item.number);
            this.chart1(xname,datanumber)
        }
    })
    .catch(error => {
        console.log(error);
    });
}

function qiangdan(server_id=''){
    var objs = {"server_id":server_id };
    var key = this.$store.state.key;
    var sign = this.$methods.mkSign(objs, key);
    var token = this.$gscookie.getCookie("gun");
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    params.append("server_id", objs.server_id);
    this.$axios({
    url:
        this.$store.state.baseURL +
        "/weixin/project/index.php?m=Home&c=Page&a=gun_arm",
    method: "POST",
    changeOrigin: true,
    data: params
    })
    .then(data => {
        if(data.status==200){
            let number1=data.data.data.toal
            let number2=data.data.data.nCount
            let one1=Math.floor(number1/100)
            let one2=Math.floor(number2/100)
            this.qdtj={
                ...data.data.data,
                toal:Math.floor(data.data.data.toal*0.5)+'',
                nCount:Math.floor(data.data.data.nCount*0.5)+''
            }
            let t1=setInterval(()=>{

                if(this.qdtj.toal<number1){
                    let n=parseInt(this.qdtj.toal)
                    n+=one1;
                    this.qdtj.toal=n+''
                }else{
                    this.qdtj.toal=number1+''
                    clearInterval(t1)
                }
            },50)
            let t2=setInterval(()=>{

                if(this.qdtj.nCount<number2){
                    let n=parseInt(this.qdtj.nCount)
                    n+=one2;
                    this.qdtj.nCount=n+''
                }else{
                    this.qdtj.nCount=number2+''
                    clearInterval(t2)
                }
            },50)
        }
    })
    .catch(error => {
        console.log(error);
    });
}

function qiangzhiweizhi(server_id){
    var objs = {"server_id":server_id };
    var key = this.$store.state.key;
    var sign = this.$methods.mkSign(objs, key);
    var token = this.$gscookie.getCookie("gun");
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    params.append("server_id", objs.server_id);
    this.$axios({
    url:
        this.$store.state.baseURL +
        "/weixin/project/index.php?m=Home&c=Page&a=all_weizhi",
    method: "POST",
    changeOrigin: true,
    data: params
    })
    .then(data => {
        console.log(data)
    })
    .catch(error => {
        console.log(error);
    });
}

function baojingqingkuang(server_id=''){
    var objs = {"server_id":server_id };
    var key = this.$store.state.key;
    var sign = this.$methods.mkSign(objs, key);
    var token = this.$gscookie.getCookie("gun");
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    params.append("server_id", objs.server_id);
    this.$axios({
    url:
        this.$store.state.baseURL +
        "/weixin/project/index.php?m=Home&c=Page&a=alarm_info",
    method: "POST",
    changeOrigin: true,
    data: params
    })
    .then(data => {
        if(data.status==200){
            console.log(data)
            this.bjqk=data.data.data
            this.starMove()
        }
    })
    .catch(error => {
        console.log(error);
    });
}

function baojingrenweizhi(server_id){
    var objs = {"server_id":server_id };
    var key = this.$store.state.key;
    var sign = this.$methods.mkSign(objs, key);
    var token = this.$gscookie.getCookie("gun");
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    params.append("server_id", objs.server_id);
    this.$axios({
    url:
        this.$store.state.baseURL +
        "/weixin/project/index.php?m=Home&c=Page&a=task",
    method: "POST",
    changeOrigin: true,
    data: params
    })
    .then(data => {
        console.log(data)
    })
    .catch(error => {
        console.log(error);
    });
}

function renwutongji(server_id=''){
    var objs = {"server_id":server_id };
    var key = this.$store.state.key;
    var sign = this.$methods.mkSign(objs, key);
    var token = this.$gscookie.getCookie("gun");
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    params.append("server_id", objs.server_id);
    this.$axios({
    url:
        this.$store.state.baseURL +
        "/weixin/project/index.php?m=Home&c=Page&a=task",
    method: "POST",
    changeOrigin: true,
    data: params
    })
    .then(data => {
        if(data.status==200){
            this.rwtj.total=data.data.data[0].sum
            this.rwtj.yiji=data.data.data[0].total
            this.round2(data.data.data[1])
            this.round3(data.data.data[2])
            this.round4(data.data.data[3])
        }
        
    })
    .catch(error => {
        console.log(error);
    });
}

function renwuxiangqing(server_id=''){
    var objs = {"server_id":server_id };
    var key = this.$store.state.key;
    var sign = this.$methods.mkSign(objs, key);
    var token = this.$gscookie.getCookie("gun");
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    params.append("server_id", objs.server_id);
    this.$axios({
    url:
        this.$store.state.baseURL +
        "/weixin/project/index.php?m=Home&c=Page&a=task_info",
    method: "POST",
    changeOrigin: true,
    data: params
    })
    .then(data => {
        console.log(data)
    })
    .catch(error => {
        console.log(error);
    });
}

function renwuliebiao(server_id, tid ,sid){
    var objs = {"server_id":server_id ,"tid":tid,"sid":sid};
    var key = this.$store.state.key;
    var sign = this.$methods.mkSign(objs, key);
    var token = this.$gscookie.getCookie("gun");
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    params.append("server_id", objs.server_id);
    params.append("tid", objs.tid);
    params.append("sid", objs.sid);
    this.$axios({
    url:
        this.$store.state.baseURL +
        "/weixin/project/index.php?m=Home&c=Page&a=task_list",
    method: "POST",
    changeOrigin: true,
    data: params
    })
    .then(data => {
        console.log(data)
    })
    .catch(error => {
        console.log(error);
    });
}

function qiangmiaozaixian(server_id=''){
    var objs = {"server_id":server_id };
    var key = this.$store.state.key;
    var sign = this.$methods.mkSign(objs, key);
    var token = this.$gscookie.getCookie("gun");
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    params.append("server_id", objs.server_id);
    this.$axios({
    url:
        this.$store.state.baseURL +
        "/weixin/project/index.php?m=Home&c=page&a=gunaim",
    method: "POST",
    changeOrigin: true,
    data: params
    })
    .then(data => {
        if(data.status==200){
            Object.assign(this.zaixian,data.data.data)
        }       
    })
    .catch(error => {
        console.log(error);
    });
}

function renwutop5(server_id=''){
    var objs = {"server_id":server_id };
    var key = this.$store.state.key;
    var sign = this.$methods.mkSign(objs, key);
    var token = this.$gscookie.getCookie("gun");
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    params.append("server_id", objs.server_id);
    this.$axios({
    url:
        this.$store.state.baseURL +
        "/weixin/project/index.php?m=Home&c=Page&a=task_top",
    method: "POST",
    changeOrigin: true,
    data: params
    })
    .then(data => {
        if(data.status==200){
            console.log(data)
            this.rwtop5=data.data.data
        }
    })
    .catch(error => {
        console.log(error);
    });
}

function baojingtop5(server_id=''){
    var objs = {"server_id":server_id };
    var key = this.$store.state.key;
    var sign = this.$methods.mkSign(objs, key);
    var token = this.$gscookie.getCookie("gun");
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    params.append("server_id", objs.server_id);
    this.$axios({
    url:
        this.$store.state.baseURL +
        "/weixin/project/index.php?m=Home&c=Page&a=alarm_top",
    method: "POST",
    changeOrigin: true,
    data: params
    })
    .then(data => {
        if(data.status==200){
            console.log(data)
            this.bjtop5=data.data.data
        }
    })
    .catch(error => {
        console.log(error);
    });
}




export {
    getCitysDate,
    getCitys,
    importantAlarm,
    yibanAlarm,
    quanguoqiangzhi,
    qiangdan,
    qiangzhiweizhi,
    baojingqingkuang,
    baojingrenweizhi,
    renwutongji,
    renwuxiangqing,
    renwuliebiao,
    qiangmiaozaixian,
    renwutop5,
    baojingtop5
}