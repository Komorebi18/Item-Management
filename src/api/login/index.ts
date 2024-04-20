// import mockservice from '@/utils/mockservice'

// export const getLogin = (data: object) => {
//   return mockservice({
//     method: 'post',
//     url: '/login',
//     data
//   })
// }
// export const getRegister = (data: object) => {
//   return mockservice({
//     method: 'post',
//     url: '/register',
//     data
//   })
// }
import http from '@/utils/request'
import { userInformation, tokenType } from '@/types/login'

// 登录获取信息
export const getLoginAPI = (data: object) => {
  return http<userInformation>({
    method: 'POST',
    url: '/admin/login',
    data: data
  })
}

// 登录获取信息
export const fetchTokenAPI = () => {
  return http<tokenType>({
    method: 'GET',
    url: '/admin/refresh'
  })
}

// 退出登录
export const outLoginAPI = () => {
  return http({
    method: 'POST',
    url: '/admin/logout'
  })
}
