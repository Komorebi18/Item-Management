/**
 * 用户详细数据
 */
export interface IUserInformation {
  /**
   * 头像
   */
  avatar: string
  /**
   * uuid
   */
  id: string
  /**
   * 登录ip
   */
  ip: string
  /**
   * 登录时间
   */
  loginTime: string
  /**
   * 用户名
   */
  username: string
  /**
   * 手机号
   */
  phone: string
  /**
   * 二维码
   */
  qrCode: string
  /**
   * 注册时间
   */
  regTime: string
  /**
   * 性别(0未知1男2女)
   */
  sex: Sex
  /**
   * 特殊用户情况(0非特殊用户1现黑名单用户2曾经是黑名单用户)
   */
  state: number
  /**
   * token
   */
  token: string
  /**
   * 用户id
   */
  userId: number
  /**
   * 用户操作日志
   */
  userOperationLog: string
}

export interface IBlacklistUserInfo {
  /**
   * 黑名单id
   */
  blacklistId: number
  /**
   * 移入黑名单操作的管理员id
   */
  inAdminId: number
  /**
   * 移入操作管理员名称
   */
  inAdminName: string
  /**
   * 移入黑名单图片
   */
  inImages: string[]
  /**
   * 拉入黑名单的原因
   */
  inReason: string
  /**
   * 拉入黑名单的时间
   */
  inTime: string
  /**
   * 移出黑名单操作的管理员id
   */
  outAdminId: number
  /**
   * 移出操作管理员名称
   */
  outAdminName: string
  /**
   * 移出黑名单图片
   */
  outImages: string[]
  /**
   * 取消黑名单的原因
   */
  outReason: string
  /**
   * 移出黑名单时间
   */
  outTime: string
  /**
   * 状态(0未移出黑名单 1表示已经移出黑名单)
   */
  state: number
  /**
   * 黑名单用户id
   */
  userId: number
  /**
   * 用户名称
   */
  username: string
}

/**
 * 用户分组
 */
export interface IUserGroup {
  /**
   * 用户分组id
   */
  groupId: number
  /**
   * 用户分组名称
   */
  groupName: string
}

// 个人日志参数
export interface IQueryParamsOfLog {
  content?: string
  limit: number
  offset: number
}

// 个人日志的起始时间
export interface ILogTime {
  /**
   * 截止时间
   */
  endTime?: null | string
  /**
   * 查询日志记录的起始时间
   */
  startTime?: null | string
}

export interface IPersonalLogDetail {
  /**
   * 操作的ip地址
   */
  address?: null | string
  /**
   * 操作日志内容
   */
  content?: null | string
  id?: number | null
  /**
   * 操作对应的时间
   */
  modifyTime?: null | string
}
