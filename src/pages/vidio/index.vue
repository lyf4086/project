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
                     default-expand-all
                    @node-click="handleNodeClick"
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
            layout="prev, pager, next"
            ref="page"
            :total="pageTotal">
            </el-pagination>
        </div>
        <div class="add-del">
            <button>上传</button>
            <button>下载</button>
            <button @click="del">删除</button>
        </div>
        <div class="content" >
            <Content :dataArr="dataList" @changeAll="changeAll"/>
        </div>
        <div class="alert" v-if="false">

               <div class="submit">确认</div>
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
            }
          };
        },
        methods: {
          subSearch(){
            if(!this.selValue){
              this.$message('请选择搜索的文件名')
              return
            }
            if(!this.putValue.trim()){
              this.$message('请输入关键字！')
            }

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
            if(!confirm('确定要删除吗？请三思'))return
            if(b.length==this.dataList.length){
              this.getDataList(this.activeItem.id,this.active_page-1)
              this.active_page-=1

            }
            this.deleteMessage(b)
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
                    if(data.data.code==200){

                      let list=data.data.data.map((item,index)=>{
                        return {
                          ...item,
                          checked:false
                        }
                      })
                        this.dataList=list
                        console.log(data)
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
                    }
                }).catch((error)=>{
                    console.log(error)
                })
            },
            handleNodeClick(item){//树形菜单点击
                this.$refs.page.internalCurrentPage = 1;
                this.activeItem=item             //记录当前激活的树形菜单子项
                this.getDataList(item.id)
                // console.log(item)
            },
            currentChange(n){//...页码点击
              this.active_page=n
              this.getDataList(this.activeItem.id,n)
            }
        },
        created(){
          let item =this.$gscookie.getCookie("message_obj");
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
