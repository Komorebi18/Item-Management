// 腾讯云临时token
export interface ITemporaryToken {
  credentials: ICredentials
  requestId: string
  expiration: string
  startTime: number
  expiredTime: number
}

export interface ICredentials {
  tmpSecretId: string
  tmpSecretKey: string
  sessionToken: string
  token: string
}

/**
 * 返回的数据对象
 */
export interface IPagingData<T> {
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
  records: T[]
  /**
   * 每页显示数量
   */
  size: number
  /**
   * 数量总数
   */
  total: number
}
