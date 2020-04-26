function handleSelect(){
      
}
function querySearch(queryString, callback) {
    let val=this.value
    if(!val){
        this.$message({
            type:"warning",
            message:"请线选择机构"
        })
        return
    }
    let selDataStatic=this.selDataStatic

    let fil=selDataStatic.filter(e=>e.id==val)
    let results=fil[0].child
    this.results=results
    results=results.map(item=>{
        return {
            ...item,
            value:item.uname
        }
    })
    // return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
    let da=[]
    results.forEach(item=>{
        if(item.value.indexOf(this.state)!=-1){
            da.push(item)
        }
    })
    // 调用 callback 返回建议列表的数据
    callback(da);
}
function subSearch(){
    if(!this.value){
        this.$message({
            type:"warning",
            message:"请先选择机构",
            duration:1000
        })
        return
    }
    if(!this.state){
        this.$message({
            type:"warning",
            message:"请先输入要查询的警员姓名",
            duration:1000
        })
        return
    }
    let da=this.results.find(item=>item.uname==this.state)
    // console.log(this.value,da)
    this.searchPerson(this.value,da.id)
}
function selChange(){
    console.log(9999)
}
function getSelData(){
    var key = this.$store.state.key;
    var objs = {};
    var sign = this.$methods.mkSign(objs, key);
    var token = this.$gscookie.getCookie("gun");
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    this.$axios({
    url:
        this.$store.state.baseURL +
        "/weixin/project/index.php?m=home&c=Page&a=map_person",
    method: "POST",
    changeOrigin: true,
    data: params
    }).then(res=>{
        if(res.status==200){
            this.selDataStatic=res.data
            this.options=res.data.map(item=>{
                return {
                    value: item.id,
                    label: item.cname
                }
            })
        }
    }).catch(err=>{
        console.log(err)
    })
}
function searchPerson(mid,uid){
    var key = this.$store.state.key;
    var objs = {
        "server_id":mid,
        "uid":uid
    };
    console.log(objs)
    
    var sign = this.$methods.mkSign(objs, key);
    var token = this.$gscookie.getCookie("gun");
    var params = new URLSearchParams();
    params.append("sign", sign);
    params.append("token", token);
    params.append("server_id", objs.server_id);
    params.append("uid", objs.uid);
    this.$axios({
    url:
        this.$store.state.baseURL +
        "/weixin/project/index.php?m=home&c=Page&a=person_state",
    method: "POST",
    changeOrigin: true,
    data: params
    }).then(res=>{
        console.log(res)
        if(res.status==200){
            
        }
    }).catch(err=>{
        console.log(err)
    })
}
export {
    handleSelect,
    querySearch,
    selChange,
    getSelData,
    subSearch,
    searchPerson
}