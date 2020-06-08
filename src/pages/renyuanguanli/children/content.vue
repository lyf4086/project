<template>
  <div class="renyuan" ref="renyuan">
    <div class="none-data" v-if="!list.length">暂无时没有数据</div>
    <div class="item" v-show="keshihua" v-for="(item,index) in list" :key="index" :class="{'dou':isRemoving}">
      <div class="text">
        <p>用户名：</p>
        <p class="put-wrap">
          <span>{{item.policeuser_name}}</span>
          <input
            type="text"
            v-show="item.put1show"
            v-model="item.policeuser_name"
            ref="put1"
            @blur="put1blur(index)"
            @keydown.13="put1blur(index)"
          />
        </p>
        <p>角色名：</p>
        <p class="put-wrap select-wrap">
          <span>{{item.role_name}}</span>

          <select
            v-show="item.put2show"
            ref="sel"
            
            v-model="item.role_id"
            @change="put2blur(index)"
          >
            <option :value="item.id" v-for="(item,index) in roles" :key="index">{{item.name}}</option>
            <!-- <option value="2">枪支管理员</option>
            <option value="3">用枪员</option>
            <option value="4">领导</option> -->
          </select>
        </p>
        <p>创建时间：</p>
        <p class="put-wrap">
          <span>{{changeTime(item.created)}}</span>
          <input type="text" v-show="item.put3show" v-model="item.created" ref="put3" />
        </p>
        <p>状态：</p>
        <p>
          <span class="qy" @click="leftChange(index)">启用</span>
          <i @click="leftChange(index)" :class="{'active':item.ishow==1}"></i>
          <span class="jy" @click="rightChange(index)">禁用</span>
          <i @click="rightChange(index)" :class="{'active':item.ishow==0}"></i>
        </p>
      </div>
      <div class="headpic">
        <img :src="item.icon" v-if="item.icon" alt="" />
        <img src="../../../assets/img/head-icon.png" v-if="!item.icon" alt="" />
      </div>
      <button class="xiangqing" @click="lookxiangqing(item)">查看详情</button>
      <div class="btns">
        <span @click="changeperson(index)" v-if="sync !=1">修改人员</span>
        <span @click="setjuese(index,item)">设置角色</span>
        <span @click="setmima(item)">{{item.sta===1?'修改初始密码':'设置初始密码'}}</span>
      </div>
      <button class="del-one" @click="delClick(item)">X</button>
    </div>
    <div class="content2" v-show="!keshihua">
      <div class="list-title"  v-if="list.length">
        <span>用户名</span>
        <span>角色名</span>
        <span>创建时间</span>
        <span>状态</span>
        <span>操作</span>
      </div>
      <div class="list_wrap">
        <div class="list-item" v-for="(item,index) in list" :key="index" >
          <span>{{item.policeuser_name}}</span>
          <span>{{item.role_name}}</span>
          <span>{{changeTime(item.created)}}</span>
          <span>{{item.ishow | typename}}</span>
          <span class="btns">
            <i @click="lookxiangqing(item)">查看详情</i>
            <i v-if="item.ishow==0" @click="leftChange(index)">启用</i>
            <i v-if="item.ishow==1" @click="rightChange(index)">禁用</i>
            <i @click="changeperson(index)" v-if="sync !=1">修改人员</i>
            <i @click="setjuese22(index,item)">设置角色</i>
            <i @click="setmima(item)">修改密码</i>
          </span>
        </div>
        
      </div>
      
    </div>
    <div class="zhezhao" v-show="changeShow||xiangqing||changejuese">
      
      <div class="changepsd" v-show="changejuese">
        <i>用户：{{changing}} 设置角色</i>
        <select
            ref="sel"
            v-model="role_id"
          >
            <option :value="item.id" v-for="(item,index) in roles" :key="index">{{item.name}}</option>
           
          </select>
          
        <p>
          <button @click="submitChangejuese">确认</button>
          <button @click="changejuese=false">取消</button>
        </p>
      </div>
      <div class="changepsd" v-show="changeShow">
        <i>用户：{{changing}} 设置或修改初始密码</i>
        <div class="putwrap">
          <span>新 密 码：</span>
          <input type="password" class="pass1" placeholder="新密码" v-model="pwd1" />
        </div>
        <div class="putwrap">
          <span>确认密码：</span>
          <input type="password" class="pass1" placeholder="再次确认新密码" v-model="pwd2" />
        </div>

        <p>
          <button @click="submitToChangePassWord">确认</button>
          <button @click="quxiao">取消</button>
        </p>
      </div>
      <div class="change-msg" v-show="xiangqing">
        <button class="delete" @click="deleteMsg">X</button>
        <div class="imgwrap">
          <img :src="active_item.icon" v-if="active_item.icon" alt />
          <img src="../../../assets/img/head-icon.png" v-else="!active_item.icon" alt />
        </div>
        <div class="mes">
          <div class="title">
            <p>用户名：</p>
            <p>手机号：</p>
            <p>警 号：</p>
            <p>所属机构：</p>
          </div>
          <div class="text">
            <div class="itemwrap">
              <span>{{active_item.policeuser_name}}</span>
              <!-- <i class="el-icon-edit" @click="cl1"></i> -->
              <input
                class="put"
                type="text"
                ref="put1"
                @blur="bl1"
                v-model="active_item.policeuser_name"
              />
            </div>
            <div class="itemwrap">
              <span>{{active_item.mobile}}</span>
              <!-- <i class="el-icon-edit" @click="cl2"></i> -->
              <input class="put" type="text" ref="put2" @blur="bl2" v-model="active_item.mobile" />
            </div>
            <div class="itemwrap">
              <span>{{active_item.police_number}}</span>
              <!-- <i class="el-icon-edit" @click="cl3"></i> -->
              <input
                class="put"
                type="text"
                ref="put3"
                @blur="bl3"
                v-model="active_item.police_number"
              />
            </div>
            <div class="itemwrap">
              <span>{{active_item.mechanism_name}}</span>
              <!-- <i class="el-icon-edit"></i> -->
              <input class="put" type="text" />
            </div>
          </div>
          <!-- <div class="toMore" @click="toMore">
                  更多详细信息
          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import url(./content.css);
