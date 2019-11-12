<template>
    <div class="vidio">
        <div class="tree-menu">
            <h3>录音录像</h3>
            <div class="nav-wrap" >
                 <el-tree
                    :data="treeListData"
                    :props="defaultProps"
                    :highlight-current="true"
                    node-key="id"
                     :current-node-key="currentNodeKey"
                    @node-click="handleNodeClick"
                    :default-expanded-keys="zhankai"
                  ></el-tree>
            </div>

        </div>
        <div class="top-nav">

             <div class="bread-wrap">
           <!--面包屑导航-->
              <breadNav title="录音录像" :next="activeItem.mechanism_name" />
           </div>
            <div class="search-wrap">
            <!--搜索框-->
                <select class="sel" v-model="selValue">
                  <option value="" disabled selected>请选择搜索类型</option>
                  <option value="vname">文件名</option>
                  <option value="uname">警员姓名</option>
                </select>
                <input type="text" class="textput" v-model="putValue" @keyup.13="subSearch" placeholder="请输入搜素关键字"/>
                <button class="sub" @click="subSearch" ></button>
            </div>
        </div>
        <div class="page-index" >
            <el-pagination
            :page-size="15"
            :pager-count="9"
             @current-change="currentChange"
             :current-page="active_page"
            layout="total,prev, pager, next"
            ref="page"
            :total="pageTotal">
            </el-pagination>
        </div>
        <div class="add-del" >           
            <button @click="upData">上传</button>
            <button @click="downloadVidio">预览</button>
            <button @click="del">删除</button>
        </div>
        <div class="content" >
            <Content :dataArr="dataList" @changeAll="changeAll"/>
        </div>
        <div class="cover" v-show="upDataShow">
          <div class="alert">
            <div class="content">
              <!-- <el-form-item label="视频上传" prop="Video"> -->
                <!-- action必选参数, 上传的地址 -->
                <div class="floor">
                  <div class="l">
                    <span>机构名称：</span>
                    <span>{{activeItem.mechanism_name}}</span>
                  </div>
                  <div class="r">
                    <span>警员：</span>
                    <select v-html="jingyuanStr" v-model="jingyuanSel"></select>
                  </div>
                </div>
                <div class="floor">
                  <div class="l">
                    <span>枪支：</span>
                    <select v-html="qiangzhiStr" v-model="qiangzhiSel"></select>
                  </div>
                  <div class="r">
                    <span>视频名称：</span>
                    <input type="text" v-model="shipingName"/>
                  </div>
                </div> 
                <div class="over" @click="yanzheng"
                  v-show="!jingyuanSel|| !qiangzhiSel || !shipingName"
                ></div>                
                  <el-upload class="avatar-uploader el-upload--text" 
                    
                    :action="URL"
                    :show-file-list="false" 
                    :on-success="handleVideoSuccess" 
                    :before-upload="beforeUploadVideo" 
                    :on-progress="uploadVideoProcess"
                    :data="messageData"
                  >
                      <video v-if="videoForm.Video !='' && videoFlag == false" 
                        :src="videoForm.Video" class="avatar" controls="controls"
                      >您的浏览器不支持视频播放</video>
                      
                      <i v-if="videoForm.Video =='' && videoFlag == false"  class="el-icon-plus avatar-uploader-icon"></i>
                      <el-progress v-if="videoFlag == true" type="circle" 
                        :percentage="videoUploadPercent" style="margin-top:30px;"
                      ></el-progress>
                  </el-upload>
                  <!-- <P class="text">请保证视频格式正确，且不超过10M</P> -->
              <!-- </el-form-item> -->

            </div>
            <button class="close" @click="close">确定</button>
            <div class="del"  @click="close">X</div>
          </div>
            
        </div>

       


    </div>
</template>
<style scoped>
@import url(./index.css);

