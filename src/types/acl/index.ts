/**
 * 管理员基本信息
 */
export interface IAdminMessage {
  /**
   * 管理员id
   */
  adminId: number
  /**
   * 管理员权限列表
   */
  roles: IAdminPower[]
  /**
   * 管理员名称
   */
  username: string
}

/**
 * 管理员所拥有的权限
 */
export interface IAdminPower {
  /**
   * 权限信息
   */
  content: string
  /**
   * 角色id
   */
  roleId: number
  /**
   * 0为未拥有的权限，1为拥有
   */
  status: number
}

/**
 * 管理员操作日志
 */
export interface IAdminLog {
  /**
   * 本条日志的ID
   */
  id: number
  /**
   * 操作的ip地址
   */
  address: string
  /**
   * 操作日志内容
   */
  content: string
  /**
   * 操作对应的时间
   */
  modifyTime: string
}

/**
 * 管理员权限
 */
export interface IAdminRole {
  /**
   * 权限id
   */
  roleId: number
  /**
   * 权限状态，0为不拥有，1为拥有
   */
  status: number
}
