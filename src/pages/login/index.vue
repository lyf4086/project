<template>
    <div class="login">
        <div class="btn1 hvr-float-shadow">
            <router-link to="/loginput" tag="button" >
               动态登录
            </router-link>
        </div>
        <div class="btn2">
            <a href="http://50.144.192.35/fjlocker" >
            <!-- <button class="btn">静态登陆</button> -->
                <div class="btn-wrapper">
                    <a href="javascript:;" class="btn"></a>
                </div>
            </a>
        </div>

    </div>
</template>
<style scoped>
@import url(./newlog.css);

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