</style>
<script>
import breadNav from '@/components/breadnav'
import Content from './children/content'
    export default {
        components:{breadNav,Content},
          data() {
          return {
            URL:this.$store.state.baseURL+"/weixin/project/index.php?m=Home&c=Video&a=upload",
            dataList:[],
            currentNodeKey:'',
            pageTotal:0,
            active_page:1,
             active_title:'',
            selValue:'',
            putValue:'',
            treeListData:[],
            activeHandTreeData:{},
            activeItem:'',
            defaultProps: {
              children: 'child',
              label: 'mechanism_name'
            },
            upDataShow:false,
            videoForm:{
              Video :''
            },
            videoFlag :false,
            percentage:0,
            messageData:{},
            jingyuanStr:'',
            qiangzhiStr:'',
            jingyuanSel:'',
            qiangzhiSel:'',
            shipingName:'',
            t_policeuser_id:'',
            loading:null,
            zhankai:[]
          };
        },
        methods: {
          downloadVidio(){
            let filterDate=this.dataList.filter(e=>e.checked)
            if(!filterDate.length){
              this.$message('请选择要预览的视频')
            }else if(filterDate.length>1){
              this.$message('请单个预览')
            }else{
              console.log(filterDate[0].vurl)
              var link = document.createElement('a');
              link.href=filterDate[0].vurl
              // link.href = window.URL.createObjectURL(filterDate[0].vurl);
              link.target="_blank"
              // link.download = ' '
              link.click();
            }
          },
          upData(){
            this.upDataShow=true
          },
          close(){
            this.upDataShow=false
            this.jingyuanSel='';
            this.qiangzhiSel='';
            this.shipingName='';
            this.videoForm.Video=''
          },
          yanzheng(ev){
             this.$message({
              type:"warning",
              message:"请完善人员信息"
            })
          },
          beforeUploadVideo(file) {
            this.loading = this.$loading({
              lock: true,
              text: "Loading",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)"
            });
             var objs = {
               "policeid":this.jingyuanSel,
               "gun_id":this.qiangzhiSel,
               "org_id":this.activeItem.mechanism_id,
               "vname":this.shipingName,
               "t_policeuser_id":this.t_policeuser_id
             };
            var key = this.$store.state.key;
            var sign = this.$methods.mkSign(objs, key);
            var token = this.$gscookie.getCookie("gun");

            this.messageData.sign = sign;
            this.messageData.token = token;
            this.messageData.policeid=objs.policeid
            this.messageData.gun_id=objs.gun_id
            this.messageData.org_id=objs.org_id
            this.messageData.vname=objs.vname
            this.messageData.t_policeuser_id=objs.t_policeuser_id

            // var params = new URLSearchParams();
            // params.append('sign', sign);
            // params.append('token', token);
            // params.append('policeid', this.jingyuanSel);
            // params.append('gun_id', this.qiangzhiSel);
            // params.append('org_id', this.activeItem.mechanism_id);
            // params.append('vname', this.shipingName);
            //  params.append('t_policeuser_id', this.t_policeuser_id);
            // this.messageData=params

            
              const isLt10M = file.size / 1024 / 1024  < 1000;
              if (['video/mp4', 'video/ogg', 'video/flv','video/avi','video/wmv','video/rmvb'].indexOf(file.type) == -1) {
                  this.$message.error('请上传正确的视频格式');
                  return false;
              }
              if (!isLt10M) {
                  this.$message.error('上传视频大小不能超过1000MB哦!');
                  return false;
              }
          },
          uploadVideoProcess(event, file, fileList){
           
              this.videoFlag = true;
              this.videoUploadPercent = file.percentage.toFixed(0);
              this.videoUploadPercent-=0
          },
          handleVideoSuccess(res, file) {       //获取上传图片地址
            this.loading.close()
              this.videoFlag = false;
              // this.videoUploadPercent = 0;
              if(res.code == 200){
                  // this.videoForm.videoUploadId = res.data.uploadId;
                  // this.videoForm.Video = res.data.uploadUrl;
                  this.videoForm.Video=res[0].vurl
              }else{
                  this.$message.error('视频上传失败，请重新上传！');
              }
              // console.log(this.activeItem.id,this.active_page)
              this.getDataList(this.activeItem.id,this.active_page)
          },

          subSearch(){
            if(!this.selValue){
              this.$message('请选择搜索的文件名')
              return
            }
            if(!this.putValue.trim()){
              this.$message('请输入关键字！')
            }
            this.loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
              });
            this.search()

          },
          changeAll(v){
            this.dataList.forEach(e=>e.checked=v)
          },
          del(){

            let b=this.dataList.filter(e=>e.checked).map(e=>e.id)
            if(!b.length){
              this.$message('请选择您要删除的数据')
              return
            }
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if(b.length==this.dataList.length){
                this.getDataList(this.activeItem.id,this.active_page-1)
                this.active_page-=1
              }
              this.deleteMessage(b)
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });          
            });
          },
          getTreeList(){
                // ......................该组件默认加载树形菜单数据
                var key=this.$store.state.key
                var objs = {p:1,ps:6,mechanism_id:1};
                var sign =  this.$methods.mkSign(objs,key);
                var token=this.$gscookie.getCookie('gun')
                var params = new URLSearchParams();
                params.append('p', objs.p);
                params.append('ps', objs.ps);
                params.append('mechanism_id', objs.mechanism_id);
                params.append('sign',sign);
                params.append('token',token)

                this.$axios({
                    url:this.$store.state.baseURL+'/weixin/project/index.php?m=home&c=mechanism&a=mechanisms_tree',
                    method:'POST',
                    changeOrigin:true,
                    data:params
                }).then((data)=>{
                    this.zhankai.push(data.data.data.list[0].id)
                    this.zhankai.push(data.data.data.list[0].child[0].id || "")
                    if(data.data.data.list[0].child[0].child){
                      this.zhankai.push(data.data.data.list[0].child[0].child[0].id)
                    }
                    this.treeListData=data.data.data.list
                    this.handleNodeClick(this.treeListData[0])//..........主动促发点击事件
                }).catch((error)=>{
                    console.log(error)
                })
                this.hasData=true

            },
             getDataList(jigou_id,active_p=1){   //................获取持录音录像列表信息函数
                if(!jigou_id){
                  jigou_id=this.$gscookie.getCookie('mechanism_id')
                }

                var key=this.$store.state.key
                var objs = {"id":jigou_id,"page":active_p};
                var sign =  this.$methods.mkSign(objs,key);
                var token=this.$gscookie.getCookie('gun')
                var params = new URLSearchParams();
                params.append('id', objs.id);
                params.append('page', objs.page);

                params.append('sign',sign);
                params.append('token',token)
                this.$axios({
                    url:this.$store.state.baseURL+'/weixin/project/index.php?m=home&c=Video&a=index',
                    method:'POST',
                    changeOrigin:true,
                    data:params
                }).then((data)=>{
                  this.loading.close()
                    if(data.data.code==200){
                         this.jingyuanStr=`<option value="" disabled selected hidden>请选择人员</option>`
                         let str1=data.data.pol.map(item=>{
                          return `<option value="${item.id}">${item.uname}</option>`
                        }).join('')
                        
                        this.jingyuanStr+=str1
                        this.qiangzhiStr=`<option value="" disabled selected hidden>请选择枪支</option>`
                        let str2=data.data.guns.map(item=>{
                          return `<option value="${item.id}">${item.gun_code}</option>`
                        }).join('')
                        this.qiangzhiStr+=str2
                        
                      let list=data.data.data.map((item,index)=>{
                        return {
                          ...item,
                          checked:false
                        }
                      })
                        this.dataList=list
                        
                        this.pageTotal=data.data.total-0
                    }
                }).catch((error)=>{
                    console.log(error)
                })
            },
            deleteMessage(vidArr){   //删除信息函数

                var key=this.$store.state.key
                var objs = {"vid":vidArr.join()};
                var sign =  this.$methods.mkSign(objs,key);
                var token=this.$gscookie.getCookie('gun')
                var params = new URLSearchParams();
                params.append('vid', objs.vid);
                params.append('sign',sign);
                params.append('token',token)
                this.$axios({
                    url:this.$store.state.baseURL+'/weixin/project/index.php?m=home&c=Video&a=dele',
                    method:'POST',
                    changeOrigin:true,
                    data:params
                }).then((data)=>{
                    if(data.data.code==200){

                      this.$message({
                        type:"success",
                        message:data.data.msg
                      })
                      this.loading = this.$loading({
                        lock: true,
                        text: "Loading",
                        spinner: "el-icon-loading",
                        background: "rgba(0, 0, 0, 0.7)"
                      });
                      this.getDataList(this.activeItem.id,this.active_page)
                    }
                }).catch((error)=>{
                    console.log(error)
                })
            },
            search(){
              let sel=this.selValue;
              let val=this.putValue;
                var objs={}
                var key=this.$store.state.key
                objs[sel]=val
                var sign =  this.$methods.mkSign(objs,key);
                var token=this.$gscookie.getCookie('gun')
                var params = new URLSearchParams();
                params.append(sel, objs[sel]);

                params.append('sign',sign);
                params.append('token',token)
                this.$axios({
                    url:this.$store.state.baseURL+'/weixin/project/index.php?m=home&c=Video&a=index',
                    method:'POST',
                    changeOrigin:true,
                    data:params
                }).then((data)=>{

                    if(data.data.code==200){

                      let list=data.data.data.map((item,index)=>{
                        return {
                          ...item,
                          checked:false
                        }
                      })
                        this.dataList=list
                        this.pageTotal=data.data.total-0
                        this.selValue=''
                        this.putValue=''
                        this.loading.close()
                    }
                }).catch((error)=>{
                    console.log(error)
                })
            },
            downLoad(id){
                var objs={"vid":id}
                var key=this.$store.state.key
                var sign =  this.$methods.mkSign(objs,key);
                var token=this.$gscookie.getCookie('gun')
                var params = new URLSearchParams();
                params.append('sign',sign);
                params.append('token',token)
                params.append('vid',objs.vid);
                this.$axios({
                    url:this.$store.state.baseURL+'/weixin/project/index.php?m=Home&c=Down&a=download',
                    method:'POST',
                    changeOrigin:true,
                    data:params,
                    responseType: 'blob'
                }).then((data)=>{
                  console.log(data)
                    // var link = document.createElement('a');
                    // link.href = window.URL.createObjectURL(data.data);
                    // link.target="_blank"
                    // link.download = 'filename'
                    // console.log(link)
                    // link.click();
                }).catch((error)=>{
                    console.log(error)
                })
            },
            handleNodeClick(item){//树形菜单点击
            console.log(item)
              this.loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
              });
                this.$refs.page.internalCurrentPage = 1;
                this.activeItem=item             //记录当前激活的树形菜单子项
                this.getDataList(item.id)   
            },
            currentChange(n){//...页码点击
            this.loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
              });
              this.active_page=n
              this.getDataList(this.activeItem.id,n)
            }
        },
        created(){
          this.loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          let item =this.$gscookie.getCookie("message_obj");
          this.t_policeuser_id=item.id
          this.currentNodeKey = this.$gscookie.getCookie("mechanism_id");
            if(item.role_id==3){
              this.$router.push({
                name:'GuiJi'
              })
            }
          this.getTreeList()
          // this.getDataList()
            let str=this.$gscookie.getCookie('gun')
            if(JSON.stringify(str)=="{}"){
                this.$router.push("/loginput")
            }
        },
        
        mounted() {
          this.$store.commit('setStr',{
            str1:'音频视频',
            str2:'数据列表'
          })
        },
        destroyed(){
          this.$store.commit('huanyuanStr')
        }

    }
</script>
