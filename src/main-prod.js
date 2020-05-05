import Vue from 'vue'
import App from './App.vue'
import router from './router'
/* import './plugins/element.js' */
/* 导入全局样式表 */
import './assets/css/global.css'
/* 导入字体图标样式表 */
import './assets/fonts/iconfont.css'
/* 导入axios */
import axios from 'axios'
// 导入nprogress的js和css
import NProgress from 'nprogress'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 引入table-with-tree-grid
import TreeTable from 'vue-table-with-tree-grid'
// import vueSwiper from 'vue-awesome-swiper' // 引入vue-awesome-swiper
// import 'swiper/dist/css/swiper.css' // 引入样式
// Vue.use(vueSwiper)
/* 配置请求根路径 */
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
/* 请求拦截器 */
/* 在request显示京都条 */
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
/* 在response中隐藏进度条 */
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
/* 挂载到vue的原型对象上 */
Vue.prototype.$http = axios
Vue.config.productionTip = false
// 手动注册为组件
Vue.component('tree-table', TreeTable)
// 全局注册富文本编辑器

Vue.use(VueQuillEditor)
// 定义全局过滤器
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
