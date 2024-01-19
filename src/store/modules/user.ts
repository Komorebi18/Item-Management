import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getLogin, outLog } from '@/api/login'
import { useStorage } from '@vueuse/core'
import router from '@/router'
import { userInformation } from '@/types/login'
export const useUserStore = defineStore('user', () => {
  // 初始化数据
  const userInfo = ref<userInformation>({
    adminId: 0,
    roles: [],
    route: '',
    accessToken: '',
    refreshToken: '',
    expiredTime: '',
    username: ''
  })
  const token = useStorage<string>('token', '')

  // 登录，初始化信息
  const setLogin = async (data: object) => {
    const res = await getLogin(data)
    // 储存接口响应信息
    userInfo.value.adminId = res.data.adminId
    userInfo.value.roles = res.data.roles
    userInfo.value.route = res.data.route
    userInfo.value.username = res.data.username
    userInfo.value.accessToken = res.data.accessToken
    userInfo.value.refreshToken = res.data.refreshToken
    userInfo.value.expiredTime = res.data.expiredTime
    token.value = res.data.accessToken
  }

  // 退出登录
  const outLogin = async () => {
    // await outLog()
    token.value = ''
    // 重置路由
    router.replace({ path: '/login' })
  }
  return {
    userInfo,
    token,
    setLogin,
    outLogin
  }
})
