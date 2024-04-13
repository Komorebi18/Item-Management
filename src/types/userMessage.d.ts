// 用户信息基础
export interface PageMessage {
  current: number
  size: number
  total: number
  pages: number
  records: UserMessage[]
}

// 用户信息详情
interface UserMessage {
  id: string
  userId: number
  name: string
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
  'name' | 'phone' | 'regTime' | 'state' | 'loginTime' | 'ip' | 'userOperationLog' | 'userId'
>
