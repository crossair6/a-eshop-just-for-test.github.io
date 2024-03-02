import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store/index.js'
// const route = useRoute()
const routes = [
  // 一级路由
  {
    path: '/',
    component: () => import('@/views/Layout.vue'),
    children: [
      { path: '/', component: () => import('@/views/home/index.vue') },
      { path: '/category/:id', component: () => import('@/views/category/index.vue') },
      { path: '/category/sub/:id', component: () => import('@/views/category/Sub.vue') },
      { path: '/goods/:id', component: () => import('@/views/goods/index.vue') },
      { path: '/cart', component: () => import('@/views/cart/index.vue') },
      { path: '/member/checkout', component: () => import('@/views/member/pay/Checkout.vue') },
      { path: '/member/pay', component: () => import('@/views/member/pay/index.vue') },
      { path: '/images', component: () => import('@/views/images/index.vue') },
      {
        path: '/member',
        component: () => import('@/views/member/Layout.vue'),
        children: [
          { path: '/member', component: () => import('@/views/member/home/index.vue') },
          { path: '/member/order', component: () => import('@/views/member/order/index.vue') },
          { path: '/member/order/:id', component: () => import('@/views/member/order/detail/index.vue') },
          { path: '/member/address', component: () => import('@/views/member/address/index.vue') },
          { path: '/member/user', component: () => import('@/views/member/user/index.vue') },
          {
            path: '/member/:catchAll(.*)', component: () => import('@/views/404/index.vue')
          }
        ]
      }
    ]
  }, {
    path: '/login',
    component: () => import('@/views/login/index.vue')

  },
  {
    path: '/:catchAll(.*)',
    component: () => import('@/views/404/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 每次切换路由的时候滚动到页面顶部
  scrollBehavior() {
    // vue2.0 x y
    // vue3.0 left top
    return { left: 0, top: 0 }
  },
  linkExactActiveClass: 'active'
})
// 前置导航守卫
router.beforeEach((to, from, next) => {
  // 需要登录的路由为以 /member 开头的路由
  if (!store.state.user.profile.token && to.path.startsWith('/member')) {
    next({ path: '/login', query: { redirectUrl: to.fullPath } })
    return
  }
  next()
})
export default router
