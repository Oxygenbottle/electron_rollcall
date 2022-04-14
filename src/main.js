/*
 * @Author: oxygenbottle_ljh 
 * @Date: 2021-11-26 17:18:52 
 * @Last Modified by: oxygenbottle_ljh
 * @Last Modified time: 2021-12-01 17:59:02
 */
import Vue from 'vue'
import App from './App.vue'
import router from "./routers/router.js"


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')