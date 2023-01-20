import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入 View
import Login from "@/views/Login";

// 引入 nprogress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'/login',
    name: 'login',
    component: Login
  },
  {
    path: '/user',
    name: 'user',
    component:() => import('../views/user/Main')
  }
]
const router = new VueRouter({
  routes
})

router.beforeEach(((to, from, next) => {
  NProgress.start()
  next()
}))

router.afterEach(() => {
  NProgress.done()
})

export default router
