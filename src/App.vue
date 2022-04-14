/*
 * @Author: oxygenbottle_ljh 
 * @Date: 2021-11-30 14:46:58 
 * @Last Modified by: oxygenbottle_ljh
 * @Last Modified time: 2021-12-22 11:00:08
 */
<template>
  <div id="app">
    <router-link :to="{path:'/home'}">H1页面</router-link>
    <router-link :to="{path:'/demo2'}">H2页面</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {},
  created() {},
  mounted() {},
  methods: {

  },
}
</script>

<style>
@import "./styles/public.scss";
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>