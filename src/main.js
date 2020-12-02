import Vue from 'vue'
import App from './App'
import router from './router'
//全局样式
import './css/global.css'
//全局组件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//阿里图标
import './fonts/iconfont.css'
import axios from 'axios'

Vue.config.productionTip = false
Vue.use(ElementUI);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>' 
})
