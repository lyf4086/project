<template>
  <div>
    <div class="up">
      <div class="number_wrap" @click="openDialog" :title="`${cityName}枪支总量`">
        <div class="name nowrap">{{cityName}}枪支总量</div>
        <div class="num">{{numbers.toal||0}}</div>
        <div class="chart"></div>
      </div>
      <div class="number_wrap" @click="openDialog" :title="`${cityName}在库枪支总量`">
        <div class="name nowrap">{{cityName}}在库枪支总量</div>
        <div class="num">{{numbers.zaiwei||0}}</div>
        <div class="chart"></div>
      </div>
      <div class="number_wrap" @click="openDialog" :title="`${cityName}出库枪支总量`">
        <div class="name nowrap">{{cityName}}出库枪支总量</div>
        <div class="num">{{numbers.nowei||0}}</div>
        <div class="chart"></div>
      </div>
    </div>
    <div class="down">
       
      <div id="chart" @click="downClick" style="width:100%;height:85%;"></div>
      <div class="dipan"></div>
       
    </div>
  </div>
</template>
<script>
// import '../../node_modules/echarts/map/js/world.js'
import 安徽 from './geojson/安徽省.json'
import 北京 from './geojson/北京市.json'
import 福建 from './geojson/福建省.json'
import 甘肃 from './geojson/甘肃省.json'
import 广东 from './geojson/广东省.json'
import 广西 from './geojson/广西壮族自治区.json'
import 贵州 from './geojson/贵州省.json'
import 海南 from './geojson/海南省.json'
import 黑龙江 from './geojson/黑龙江省.json'
import 湖北 from './geojson/湖北省.json'
import 湖南 from './geojson/湖南省.json'
import 吉林 from './geojson/吉林省.json'
import 江苏 from './geojson/江苏省.json'
import 江西 from './geojson/江西省.json'
import 辽宁 from './geojson/辽宁省.json'
import 内蒙古 from './geojson/内蒙古自治区.json'
import 青海 from './geojson/青海省.json'
import 山东 from './geojson/山东省.json'
import 山西 from './geojson/山西省.json'
import 陕西 from './geojson/陕西省.json'
import 台湾 from './geojson/台湾省.json'
import 西藏 from './geojson/西藏自治区.json'
import 新疆 from './geojson/新疆维吾尔自治区.json'
import 云南 from './geojson/云南省.json'
import 浙江 from './geojson/浙江省.json'
import 重庆 from './geojson/重庆市.json'
import 河北 from './geojson/河北省.json'
import 河南 from './geojson/河南省.json'
import 四川 from './geojson/四川省.json'
let GEO={
    安徽:安徽,
    北京,
    福建,
    甘肃,
    广东,
    广西,
    贵州,
    海南,
    黑龙江,
    湖北,
    湖南,
    吉林,
    江苏,
    江西,
    辽宁,
    内蒙古,
    青海,
    山东,
    山西,
    陕西,
    台湾,
    西藏,
    新疆,
    云南,
    浙江,
    重庆,
    河北,
    河南,
    四川
}
import {cityNames} from './apis'
export default {
    props:{
        numbers:{
            type:Object,
            required:true
        },
        cityName:{
            type:String,
            required:true
        }
    },
  data() {
    return {
        next:'',
        timer:true,
        clickMap:false,
        citylist:[
          {name:"北京",value:199,a:2,b:2},
          {name:"天津",value:42},
          {name:"河北",value:102},
          {name:"山西",value:81},
          {name:"内蒙古",value:47},
          {name:"辽宁",value:67},
          {name:"吉林",value:82},
          {name:"黑龙江",value:123},
          {name:"上海",value:24},
          {name:"江苏",value:92},
          {name:"浙江",value:114},
          {name:"安徽",value:109},
          {name:"福建",value:116},
          {name:"江西",value:91},
          {name:"山东",value:119},
          {name:"河南",value:137},
          {name:"湖北",value:116},
          {name:"湖南",value:114},
          {name:"重庆",value:91},
          {name:"四川",value:125},
          {name:"贵州",value:62},
          {name:"云南",value:83},
          {name:"西藏",value:9},
          {name:"陕西",value:80},
          {name:"甘肃",value:56},
          {name:"青海",value:10},
          {name:"宁夏",value:18},
          {name:"新疆",value:180},
          {name:"广东",value:123},
          {name:"广西",value:59},
          {name:"海南",value:14},
          ],
          activeCity:'',
          isQuanguo:true,//默认式全国状态
    };
  },
  methods: {
      cityNames,
      downClick(){
          setTimeout(()=>{
              if(this.clickMap){
                  console.log('点击地图了',this.activeCity)
                  if(!this.activeCity)return
                  this.isQuanguo=false
                let name=this.activeCity
                let city=this.citylist.find(item=>item.name==name)
                this.$emit('changeCity',{name:city.name,id:city.id})
              }else{
                  console.log('没有点击地图')

                //避免多次点击
                this.activeCity=''
                  this.initchart('china','');
                  if(!this.isQuanguo){
                      this.$emit('changeCity',{name:'全国',id:''})
                     this.isQuanguo=true
                  }
                  
              }
              this.clickMap=false
          },200)
      },
      
     openDialog(){
         this.$emit('openDialog','dialog11')
     },
     initchart(mapName='china',JSON) {//暂时省份用死数据
        let that=this
      let box1 = document.getElementById("chart");
      let myChart = this.$echarts.init(box1);
   
      var data =this.citylist
      var geoCoordMap = {};
      var toolTipData = [ 
        //   {name:"北京",value:[{name:"科技人才总数",value:95},{name:"理科",value:82}]},
        //   {name:"天津",value:[{name:"文科",value:22},{name:"理科",value:20}]},
        //   {name:"河北",value:[{name:"文科",value:60},{name:"理科",value:42}]},
        //   {name:"山西",value:[{name:"文科",value:40},{name:"理科",value:41}]},
        //   {name:"内蒙古",value:[{name:"文科",value:23},{name:"理科",value:24}]},
        //   {name:"辽宁",value:[{name:"文科",value:39},{name:"理科",value:28}]},
        //   {name:"吉林",value:[{name:"文科",value:41},{name:"理科",value:41}]},
        //   {name:"黑龙江",value:[{name:"文科",value:35},{name:"理科",value:31}]},
        //   {name:"上海",value:[{name:"文科",value:12},{name:"理科",value:12}]},
        //   {name:"江苏",value:[{name:"文科",value:47},{name:"理科",value:45}]},
        //   {name:"浙江",value:[{name:"文科",value:57},{name:"理科",value:57}]},
        //   {name:"安徽",value:[{name:"文科",value:57},{name:"理科",value:52}]},
        //   {name:"福建",value:[{name:"文科",value:59},{name:"理科",value:57}]},
        //   {name:"江西",value:[{name:"文科",value:49},{name:"理科",value:42}]},
        //   {name:"山东",value:[{name:"文科",value:67},{name:"理科",value:52}]},
        //   {name:"河南",value:[{name:"文科",value:69},{name:"理科",value:68}]},
        //   {name:"湖北",value:[{name:"文科",value:60},{name:"理科",value:56}]},
        //   {name:"湖南",value:[{name:"文科",value:62},{name:"理科",value:52}]},
        //   {name:"重庆",value:[{name:"文科",value:47},{name:"理科",value:44}]},
        //   {name:"四川",value:[{name:"文科",value:65},{name:"理科",value:60}]},
        //   {name:"贵州",value:[{name:"文科",value:32},{name:"理科",value:30}]},
        //   {name:"云南",value:[{name:"文科",value:42},{name:"理科",value:41}]},
        //   {name:"西藏",value:[{name:"文科",value:5},{name:"理科",value:4}]},
        //   {name:"陕西",value:[{name:"文科",value:38},{name:"理科",value:42}]},
        //   {name:"甘肃",value:[{name:"文科",value:28},{name:"理科",value:28}]},
        //   {name:"青海",value:[{name:"文科",value:5},{name:"理科",value:5}]},
        //   {name:"宁夏",value:[{name:"文科",value:10},{name:"理科",value:8}]},
        //   {name:"新疆",value:[{name:"文科",value:36},{name:"理科",value:31}]},
        //   {name:"广东",value:[{name:"文科",value:63},{name:"理科",value:60}]},
        //   {name:"广西",value:[{name:"文科",value:29},{name:"理科",value:30}]},
        //   {name:"海南",value:[{name:"文科",value:8},{name:"理科",value:6}]},
      ];

      /*获取地图数据*/
      // myChart.showLoading();
      // var mapFeatures = this.$echarts.getMap(mapName).geoJson.features;
      // myChart.hideLoading();
      // mapFeatures.forEach(function(v) {
      //     // 地区名称
      //     var name = v.properties.name;
      //     // 地区经纬度
      //     geoCoordMap[name] = v.properties.cp;

      // });

    //   console.log(data)
    //   console.log(toolTipData)
      var max = 480,
          min = 9; // todo 
      var maxSize4Pin = 100,
          minSize4Pin = 20;

      var convertData = function(data) {
          
          var res = [];
          for (var i = 0; i < data.length; i++) {
              var geoCoord = geoCoordMap[data[i].name];
              if (geoCoord) {
                  res.push({
                      name: data[i].name,
                      value: geoCoord.concat(data[i].value),
                  });
              }
          }
          return res;
      };
      let option = {
          tooltip: {
              padding: 0,
              enterable: true,
              transitionDuration: 0,
              backgroundColor:'none',
              textStyle: {
                  color: '#000',
                  decoration: 'none',
              },
              position: function (point, params, dom, rect, size) {
                return [point[0]-140, point[1]-200];
              },
              formatter: function(params) {
                  var tipHtml = '';
                  let img1=require('@/assets/sucai/dongtu/map_yuanhuan.png')
                  let img2=require('@/assets/sucai/map_zhushi.png')
                  tipHtml=`
                  <div style="width: 300px;height:167px;position:relative;
                  background: url(${img2});background-size: 100% 100%;">
                      <div style="position:absolute;top:18px;left:10px;width: 90px;height:90px;color:#ffd496;
                      background: url(${img1});background-size: 100% 100%;box-sizing:border-box;padding:27px 0 0 32px" >
                          <p style="padding:0;margin:0;line-height: 20px;">预警</p>
                          <p style="padding:0;margin:0;line-height: 20px;">信息</p>
                      </div>
                      <div style="width:160px;height:90px;position: absolute;right:15px;top:20px;color:#ffffff;font-size: 12px;">
                          <p style="padding:0;margin:0;line-height: 20px;"><span style="font-size: 13px;color:#b8c2cb">预警地区&nbsp; </span><span> ${params.name||'暂无数据'}</span></p>
                          <p style="padding:0;margin:0;line-height: 20px;"><span style="font-size: 13px;color:#b8c2cb">预警时间&nbsp; </span><span> 2020-01-10</span></p>
                          <p style="padding:0;margin:0;line-height: 20px;"><span style="font-size: 13px;color:#b8c2cb">预警地点&nbsp; </span><span> ${params.name||'暂无数据'}</span></p>
                          <p style="padding:0;margin:0;line-height: 20px;"><span style="font-size: 13px;color:#b8c2cb">预警人口&nbsp; </span><span> ${params.value||'暂无数据'}</span></p>
                      </div>
                  </div>
                  `
                  return tipHtml;
              }
              
          },
        
          visualMap: {
              show: false,
              min: 0,
              max: 200,
              left: '10%',
              top: 'bottom',
              calculable: true,
              seriesIndex: [1],
              inRange: {
                  color: ['#04387b', '#467bc0'] // 蓝绿
              }
          },
          geo: {
              show: true,
              map: mapName,//显示哪个区域，全国或者省份
              label: {
                  normal: {
                      show: false
                  },
                  emphasis: {
                      show: false,
                  }
              },
              roam: false,//地图拖拽
              itemStyle: {
                  normal: {
                    areaColor:'rgba(44,192,255,0.32)',
                      borderWidth: 1,
                    // borderColor:'#18dbe4',
                    borderColor:'#2ca2f4',
                    shadowColor: '#D79D3D',
                    
                  },
                  emphasis: {
                      areaColor: '#33a0ea',
                      shadowColor: '#e79c6e',
                      shadowOffsetY: 5,
                      shadowOffsetX: 3
                  }
              }
            
          },
          series: [{
                  name: '散点',
                  type: 'scatter',
                  coordinateSystem: 'geo',
                  data: convertData(data),
                  symbolSize: function(val) {
                      return val[2] / 10;
                  },
                  label: {
                      normal: {
                          formatter: '{b}',
                          position: 'right',
                          show: true
                      },
                      emphasis: {
                          show: true
                      }
                  },
                  
                  itemStyle: {
                      normal: {
                          color: '#fff'
                      }
                  }
              },
              {
                  type: 'map',
                  map: mapName,
                  geoIndex: 0,
                  aspectScale: 0.75, //长宽比
                  showLegendSymbol: false, // 存在legend时显示
                  label: {
                      normal: {
                          show: true
                      },
                      emphasis: {
                          show: false,
                          textStyle: {
                              color: '#fff'
                          }
                      }
                  },
                  roam: true,
                  itemStyle: {
                      normal: {
                          areaColor: '#031525',
                          borderColor: '#3B5077',
                      },
                      emphasis: {
                          areaColor: '#2B91B7'
                      }
                  },
                  animation: false,
                  data: data
              },
              {
                  name: '点',
                  type: 'scatter',
                  coordinateSystem: 'geo',
                  zlevel: 6,
              },
              {
                  name: 'Top 5',
                  type: 'effectScatter',
                  coordinateSystem: 'geo',
                  data: convertData(data.sort(function(a, b) {
                      return b.value - a.value;
                  }).slice(0, 10)),
                  symbolSize: function(val) {
                      return val[2] / 10;
                  },
                  showEffectOn: 'render',
                  rippleEffect: {
                      brushType: 'stroke'
                  },
                  hoverAnimation: true,
                  label: {
                      normal: {
                          formatter: '{b}',
                          position: 'top',
                          show: false
                      }
                  },
                  itemStyle: {
                      normal: {
                          color: 'yellow',
                          shadowBlur: 10,
                          shadowColor: 'yellow'
                      }
                  },
                  zlevel: 1
              },

          ]
      };
      if(JSON){
          this.$echarts.registerMap(mapName, JSON);
      }
      myChart.setOption(option);
      myChart.on('click',(ev)=>{
          that.clickMap=true
          if(!that.timer)return
          if(!ev.name){
              return
          }
          
            this.activeCity=ev.name
            this.$emit('changeCity',{name:ev.name})
            that.initchart('',GEO[ev.name]);
            that.timer=false
            setTimeout(()=>{//避免地图多次渲染
                that.timer=true
            },2000)
         
      })
    }
  },
  created(){
      this.cityNames().then(res=>{
            if(res.status==200){
               this.citylist=res.data
                this.initchart('china','');
            }
        })
  },
  mounted() {
     
    window.onresize = () => {
        let barchart = this.$echarts.getInstanceByDom(document.getElementById('chart'));
        barchart.resize();
    }
    
  },
  
};
</script>
<style lang="less" scoped>
@import url("./center.less");
</style>