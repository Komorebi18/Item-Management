/**
 * 返回的数据对象
 */
export interface INoticeList {
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
  records: INoticeItem[]
  /**
   * 每页显示数量
   */
  size: number
  /**
   * 数量总数
   */
  total: number
}

/**
 * 分页数据
 */
export interface INoticeItem {
  /**
   * 发布通知的管理员名称
   */
  adminName: string
  /**
   * 浏览量
   */
  browse: number
  /**
   * 审核意见
   */
  comment: string
  /**
   * 系统通知主体内容
   */
  content: string
  /**
   * 通知发送的用户分组id
   */
  groupId: number
  /**
   * 分组名称
   */
  groupName: string
  /**
   * 通知的id
   */
  noticeId: number
  /**
   * 通知发布时间
   */
  publishTime: string
  /**
   * 发布状态，1为未发送，2为待审核，3为审核通过，4为审核未通过，5为正式发布给用户
   */
  state: number
  /**
   * 系统通知标题
   */
  title: string
  /**
   * 通知类型id
   */
  typeId: number
  /**
   * 私发通知的目标用户id(广播通知为0)
   */
  userId: number
  /**
   * 发送的用户id列表
   */
  userIds: number[]
  /**
   * 用户名列表，userid=1时有效
   */
  usernames: string[]
}

/**
 * 通知类型
 */
export interface INoticeType {
  /**
   * 通知类型id
   */
  typeId: number
  /**
   * 通知类型名称
   */
  typeName: string
}

// 时间变量
export const enum TIME {
  /** 全部 */
  ALL,
  /** 近三天 */
  THREE_DAYS,
  /** 近一个周 */
  ONE_WEEK,
  /** 近一个月 */
  ONE_MONTH
}
