/**
 * 用户信息
 */
export interface userInformation {
  /**
   * 头像
   */
  avatar?: null | string
  /**
   * 是否属于黑名单(0不是1是)
   */
  black?: Black
  id?: null | string
  /**
   * 用户名
   */
  name?: null | string
  /**
   * 手机号
   */
  phone?: null | string
  /**
   * 二维码
   */
  qrCode?: null | string
  /**
   * 性别(0未知1男2女)
   */
  sex?: Sex
  /**
   * token
   */
  token?: null | string
  /**
   * 用户id
   */
  userId?: number | null
  [property: string]: any
}
