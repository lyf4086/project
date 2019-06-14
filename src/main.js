// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// import apis from './server'
// import md5 from 'js-md5'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
// Vue.use(apis)
// import AMap from 'vue-amap'
// Vue.use(AMap);

import axios from 'axios';
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.post['Content-Type'] = 'application/json';
Vue.prototype.$axios = axios;

import methods from './server'

Vue.use(methods)

import util from './util'

Vue.use(util)

import AMap from 'vue-amap'
Vue.use(AMap);


import gscookie from './cookie'
Vue.use(gscookie)
//echarts
// Vue.use(md5)
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
