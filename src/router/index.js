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
const whiteList = ['/login','/404']

router.beforeEach(((to, from, next) => {
  NProgress.start()
  // debugger
  const token = window.sessionStorage.getItem('token') || window.localStorage.getItem('token')
  if(token){
    if(to.path === '/login' && from.path!== '/'){
      next(from.path)
    }else {
      next()
    }
  }else {
    if(whiteList.indexOf(to.path) > -1){
      next()
    }else {
      next('/login')
    }
  }
  NProgress.done()
}))

router.afterEach(() => {
  NProgress.done()
})

export default router
