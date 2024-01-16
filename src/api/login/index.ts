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
import http from "@/utils/request";
import { Common, useInformation } from "@/types/login";

export const getLogin = (data: object) => {
  return http<Common<useInformation>>({
    method: "POST",
    url: "/admin/login",
    data: data
  });
};
