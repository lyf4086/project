<template>
    <div class="login">
        <div class="btn1">
            <router-link to="/loginput" tag="button" >动态登陆</router-link>
        </div>
        <div class="btn2">
            <a href="http://50.144.192.35/fjlocker">
                <button>静态登陆</button>
            </a>
        </div>

    </div>
</template>
<style scoped>
.login{
    width:100vw;
    height:100vh;
    background:url(../../assets/img/login1.jpg) no-repeat;
    background-size:100% 100%;
    position:relative;
}
.login >div {
     position:absolute;
        top:0;
        right:0;
        bottom:0;
        left:0;
        margin:auto;
}
.btn1{
    width:3.3rem;
    height:5.85rem;
    background:url(../../assets/img/dongtai.png) no-repeat ;
    background-size:100% 100%;
    transform:translateX(-65%);
}
.btn2{
    width:3.3rem;
    height:5.85rem;
    background:url(../../assets/img/jingtai.png) no-repeat ;
    background-size:100% 100%;
    transform:translateX(65%);
}
.btn1 button,.btn2 button{
    position:absolute;
    left:50%;
    bottom:0.86rem;
    transform:translateX(-50%);
    font-size:0.18rem;
    padding:0.01rem 0 0.02rem;
    font-family:'微软雅黑 Bold';
    color:#e2ebf0;
    width:2rem;
    text-indent: -1099900px;
    /* background:linear-gradient(to top,transparent,rgba(255,255,255,0.3)); */
    background: none;
    border:none;
    /* border:0.01rem solid #40b9ff; */
    border-radius:0.05rem;
    cursor:pointer;
}


</style>
<script>
    export default {
        created() {

            // let str=this.$gscookie.getCookie('gun')
            // if(!!str){
            //     this.$router.push("/indexg/huizong")
            // }

        }
    }
</script>
