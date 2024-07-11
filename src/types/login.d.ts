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
export interface IUserLoginInfo {
  adminId: number
  username: string
  roles: string[]
  avatar: string
  accessToken: string
  refreshToken: string
  expiredTime: string
  route: string
}

/**
 * token相关信息
 */
export interface tokenType {
  accessToken: string
  refreshToken: string
  expiredTime: string
}
