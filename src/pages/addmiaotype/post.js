export default function (json = { url: "", data: {} }, callback) {
    if (!json.url) {
        this.$message.error("路劲必传");
        return;
    }
    let objs = {
        ...json.data
    };
    var token = this.$gscookie.getCookie("gun");
    var key = this.$store.state.key;
    var sign = this.$methods.mkSign(objs, key);
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    for (let item in objs) {
        params.append(item, objs[item]);
    }
    this.$axios({
        url: this.$store.state.baseURL + json.url,
        method: "POST",
        changeOrigin: true,
        data: params
    }).then(res => {
        if (callback) {
            callback(res);
        } else {
            return res;
        }
    });
}