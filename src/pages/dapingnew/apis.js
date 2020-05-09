
export function cityNames(par={}) {
    var key=this.$store.state.key;
    var sign = this.$methods.mkSign(par, key);
    var token = this.$gscookie.getCookie("gun");
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    return this.$axios({
        url:this.$store.state.baseURL +
            "/weixin/project/index.php?m=home&c=Page&a=map_data",
        method: "POST",
        changeOrigin: true,
        data: params
    })
}
//枪弹统计  参数server_id  :机构id
export function qiangdan(par={}) {
    var key=this.$store.state.key;
    var sign = this.$methods.mkSign(par, key);
    var token = this.$gscookie.getCookie("gun");
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    for(let item in par){
        params.append(item, par[item]);
    }
    return this.$axios({
        url:this.$store.state.baseURL +
            "/weixin/project/index.php?m=home&c=Page&a=gun_arm",
        method: "POST",
        changeOrigin: true,
        data: params
    })
}
//  筛选条件server_id  :机构id
export function qiangxing(par={}) {
    var key=this.$store.state.key;
    var sign = this.$methods.mkSign(par, key);
    var token = this.$gscookie.getCookie("gun");
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    for(let item in par){
        params.append(item, par[item]);
    }
    return this.$axios({
        url:this.$store.state.baseURL +
            "/weixin/project/index.php?m=home&c=Page&a=guns",
        method: "POST",
        changeOrigin: true,
        data: params
    })
}

//弹药详情//  筛选条件server_id  :机构id
export function danyaoxiangqing(par={}) {
    var key=this.$store.state.key;
    var sign = this.$methods.mkSign(par, key);
    var token = this.$gscookie.getCookie("gun");
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    for(let item in par){
        params.append(item, par[item]);
    }
    return this.$axios({
        url:this.$store.state.baseURL +
            "/weixin/project/index.php?m=home&c=Page&a=gun_arm_info",
        method: "POST",
        changeOrigin: true,
        data: params
    })
}
//枪型详情 筛选条件server_id  :机构id
export function qiangxingxiangqing(par={}) {
    var key=this.$store.state.key;
    var sign = this.$methods.mkSign(par, key);
    var token = this.$gscookie.getCookie("gun");
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    for(let item in par){
        params.append(item, par[item]);
    }
    return this.$axios({
        url:this.$store.state.baseURL +
            "/weixin/project/index.php?m=home&c=Page&a=gtype_infos",
        method: "POST",
        changeOrigin: true,
        data: params
    })
}

//报警情况//  筛选条件server_id  :机构id
export function baojing(par={}) {
    var key=this.$store.state.key;
    var sign = this.$methods.mkSign(par, key);
    var token = this.$gscookie.getCookie("gun");
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    for(let item in par){
        params.append(item, par[item]);
    }
    return this.$axios({
        url:this.$store.state.baseURL +
            "/weixin/project/index.php?m=home&c=Page&a=alarm_info",
        method: "POST",
        changeOrigin: true,
        data: params
    })
}

//任务级别条件//  筛选条件server_id  :机构id
export function renwujibie(par={}) {
    var key=this.$store.state.key;
    var sign = this.$methods.mkSign(par, key);
    var token = this.$gscookie.getCookie("gun");
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    for(let item in par){
        params.append(item, par[item]);
    }
    return this.$axios({
        url:this.$store.state.baseURL +
            "/weixin/project/index.php?m=home&c=Page&a=task",
        method: "POST",
        changeOrigin: true,
        data: params
    })
}
//任务列表//  tid :任务id  sid:省份id
export function tasklist(par={}) {
    console.log(par)
    var key=this.$store.state.key;
    var sign = this.$methods.mkSign(par, key);
    var token = this.$gscookie.getCookie("gun");
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    for(let item in par){
        params.append(item, par[item]);
    }
    return this.$axios({
        url:this.$store.state.baseURL +
            "/weixin/project/index.php?m=home&c=Page&a=task_list",
        method: "POST",
        changeOrigin: true,
        data: params
    })
}

//当日任务前5  筛选条件server_id  :机构id
export function tasktop5(par={}) {
    var key=this.$store.state.key;
    var sign = this.$methods.mkSign(par, key);
    var token = this.$gscookie.getCookie("gun");
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    for(let item in par){
        params.append(item, par[item]);
    }
    return this.$axios({
        url:this.$store.state.baseURL +
            "/weixin/project/index.php?m=home&c=Page&a=task_top",
        method: "POST",
        changeOrigin: true,
        data: params
    })
}

// 月度，年度任务执行排行榜 筛选条件server_id  :机构id  stime,etime
export function task_rank(par={}) {
    var key=this.$store.state.key;
    var sign = this.$methods.mkSign(par, key);
    var token = this.$gscookie.getCookie("gun");
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    for(let item in par){
        params.append(item, par[item]);
    }
    return this.$axios({
        url:this.$store.state.baseURL +
            "/weixin/project/index.php?m=home&c=Page&a=moth_task",
        method: "POST",
        changeOrigin: true,
        data: params
    })
}
// 月度，年度报警数据排行榜   筛选条件server_id  :机构id  stime,etime
export function alarm_rank(par={}) {
    var key=this.$store.state.key;
    var sign = this.$methods.mkSign(par, key);
    var token = this.$gscookie.getCookie("gun");
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    for(let item in par){
        params.append(item, par[item]);
    }
    return this.$axios({
        url:this.$store.state.baseURL +
            "/weixin/project/index.php?m=home&c=Page&a=moth_alarm",
        method: "POST",
        changeOrigin: true,
        data: params
    })
}

// 月度，年度弹药消耗排行榜   筛选条件server_id  :机构id  stime,etime
export function xiaohao_rank(par={}) {
    var key=this.$store.state.key;
    var sign = this.$methods.mkSign(par, key);
    var token = this.$gscookie.getCookie("gun");
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    for(let item in par){
        params.append(item, par[item]);
    }
    return this.$axios({
        url:this.$store.state.baseURL +
            "/weixin/project/index.php?m=home&c=Page&a=moth_arm",
        method: "POST",
        changeOrigin: true,
        data: params
    })
}
//枪弹药类型
export function qiangdan_types(par={}) {
    var key=this.$store.state.key;
    var sign = this.$methods.mkSign(par, key);
    var token = this.$gscookie.getCookie("gun");
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    for(let item in par){
        params.append(item, par[item]);
    }
    return this.$axios({
        url:this.$store.state.baseURL +
            "/weixin/project/index.php?m=home&c=Page&a=arm_type",
        method: "POST",
        changeOrigin: true,
        data: params
    })
}