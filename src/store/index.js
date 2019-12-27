import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

let store = new Vuex.Store({
  state: {
    key: '4678245fdf468c45d961a77b842e7f19',
    token: '111111',
    prefix_on: '', //...登陆时获得状态
    jigouTreeStr: '',
    role_id: '',
    policeuser_id: '',
    yeMa: '',
    jiGouId: '',
    str1: '全部枪支',
    str2: '使用情况汇总',
    // baseURL: "http://50.144.192.33",//盐城服务器
    // lixianStr:"http://50.144.192.33:9002",//盐城地图服务器

    // baseURL:'http://192.168.1.149',//公司离线服务器
    // lixianStr:'http://192.168.1.149:9002',//公司离线地图服务器

    // baseURL:'http://192.168.1.100',//临时离线服务器
    // lixianStr:'http://192.168.1.100:9002',//临时离线地图服务器

    baseURL:'http://s.tronl.cn',//公司在线服务器    
    zaixian:true,//默认是在线状态，关于地图的都走在线地图
    // liXianMapKey:'bigemap.05n2uuzz',//地图key,盐城
    liXianMapKey:'bigemap.ap8r91ep',//地图key，北京
    lixianMapCenter:[40.2,116.37],//北京,昌平区
    // lixianMapCenter:[33.3253895, 120.2956706],//盐城
  },
  mutations: {
    setMapKey(state,payload){//动态设置地图key
      state.liXianMapKey=payload.key
      state.lixianMapCenter=JSON.parse(payload.center)
    },
    setStr(state, payload) {
      state.str1 = payload.str1;
      state.str2 = payload.str2
    },
    huanyuanStr(state, payload) {
      state.str1 = '全部枪支';
      state.str2 = '使用情况汇总';
    },
    setPoliceId(state, payload) { //设置数据
      state.policeuser_id = payload.policeuser_id;
      state.yeMa = payload.yeMa||'';
      state.jiGouId = payload.jiGouId||''
    },
    emptyNumber(state, payload) { //...还原数据
      state.yeMa = '';
      state.jiGouId = ''
    },
    setPreFix(state, payload) {
      state.prefix_on = payload.prefix_on
    }
  },
  actions: {
   
  }

})

store.watch((mutstions, store) => {

}, () => {

}, {
    deep: true
  })


export default store
