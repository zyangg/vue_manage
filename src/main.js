import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
/* 导入全局样式表 */
import './assets/css/global.css'
/* 导入字体图标样式表 */
import './assets/fonts/iconfont.css'
/* 导入axios */
import axios from 'axios'
// import vueSwiper from 'vue-awesome-swiper' // 引入vue-awesome-swiper
// import 'swiper/dist/css/swiper.css' // 引入样式
// Vue.use(vueSwiper)
/* 配置请求根路径 */
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
/* 请求拦截器 */
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
/* 挂载到vue的原型对象上 */
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
