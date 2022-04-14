/*
 * @Author: oxygenbottle_ljh 
 * @Date: 2021-11-30 16:35:47 
 * @Last Modified by: oxygenbottle_ljh
 * @Last Modified time: 2021-11-30 18:26:24
 */
import Router from "vue-router";
import Vue from "vue";
Vue.use(Router);

// 重写路由
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  try {
    console.log('封装route', location)
    return originalPush.call(this, location).catch(err => err);
  } catch (error) {
    return;
  }
}

const router = new Router({
  mode: "history",
  routes: [{
      path: "*",
      redirect: "/home"
    },
    {
      path: "/home",
      name: "home",
      component: () => import('@/pages/home.vue'),
      childred: [{
        path: '/demo1',
        name: 'demo1',
        component: () => import('@/pages/page1/page.vue'),
        meta: {
          notLogin: true
        }
      }],
    }, {
      path: '/demo2',
      name: 'demo2',
      component: () => import('@/pages/page1/page2.vue'),
      meta: {
        notLogin: true
      }
    }
  ]
});

export default router