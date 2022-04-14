/*
 * @Author: oxygenbottle_ljh 
 * @Date: 2021-12-01 16:49:27 
 * @Last Modified by: oxygenbottle_ljh
 * @Last Modified time: 2021-12-01 17:13:19
 */
module.exports = {
  productionSourceMap: false,
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'assets',
  devServer: {
    port: 8080,
    host: '0.0.0.0',
    https: false,
    open: true
  },
  css: {
    sourceMap: false,
    loaderOptions: {
      scss: {
        // 向全局sass样式传入共享的全局变量, $src可以配置图片cdn前缀
        // 详情: https://cli.vuejs.org/guide/css.html#passing-options-to-pre-processor-loaders
        prependData: `
        @import "@/styles/public.scss";
        $src: "${process.env.VUE_APP_OSS_SRC}";
        `
      }
    }
  },
  chainWebpack: (config) => {

  }
}