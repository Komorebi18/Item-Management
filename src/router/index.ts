import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { clearComponentList } from '@/utils/modal'

export const Layout = () => import('@/layout/index.vue')
// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    //404
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    name: '404',
    meta: {
      title: '404',
      icon: 'error',
      hidden: true
    }
  },
  {
    //403
    path: '/403',
    component: () => import('@/views/error-page/403.vue'),
    name: '403',
    meta: {
      title: '403',
      icon: 'error',
      hidden: true
    }
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true }
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'dashboard',
        meta: { title: '首页', icon: 'home', affix: true, keepAlive: true }
      }
    ]
  }
]

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes as RouteRecordRaw[],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 })
})

// 全局前置守卫
router.afterEach(() => {
  clearComponentList()
})

/**
 * 重置路由
 */
export function resetRouter() {
  router.replace({ path: '/login' })
  location.reload()
}
export default router
