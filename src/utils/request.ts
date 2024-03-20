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
    if (givenTimeStamp - currentTimeStamp < 86400000 && accessTokenState.value === 1) {
      // 刷新token
      // 将accessTokenState置零--标记为过期
      accessTokenState.value = 0
      // 发送请求获取新token
      userStore.updateToken()
    }
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use((response: AxiosResponse) => {
  // 初始化useUserStore实例
  const userStore = useUserStore()
  if (response.data) {
    switch (response.data.code) {
      case 200:
        return response.data
      case 101:
        // 请求拦截器会确保在accessToken过期时发送请求更新token，只有当获取新token的请求也失败时才会进入此逻辑
        userStore.outLogin(true)
        break
      case 400:
        ElMessage({
          message: '客户端异常',
          type: 'error'
        })
        break
      case 401:
        ElMessage({
          message: '账号或密码错误',
          type: 'error'
        })
        break
      case 403:
        ElMessage({
          message: '权限不足,无法访问',
          type: 'error'
        })
        break
      case 404:
        ElMessage({
          message: '您访问资源不存在',
          type: 'error'
        })
        break
      case 500:
        ElMessage({
          message: '服务端异常',
          type: 'error'
        })
        break
    }
  }
})

// 导出 axios 实例
export default http
