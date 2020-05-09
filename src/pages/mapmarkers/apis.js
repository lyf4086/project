
//server_id   uid
export function xxx(par={}) {
    var key=this.$store.state.key;
    var sign = this.$methods.mkSign(par, key);
    var token = this.$gscookie.getCookie("gun");
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    return this.$axios({
        url:this.$store.state.baseURL +
            "/weixin/project/index.php?m=home&c=Page&a=person_state",
        method: "POST",
        changeOrigin: true,
        data: params
    })
}