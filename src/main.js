import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入插件
import './plugin'
// 导入全局过滤器
import './filter'
// 导入全局样式
import  './assets/css/global.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
