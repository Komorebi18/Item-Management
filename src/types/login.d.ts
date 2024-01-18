/**
 * 基础类型
 */
export interface Common<T> {
  code: number
  msg: string
  data: T
}
/**
 * 用户信息
 */
export interface userInformation {
  adminId: number
  username: string
  roles: string[]
  token: string
  route: string
}
