/**
 * 返回的数据对象
 */
export interface Data {
  /**
   * 当前页
   */
  current: number
  /**
   * 总页数
   */
  pages: number
  /**
   * 分页对象数据
   */
  records: UserInformation[]
  /**
   * 每页显示数量
   */
  size: number
  /**
   * 数量总数
   */
  total: number
  [property: string]: any
}

/**
 * 用户详细数据
 */
export interface UserInformation {
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
  name: string
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

/**
 * 用户分组
 */
export interface UserGroup {
  /**
   * 用户分组id
   */
  groupId: number
  /**
   * 用户分组名称
   */
  groupName: string
}
