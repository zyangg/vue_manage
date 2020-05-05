import Vue from 'vue'
import VueRouter from 'vue-router'
// import Users from '../components/user/Users.vue'
const Users = () => import(/* webpackChunName: "users" */ '../components/user/Users.vue')
// import Rights from '../components/power/Rights'
const Rights = () => import(/* webpackChunName: "users" */ '../components/power/Rights.vue')
// import Roles from '../components/power/Roles'
const Roles = () => import(/* webpackChunName: "users" */ '../components/power/Roles.vue')
// import Cate from '../components/goods/Cate'
const Cate = () => import(/* webpackChunName: "goods" */ '../components/goods/Cate')
// import Params from '../components/goods/Params'
const Params = () => import(/* webpackChunName: "goods" */ '../components/goods/Params')
// import List from '../components/goods/List'
const List = () => import(/* webpackChunName: "goods" */ '../components/goods/List')
// import Add from '../components/goods/Add'
const Add = () => import(/* webpackChunName: "goods" */ '../components/goods/Add')
// import Order from '../components/order/Order'
const Order = () => import(/* webpackChunName: "goods" */ '../components/order/Order')
// import Report from '../components/report/Report'
const Report = () => import(/* webpackChunName: "goods" */ '../components/report/Report')
// import Login from '../components/Login.vue'
const Login = () => import(/* webpackChunName: "login_home_welcome" */ '../components/Login.vue')
// import Home from '../components/Home.vue'
const Home = () => import(/* webpackChunName: "login_home_welcome" */ '../components/Home.vue')
// import Welcome from '../components/Welcome.vue'
const Welcome = () => import(/* webpackChunName: "login_home_welcome" */ '../components/Welcome.vue')
Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/login'
},
{
  path: '/login',
  component: Login
},
{
  path: '/home',
  component: Home,
  redirect: '/welcome',
  children: [
    { path: '/welcome', component: Welcome },
    { path: '/users', component: Users },
    { path: '/rights', component: Rights },
    { path: '/roles', component: Roles },
    { path: '/categories', component: Cate },
    { path: '/params', component: Params },
    { path: '/goods', component: List },
    { path: '/goods/add', component: Add },
    { path: '/orders', component: Order },
    { path: '/reports', component: Report }
  ]
}
]

const router = new VueRouter({
  routes
})
// 为路由对象，添加beforeeach导航守卫
router.beforeEach((to, from, next) => {
  // 如果访问登录页 直接放行
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token就跳转回登录页
  if (!tokenStr) return next('/login')
  next()
})

export default router