</style>
<script>
export default {
  props: ["list", "isRemoving", "activeYeMa", "activeTreeId", "sync","roles","keshihua"],
  data() {
    return {
      baseURL:this.$store.state.baseURL,
      role_id:'',
      changejuese:false,
      changeShow: false,
      xiangqing: false,
      changing: "",
      activeData: "",
      pwd1: "", //...................设置初始密码
      pwd2: "", //................确认初始密码
      active_item: "",
      fc: false,
      index:0
    };
  },
  computed: {},
  filters:{
    typename:function(val){
      let name=val==1?'启用':'禁用'
      return name
    }
  },
  methods: {
    juese(n) {
      if (n == "1") {
        return "系统管理员";
      } else if (n == "2") {
        return "枪支管理员";
      } else if (n == "3") {
        return "用枪员";
      } else if (n == "4") {
        return "领导";
      }
    },
    setjuese22(index,item){
      this.changejuese=true
      this.role_id=item.role_id
      this.index=index
    },
    submitChangejuese(){
      let role_id=this.role_id
      this.put2blur(this.index,role_id)
    },
    lookxiangqing(item) {
      this.$store.commit("setPoliceId", {
        policeuser_id: item.policeuser_id,
        yeMa: this.activeYeMa,
        jiGouId: this.activeTreeId
      });
      this.$router.push({
        name: "PersonMessage"
      });
    },
    cl1(e) {
      e.target.parentNode.classList.add("selected");
      // alert(99)
      // this.$refs.put1.focus()
    },
    bl1(e) {
      e.target.parentNode.classList.remove("selected");
    },
    cl2(e) {
      e.target.parentNode.classList.add("selected");
      this.$refs.put2.focus()
    },
    bl2(e) {
      e.target.parentNode.classList.remove("selected");
    },
    cl3(e) {
      e.target.parentNode.classList.add("selected");
      // this.$refs.put3.focus()
    },
    bl3(e) {
      e.target.parentNode.classList.remove("selected");
    },
    deleteMsg() {
      this.xiangqing = false;
      this.changejuese=false
    },
    changeTime(timestamp) {
      var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() + " ";
      var h =date.getHours()+":";
      var m = date.getMinutes() + ":";
      var s = date.getSeconds();
      h=h.length==2?'0'+h:h
      m=m.length==2?'0'+m:m
      s=s.length==2?'0'+s:s
      return Y + M + D + h + m + s;
    },
    changeperson(index) {
      
      this.list[index].put1show = true;
      this.$nextTick(() => {
        this.$refs.put1[index].focus();
      });
    },
    setjuese(index,item) {
     let role_id=this.$gscookie.getCookie("message_obj").role_id
     if(role_id!=1){
       this.$message({
         type:"warning",
         message:"您目前没有权限修改"
       })
       return
     }
      let that=this
      this.list[index].put2show = true;
      this.$nextTick(() => {
        this.$refs.sel[index].focus();
      });
    },
    setmima(item) {
      this.changeShow = true;
      this.changing = item.policeuser_name;
      this.activeData = item; //..................当前要改的这条数据
    },
    put1blur(index) {
      //.............................修改名字star失焦后发数据请求更改用户名 传字段policeuser_id为修改

      this.list[index].put1show = false;
      
      var token = this.$gscookie.getCookie("gun");
      var objs = {
        uname: this.list[index].policeuser_name,
        role_id: this.list[index].role_id,
        policeuser_id: this.list[index].policeuser_id,
        mobile: this.list[index].mobile,
        sex: this.list[index].sex,
        mechanism_id: this.list[index].mechanism_id,
        police_number: this.list[index].police_number
      };
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);

      var params = new URLSearchParams();
      params.append("uname", objs.uname);
      params.append("role_id", objs.role_id);
      params.append("policeuser_id", objs.policeuser_id);
      params.append("mobile", objs.mobile);
      params.append("sex", objs.sex);
      params.append("mechanism_id", objs.mechanism_id);
      params.append("police_number", objs.police_number);
      // params.append('robcode_endtime', objs.robcode_endtime);
      // params.append('police_number', objs.police_number);
      // params.append('police_rank', objs.police_rank);
      // params.append('role_id', objs.role_id);
      // params.append('mechanism_id',objs.mechanism_id)

      params.append("sign", sign);
      params.append("token", token);

      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=policeuser&a=rewrite",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == "200") {
            this.$message({
              message: "修改成功",
              type: "success"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });

      //..........................................更改用户名end
    },
    put2blur(index,role_id) {
      //................................................更改角色star
      this.list[index].put2show = false;
      var token = this.$gscookie.getCookie("gun");
      var objs = {
        uname: this.list[index].policeuser_name,
        role_id:role_id?role_id: this.list[index].role_id,
        policeuser_id: this.list[index].policeuser_id,
        mobile: this.list[index].mobile,
        sex: this.list[index].sex,
        mechanism_id: this.list[index].mechanism_id,
        police_number: this.list[index].police_number
      };
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);

      var params = new URLSearchParams();
      params.append("uname", objs.uname);
      params.append("role_id", objs.role_id);
      params.append("policeuser_id", objs.policeuser_id);
      params.append("mobile", objs.mobile);
      params.append("sex", objs.sex);
      params.append("mechanism_id", objs.mechanism_id);
      params.append("police_number", objs.police_number);
      params.append("sign", sign);
      params.append("token", token);

      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=policeuser&a=rewrite",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if(data.data.code=='200'){
             this.$emit('shuaxin')
              this.$message({
                type:'success',
                message:'修改角色成功'
              })
              this.changejuese=false
          }else{
            this.$message({
              type:'error',
              message:data.data.msg
            })
          }
        })
        .catch(error => {
          console.log(error);
        });

      //........................................更改角色end
    },
    leftChange(index) {
      this.$confirm("将要更改状态, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.changeradiu1(index);
        })
        .catch(() => {});
    },
    rightChange(index) {
      this.$confirm("将要更改状态, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.changeradiu2(index);
        })
        .catch(() => {});
    },
    changeradiu1(index) {
      this.list[index].ishow = 1;
      var token = this.$gscookie.getCookie("gun");
      var objs = {
        uname: this.list[index].policeuser_name,
        role_id: this.list[index].role_id,
        policeuser_id: this.list[index].policeuser_id,
        mobile: this.list[index].mobile,
        sex: this.list[index].sex, //this.list[index].mobile
        mechanism_id: this.list[index].mechanism_id,
        police_number: this.list[index].police_number,
        ishow: this.list[index].ishow
      };
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);
      var params = new URLSearchParams();
      params.append("uname", objs.uname);
      params.append("role_id", objs.role_id);
      params.append("policeuser_id", objs.policeuser_id);
      params.append("mobile", objs.mobile);
      params.append("sex", objs.sex);
      params.append("mechanism_id", objs.mechanism_id);
      params.append("police_number", objs.police_number);
      params.append("ishow", objs.ishow);

      params.append("sign", sign);
      params.append("token", token);

      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=policeuser&a=rewrite",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
            this.$message({
              message: "修改状态成功",
              type: "success"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    changeradiu2(index) {
      this.list[index].ishow = 0;
      var token = this.$gscookie.getCookie("gun");
      var objs = {
        uname: this.list[index].policeuser_name,
        role_id: this.list[index].role_id,
        policeuser_id: this.list[index].policeuser_id,
        mobile: this.list[index].mobile,
        sex: this.list[index].sex, //this.list[index].mobile
        mechanism_id: this.list[index].mechanism_id,
        police_number: this.list[index].police_number,
        ishow: this.list[index].ishow
      };
      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);
      var params = new URLSearchParams();
      params.append("uname", objs.uname);
      params.append("role_id", objs.role_id);
      params.append("policeuser_id", objs.policeuser_id);
      params.append("mobile", objs.mobile);
      params.append("sex", objs.sex);
      params.append("mechanism_id", objs.mechanism_id);
      params.append("police_number", objs.police_number);
      params.append("ishow", objs.ishow);
      params.append("sign", sign);
      params.append("token", token);
      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=policeuser&a=rewrite",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == 200) {
           
            this.$message({
              message: "修改状态成功",
              type: "success"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }, //......................................................更改状态end
    quxiao() {
      this.changeShow = false;
      this.pwd1 = this.pwd2 = "";
    },
    delClick(item) {
      //..........xx的点击事件
      this.$emit("delThis", item);
    },
    submitToChangePassWord() {
      //........................确认修改初始密码start
      if(this.pwd1.trim()=='')return
      if (this.pwd1 != this.pwd2) {
        this.$message({
          type: "error",
          message: "两次密码不一样"
        });
        return;
      }
      var token = this.$gscookie.getCookie("gun");
      var objs = {
        uname: this.activeData.policeuser_name,
        role_id: this.activeData.role_id,
        policeuser_id: this.activeData.policeuser_id,
        mobile: this.activeData.mobile,
        sex: this.activeData.sex,
        mechanism_id: this.activeData.mechanism_id,
        police_number: this.activeData.police_number,
        pwd: this.pwd1
      };

      var key = this.$store.state.key;
      var sign = this.$methods.mkSign(objs, key);

      var params = new URLSearchParams();
      params.append("uname", objs.uname);
      params.append("role_id", objs.role_id);
      params.append("policeuser_id", objs.policeuser_id);
      params.append("mobile", objs.mobile);
      params.append("sex", objs.sex);
      params.append("mechanism_id", objs.mechanism_id);
      params.append("police_number", objs.police_number);
      params.append("pwd", objs.pwd);

      params.append("sign", sign);
      params.append("token", token);

      this.$axios({
        url:
          this.$store.state.baseURL +
          "/weixin/project/index.php?m=home&c=policeuser&a=rewrite",
        method: "POST",
        changeOrigin: true,
        data: params
      })
        .then(data => {
          if (data.data.code == "200") {
            this.changeShow = false;
            this.pwd1 = this.pwd2 = "";
            this.$message({
              message: "设置初始面成功",
              type: "success"
            });
          }
          if (data.data.code == "400") {
            this.$message({
              message: `设置密码失败，${data.data.msg}`,
              type: "error"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    } //....................................确认修改初始密码end
  },
  created() {},
  mounted() {
    let that = this;

    this.$nextTick(() => {
      this.$refs.renyuan.addEventListener("click", function(e) {
        if (e.target.className != "del-one") {
          that.$emit("quxiaoshanchu");
        }
      });
    });
  }
};
</script>


