<template>
    <div class="dialog">
         <button class="del" @click="close">X</button>
        <div class="title">月度年度数据分析</div>
        <div class="content">
           <div class="left">
               <div class="tit">月度，年度任务执行排行榜</div>
               <div class="listwrap">
                   <div class="top">
                       <span>单位</span>
                       <span v-for="(item,i) in leftTags" :key="i" :title="item">{{item}}</span>
                       <!-- <span>一级任务</span>
                       <span>二级任务</span>
                       <span>三级任务</span>
                       <span>四级任务</span> -->
                       <!-- <span>操作</span> -->
                   </div>
                   <div class="list">
                       <div class="item" v-for="item in leftList" :key="item.sid">
                            <span>{{item.cname}}</span>
                            <span>{{item.total}}</span>
                            <span v-for="(num,j) in item.number" :key="j">{{num}}</span>
                            <!-- <span>34332</span>
                            <span>5454</span>
                            <span>654544</span> -->
                            <!-- <span>任务列表</span> -->
                        </div>
                   </div>
                   <div class="bottom-chart" id="chart-left"></div>
               </div>
           </div>
           <div class="center">
               <div class="tit">月度，年度报警数据排行榜</div>
               <div class="listwrap">
                   <div class="top">
                       <span>单位</span>
                       <span>报警总数</span>
                       <span v-for="item in centerTags" :key="item.id">{{item.name}}</span>
                       <!-- <span>入套报警</span>
                       <span>预期报警</span>
                       <span>报警范围</span> -->
                   </div>
                   <div class="list">
                       <div class="item" v-for="item in centerList" :key="item.sid">
                            <span>{{item.cname}}</span>
                            <span>{{item.total}}</span>
                            <span v-for="(num,i) in item.number" :key="i">{{num}}</span>
                            <!-- <span>34332</span>
                            <span>5454</span>
                            <span>654544</span> -->
                        </div>
                   </div>
                   <div class="bottom-chart" id="chart-center"></div>
               </div>
           </div>
           <div class="right">
               <div class="tit">月度，年度弹药消耗排行榜</div>
               <div class="listwrap">
                   <div class="top">
                       <span>单位</span>
                       <span>消耗总数</span>
                       <span v-for="item in rightTags" :key="item.vDXingHao">{{item.vDXingHao}}</span>
                       <!-- <span>B类型</span>
                       <span>C类型</span>
                       <span>D类型</span> -->
                   </div>
                   <div class="list">
                       <div class="item" v-for="item in rightList" :key="item.sid">
                            <span>{{item.cname}}</span>
                            <span>{{item.total}}</span>
                            <span v-for="(i,j) in item.number" :key="j">{{i.number||0}}</span>
                            <!-- <span>34332</span>
                            <span>5454</span>
                            <span>654544</span> -->
                        </div>
                   </div>
                   <div class="bottom-chart" id="chart-right"></div>
               </div>
           </div>
        </div>
    </div>
</template>
<script src="./methods.js"></script>
<style lang="less" scoped>

@vw:38.4vw;
@vh:21.6vh;
.dialog{
    box-sizing: border-box;
    border:5/@vw solid #14568c;
    border-radius: 10/@vw;
    position: absolute;
    z-index: 999;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    width:3636/@vw;
    height:1680/@vh;
    padding: 0 76/@vw 0;
    background: rgba(6,37,70,0.9);
    .del{
        position: absolute;
        right:36/@vw;
        top:36/@vh;
        border:none;
        background: none;
        width:30/@vw;
        height:30/@vw;
        color:#93a0af;
        font-size: 36/@vw;
    }
    .title{
        width:3486/@vw;
        height:150/@vh;
        font-size: 50/@vw;
        color:#fff;
        border-bottom: 2/@vh solid #14568c;
        line-height: 150/@vh;
        text-align: center;
        background: url(../../../assets/sucai/line.png) no-repeat center top;
        background-size: 1130/@vw 12/@vh;
    }
    .content{
        box-sizing: border-box;
        position: absolute;
        top:190/@vh;
        width:3486/@vw;
        height:1436/@vh;
        color:#fff;
        font-size: 30/@vw;
       
        // background: url(../../../assets/sucai/content.png) no-repeat;
        // background-size: 100% 100%;
        
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left,.center,.right{
            width:32.6%;
            height:100%;
            // background: pink;
            .tit{
                line-height: 80/@vh;
                font-size: 30/@vw;
                font-weight: bold;
            }
            .listwrap{
                height:1346/@vh;
                border:4/@vw solid #072e4f;
                .bottom-chart{
                    width:100%;
                    height:550/@vh;
                }
                .list{
                    height:720/@vh;
                    overflow: auto;
                }
                .top{
                    width: 100%;
                    height:72/@vh;
                    display: flex;
                    background: #11487f;
                    justify-content: space-around;
                    align-items: center;
                    font-size: 26/@vw;
                    color:#9fb4c8;
                    span{
                        flex:1;
                        box-sizing: border-box;
                        padding: 0 5px;
                        text-align: center;
                        border-right: 1px solid #ccc;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                    span:last-child{
                        border: none;
                    }
                }
                .item{
                     width: 100%;
                    height:72/@vh;
                    display: flex;
                    // background: #11487f;
                    justify-content: space-around;
                    align-items: center;
                    font-size: 26/@vw;
                    color:#fff;
                    span{
                        flex:1;
                        text-align: center;
                        
                    }
                   span:nth-child(1){

                   }
                   span:nth-child(2){
                       color:#4c9cda
                   }
                   span:nth-child(3){
                       color: #28a9bf;
                   }
                   span:nth-child(4){
                       color:#b99155;
                   }
                   span:nth-child(5){
                       color:#e87f5f
                   }
                   span:nth-child(6){
                       color:#2abb60
                   }
                   span:nth-child(7){
                       color:#3aecfd;
                       text-decoration: underline;
                   }
                }
                .item:nth-child(odd){
                    background: #093459;
                }
            }

        }
    }
}

</style>