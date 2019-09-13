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
    str1: '全国枪支',
    str2: '使用情况汇总',
    baseURL: "http://s.tronl.cn",
    lixianStr:"http://192.168.1.107:9000"

  },
  mutations: {
    setStr(state, payload) {
      state.str1 = payload.str1;
      state.str2 = payload.str2
    },
    huanyuanStr(state, payload) {
      state.str1 = '全国枪支';
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
