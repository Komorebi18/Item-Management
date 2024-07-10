// 用户信息基础
export interface PageMessage<T> {
  current: number
  size: number
  total: number
  pages: number
  records: T[]
}

// 用户信息详情
interface UserMessage {
  id: string
  userId: number
  username: string
  phone: string
  avatar: string
  sex: string
  qrCode: string
  regTime: string
  state: number
  loginTime: string
  ip: string
  userOperationLog: string
  token: string
}
// 获取可用用户信息
export type UserMessageDetail = Pick<
  UserMessage,
  'username' | 'phone' | 'regTime' | 'state' | 'loginTime' | 'ip' | 'userOperationLog' | 'userId'
>

interface IUserLogQuery {
  /**
   * 开始时间
   */
  beginTime?: string
  /**
   * 结束时间
   */
  endTime?: string
  /**
   * 大小
   */
  limit: number
  /**
   * 当前
   */
  offset: number
}

// 日志详情
interface IUserLogDetail {
  userId: number
  content: string
  logTime: string
  ip: string
}

// 好友分组信息
interface IFriendDetail {
  /**
   * 添加时间
   */
  addTime?: null | string
  /**
   * 分组名称
   */
  groupName?: null | string
  /**
   * 好友名 + uuid
   */
  name?: null | string
}

// 好友筛选类型
interface IGroupLabel {
  /**
   * 分组名称
   */
  text: string
  /**
   * 分组值
   */
  value: string
}
