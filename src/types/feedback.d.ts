import { Common } from './login.d'
// 基本类型
// export interface Common<T> {
//   code: number
//   msg: string
//   data: T
// }

// 用户反馈基本类型
export interface FeedBack {
  /**
   *当前页
   */
  current: number
  /**
   * 每页显示数量
   */
  size: number
  /**
   * 数量总数
   */
  total: number
  /**
   * 总页数
   */
  pages: number
  records: FeedBackInfo[]
}

// 用户反馈类型
export interface FeedBackInfo {
  /**
   * 反馈Id
   */
  feedbackId: number
  /**
   * 反馈者
   */
  userId: number
  /**
   * 反馈者用户名称
   */
  username: string
  /**
   * 反馈标题
   */
  title: string
  /**
   * 反馈内容
   */
  content: string
  /**
   * 反馈时间
   */
  feedTime: string
  /**
   * 是否已读
   */
  haveRead: string
  /**
   * 反馈图片ID
   */
  feedbackImageId: number[]
  /**
   * 反馈图片数组
   */
  imageUrl: string[]
  /**
   * uuid
   */
  uuid: number
  /**
   * 反馈类型
   */
  type: number
  /**
   * 是否已读( 0 未读 1 已读)
   */
  state: string
  /**
   * 版本号
   */
  version: string
}

/**
 * 回复类型
 */
export interface ReplyInfo {
  title: string
  content: string
  userId: number
  groupId: number
  typeId: number
}
