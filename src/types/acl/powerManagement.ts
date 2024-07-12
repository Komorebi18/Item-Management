/**
 * 管理员基本信息
 */
export interface IAdminMessage {
  /**
   * 管理员id
   */
  adminId: number
  /**
   * 管理员角色VO列表
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
