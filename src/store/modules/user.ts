import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getLogin, outLog, fetchToken } from '@/api/login'
import { useStorage } from '@vueuse/core'
import router from '@/router'
import { userInformation, tokenType } from '@/types/login'
export const useUserStore = defineStore('user', () => {
  // 初始化用户数据
  const userInfo = ref<userInformation>({
    adminId: 0,
    roles: [],
    route: '',
    accessToken: '',
    refreshToken: '',
    expiredTime: '',
    username: ''
  })

  // 初始化accessToken
  const token = useStorage<string>('token', '')
  // 初始化refreshToken
  const refreshToken = useStorage<string>('refreshToken', '')
  // 初始化accessToken过期时间
  const refreshTime = useStorage<string>('refreshTime', '')
  // 初始化accessToken状态，1表示未过期，0表示已过期
  const accessTokenState = useStorage<number>('accessTokenState', 0)
  // 初始化refreshToken状态，1表示未过期，0表示已过期
  const refreshTokenState = useStorage<number>('refreshTokenState', 0)
  // 初始化用户权限
  const roles = useStorage<string[]>('roles', [])

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
    // 本地存储赋值
    accessTokenState.value = 1
    refreshTokenState.value = 1
    token.value = res.data.accessToken
    refreshToken.value = res.data.refreshToken
    refreshTime.value = res.data.expiredTime
    roles.value = res.data.roles
  }

  // 退出登录
  const outLogin = async (isTokenExpired: boolean) => {
    if (isTokenExpired) {
      // token过期导致的退出
      ElMessage({
        message: '登录信息过期,请重新登录',
        type: 'error'
      })
    } else {
      // 正常退出需要发送请求告知后台
      await outLog()
    }

    // 移除本地存储相关用户信息
    roles.value = null
    token.value = null
    accessTokenState.value = null
    refreshTokenState.value = null
    refreshToken.value = null
    refreshTime.value = null
    // 重置路由
    router.replace({ path: '/login' })
  }
  // 更新token
  const updateToken = async () => {
    // 获取新token
    const res = await fetchToken()
    // 存储新token
    // 更新userInfo内的token
    userInfo.value.accessToken = res.data.accessToken
    userInfo.value.refreshToken = res.data.refreshToken
    userInfo.value.expiredTime = res.data.expiredTime
    // 更新本地存储的token
    accessTokenState.value = 1
    refreshTokenState.value = 1
    token.value = res.data.accessToken
    refreshToken.value = res.data.refreshToken
    refreshTime.value = res.data.expiredTime
  }
  return {
    userInfo,
    token,
    setLogin,
    outLogin,
    updateToken
  }
})
