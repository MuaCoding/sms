// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'
import Vuex from 'vuex'
import store from './store'
import axios from './provider/intercept'

import iView from 'iview';
import 'iview/dist/styles/iview.css';

import 'common/scss/index.scss'

import * as filters from "common/js/filters"; //全局过滤器引用

Object.keys(filters).forEach(key => {  // 过滤器定义
  Vue.filter(key, filters[key])
})


Vue.use(iView, {
  transfer: true,
  size: 'large'
});
Vue.use(Vuex);

Vue.config.productionTip = false;
// Vue.prototype.$http = axios;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  axios,
  router,
  store,
  render: h => h(App)
})
