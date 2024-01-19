import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { useUserStore } from '@/store/modules/user'
// 创建 axios 实例
const http = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json' }
})

// 请求拦截器
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 初始化useUserStore实例
    const userStore = useUserStore()
    // 获取accessToken
    const token = useStorage<string>('token', '')
    // 获取refreshToken
    const refreshToken = useStorage<string>('refreshToken', '')
    // 获取accessToken状态，1表示未过期，0表示已过期
    const accessTokenState = useStorage<number>('accessTokenState', 0)
    // 获取accessToken过期时间
    const refreshTime = useStorage<string>('refreshTime', '')
    // 在请求头中加入token
    if (token) {
      config.headers.access_token = token.value
    }
    // 请求头中refresh_token去留
    if (accessTokenState.value === 0) {
      // accessToken过期，在请求头添加refresh_token
      config.headers.refresh_token = refreshToken.value
    } else {
      // accessToken未过期，移除refresh_token
      config.headers.refresh_token = ''
    }
    // 刷新token---accessToken未过期，主动更新token
    // 进行时间判断
    const currentTime = new Date()
    const givenTime = new Date(refreshTime.value)
    const currentTimeStamp = currentTime.getTime()
    const givenTimeStamp = givenTime.getTime()
    if (givenTimeStamp - currentTimeStamp < 86400000) {
      // 刷新token
      userStore.updateToken()
    }
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    // 初始化useUserStore实例
    const userStore = useUserStore()
    // 获取accessToken状态，1表示未过期，0表示已过期
    const accessTokenState = useStorage<number>('accessTokenState', 0)
    // 获取refreshToken状态，1表示未过期，0表示已过期
    const refreshTokenState = useStorage<number>('refreshTokenState', 0)
    if (response.data) {
      switch (response.data.code) {
        case 200:
          return response.data
        case 101:
          if (refreshTokenState.value === 1) {
            // 将accessTokenState置零
            accessTokenState.value = 0
            // refreshToken未被判断情况(首先判断accessToken，accessToken过期进入此逻辑，但是refreshToken是否过期未知)
            // 暂时将refreshTokenState置0，若refreshToken未过期，将其重新置1
            refreshTokenState.value = 0
            // 刷新token---accessToken过期，被动更新token
            userStore.updateToken()
          } else {
            // refreshToken过期情况
            userStore.outLogin()
          }
      }
    }

    if ((response.data && response.data.code === 102) || response.data.code === 201) {
      ElMessage({
        message: response.data.msg,
        type: 'error'
      })
      return Promise.reject(new Error(response.data.msg))
    }
    ElMessage.success(response.data.msg)
    return response.data
  },
  (error: any) => {
    return Promise.reject(error.message)
  }
)

// 导出 axios 实例
export default http
