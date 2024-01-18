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
import { userInformation } from '@/types/login'

export const getLogin = (data: object) => {
  return http<userInformation>({
    method: 'POST',
    url: '/admin/login',
    data: data
  })
}

// 退出登录
export const outLog = () => {
  return http({
    method: 'POST',
    url: '/admin/logout'
  })
}
