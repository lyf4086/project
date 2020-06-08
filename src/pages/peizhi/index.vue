<template>
    <div class="wrap">
        <div class="floor">
            <div class="title">参数说明</div>
            <div class="content">参数值</div>
        </div>
        <div class="floor">
            <div class="title">枪瞄在线时间容差值（分钟）</div>
            <div class="content">
                <input type="text" v-model.trim="txt1" @blur="blur1">
            </div>
        </div>
        <div class="floor">
            <div class="title">报警位置时间容差值（分钟）</div>
            <div class="content">
                <input type="text" v-model.trim="txt2" @blur="blur2">
            </div>
        </div>
        <div class="floor">
            <div class="title">系统名称</div>
            <div class="content">
                <input type="text" v-model.trim="txt3" @blur="blur3">
            </div>
        </div>
        <div class="floor">
            <div class="title">系统版权信息</div>
            <div class="content">
                <input type="text" v-model.trim="txt4" @blur="blur4">
            </div>
        </div>
        <div class="floor">
            <div class="title">系统描述</div>
            <div class="content">
                <input type="text" v-model.trim="txt5" @blur="blur5">
            </div>
        </div>
        <div class="floor">
            <div class="title">系统备案号</div>
            <div class="content">
                <input type="text" v-model.trim="txt6" @blur="blur6">
            </div>
        </div>
        <div class="floor">
            <div class="title">混合定位时间容差</div>
            <div class="content">
                <input type="text" v-model.trim="txt7" @blur="blur7">
            </div>
        </div>
        <div class="floor">
            <button @click="submitSet">提交</button>
        </div>
        
    </div>
</template>
<script>
export default {
    data(){
        return {
            id:'',
            url:'',
            txt1:'',
            txt2:'',
            txt3:'',
            txt4:'',
            txt5:'',
            txt6:'',
            txt7:'',
            btxt1:'',
            btxt2:'',
            btxt3:'',
            btxt4:'',
            btxt5:'',
            btxt6:'',
            btxt7:''
        }
    },
    methods:{
        blur1(){
            if(this.txt1==''){
                this.txt1=this.btxt1
            }
        },
        blur2(){
            if(this.txt2==''){
                this.txt2=this.btxt2
            }
        },
        blur3(){
            if(this.txt3==''){
                this.txt3=this.btxt3
            }
        },
        blur4(){
            if(this.txt4==''){
                this.txt4=this.btxt4
            }
        },
        blur5(){
            if(this.txt5==''){
                this.txt5=this.btxt5
            }
        },
        blur6(){
            if(this.txt6==''){
                this.txt6=this.btxt6
            }
        },
        blur7(){

        },
        submitSet(){           
            let {id,url,txt1,txt2,txt3,txt4,txt5,txt6,txt7}=this._data
            this.setData(id,url,txt1,txt2,txt3,txt4,txt5,txt6,txt7)
        },
        getData(){
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
                "/weixin/project/index.php?m=Home&c=Config&a=index",
                method: "POST",
                changeOrigin: true,
                data: params
            })
            .then(data => {
                if (data.data.code == 200) {
                    let {id,banquan,beian,miaoshu,name,url,weizhi,zaixian,dwei}=data.data.data
                    this.id=id
                    this.url=url
                    this.txt1=zaixian;
                    this.txt2=weizhi;
                    this.txt3=name;
                    this.txt4=banquan;
                    this.txt5=miaoshu;
                    this.txt6=beian;
                    this.txt7=dwei
                    this.btxt1=zaixian;
                    this.btxt2=weizhi;
                    this.btxt3=name;
                    this.btxt4=banquan;
                    this.btxt5=miaoshu;
                    this.btxt6=beian;
                    this.btxt7=dwei
                }
            })
            .catch(error => {
                console.log(error);
            });
        },
        setData(id,url,zaixian,weizhi,name,banquan,miaoshu,beian,dwei){
            var key = this.$store.state.key;
            var objs = {
                id,
                url,
                zaixian,
                weizhi,
                name,
                banquan,
                miaoshu,
                beian,
                dwei
            };
            var sign = this.$methods.mkSign(objs, key);
            var token = this.$gscookie.getCookie("gun");
            var params = new URLSearchParams();
            params.append("id", objs.id);
            params.append("url", objs.url);
            params.append("zaixian", objs.zaixian);
            params.append("weizhi", objs.weizhi);
            params.append("name", objs.name);
            params.append("banquan", objs.banquan);
            params.append("miaoshu", objs.miaoshu);
            params.append("beian", objs.beian);
            params.append("dwei", objs.dwei);
            params.append("sign", sign);
            params.append("token", token);
            this.$axios({
                url:
                this.$store.state.baseURL +
                "/weixin/project/index.php?m=Home&c=Config&a=hand",
                method: "POST",
                changeOrigin: true,
                data: params
            })
            .then(data => {
                if (data.data.code == 200) {
                    this.$message({
                        type:"success",
                        message:data.data.msg
                    })
                }else{
                    this.$message({
                        type:"error",
                        message:data.data.msg
                    })
                }
            })
            .catch(error => {
            console.log(error);
            });
        }
    },
    created(){
        this.getData()
    },
    mounted() {
    this.$store.commit('setStr',{
      str1:'配置参数',
      str2:''
    })
  },
  destroyed(){
    this.$store.commit('huanyuanStr')
  }
}
</script>
<style lang="less" scoped>
@vw:19.2vw;
    .wrap{
        font-size: 14/@vw;
        color:#ccc;

        .floor{
            width:100%;
            height:50/@vw;
            margin-top: 15/@vw;   
            border-radius: 5/@vw;
            display: flex;
            justify-content: flex-start;
            button{
                margin-top: 5/@vw;
                width:417/@vw;
                height:40/@vw;
                border-radius: 5/@vw;
                background: #34a5f7;
                color:#ccc;
                margin-left: 50%;
                transform: translateX(-50%);
                cursor: pointer;
            }
            .title{
                width:380/@vw;
                height:100%;
                line-height: 50/@vw;
                text-indent: 64/@vw;
                color:#ccc;
            }
            .content{
                width:417/@vw;
                height: 100%;
                line-height: 50/@vw;
                input{
                    box-sizing: border-box;
                    width:417/@vw;
                    height:40/@vw;
                    border: 1/@vw solid #34a5f7;
                    border-radius: 5/@vw;
                    background: none;
                    font-size: 14/@vw;
                    text-indent: 16/@vw;
                    color:#ccc;
                }
            }
        }
        .floor:nth-child(odd){
            background: rgba(108, 126, 142, 0.5);
        }
        .floor:nth-child(1){
            background: rgba(44,80,110,0.5);
            color:#d5d5d5;
            font-size: 16/@vw;
            .title{
                font-size: 16/@vw;
                color:#d5d5d5;
            }
            .content{
                font-size: 16/@vw;
                color:#d5d5d5;
            }
        }
    }
</style>