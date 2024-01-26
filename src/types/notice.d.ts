/**
 * 返回的数据对象
 */
export interface NoticeList {
  /**
   * 当前页
   */
  current?: number
  /**
   * 总页数
   */
  pages?: number
  /**
   * 分页对象数据
   */
  records?: NoticeItem[]
  /**
   * 每页显示数量
   */
  size?: number
  /**
   * 数量总数
   */
  total?: number
}

/**
 * 分页数据
 */
export interface NoticeItem {
  /**
   * 发布通知的管理员名称
   */
  adminName?: null | string
  /**
   * 浏览量
   */
  browse?: null | number
  /**
   * 审核意见
   */
  comment?: null | string
  /**
   * 系统通知主体内容
   */
  content?: null | string
  /**
   * 系统通知ID
   */
  noticeId?: number
  /**
   * 通知发布时间
   */
  publishTime?: null | string
  /**
   * 发布状态，1为未发送，2为待审核，3为审核通过，4为审核未通过
   */
  state?: number
  /**
   * 系统通知标题
   */
  title?: null | string
  /**
   * 私发通知的目标用户id(广播通知为0)
   */
  userId?: null | number
  /**
   * 用户名
   */
  username?: null | string
}

/**
 * 通知类型
 */
export interface NoticeType {
  /**
   * 通知类型id
   */
  typeId: number
  /**
   * 通知类型名称
   */
  typeName: string
}
