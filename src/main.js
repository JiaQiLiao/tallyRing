// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// import { RadonInstall } from 'radon-ui'
import store from './store'
// import mock from './api/mock'//mock虚拟数据
import axios from './api/https'
// import ElementUI from 'element-ui'
import {Upload} from 'element-ui'

import 'element-ui/lib/theme-default/index.css'
import 'mescroll.js/mescroll.min.css'

import { Toast} from 'mint-ui'
// import Mescroll from  'mescroll.js/mescroll.min.js'
// import VueScroller from  'vue-scroller'
// import Mescroll from  'mescroll.js/mescroll.min.js'
// import 'mescroll.js/mescroll.min.css'
// import 'mint-ui/lib/Toast/style.css'
// import 'radon-ui/dist/radon-ui.css'

Vue.config.productionTip = false

Vue.use(Upload);

// Vue.use(RadonInstall,{
// 	Preview:true
// })
Vue.prototype.axios = axios;
Vue.prototype.Toast = Toast;
// Vue.prototype.Mescroll = Mescroll;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})


