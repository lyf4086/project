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
    jiGouId: ''

  },
  mutations: {
    setPoliceId(state, payload) { //设置数据
      state.policeuser_id = payload.policeuser_id;
      state.yeMa = payload.yeMa;
      state.jiGouId = payload.jiGouId
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
