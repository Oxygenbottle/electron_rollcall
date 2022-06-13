/*
 * @Author: oxygenbottle_ljh 
 * @Date: 2021-11-26 17:18:52 
 * @Last Modified by: oxygenbottle_ljh
 * @Last Modified time: 2022-05-25 19:54:42
 */
import Vue from 'vue'
import App from './App.vue'
import router from "./routers/router.js"
import _public from './utils/public'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.prototype.$public = _public;
Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')