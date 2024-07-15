import http from '@/utils/request'
import { IAdminMessage, IAdminLog, IAdminRole } from '@/types/acl/index'
import { IPagingData } from '@/types/index'

/**
 * 获取所有管理员信息
 * @param offset  当前页
 * @param limit   每页的数量
 * @param content 搜索关键词
 * return IAdminMessage
 */
export const getAllAdminMessage = (offset: number, limit: number, content: string) => {
  return http<IPagingData<IAdminMessage>>({
    url: '/admin',
    method: 'GET',
    params: {
      offset,
      limit,
      content
    }
  })
}

/**
 * 获取指定管理员日志
 * @param adminId  管理员ID
 * @param offset   请求的数据页码
 * return IAdminLog
 */
export const getAdminLog = (adminId: number, offset: number) => {
  return http<IPagingData<IAdminLog>>({
    url: `/admin/logs/${adminId}`,
    method: 'GET',
    params: {
      offset,
      limit: 10,
      content: ''
    }
  })
}

/**
 * 获取指定管理员权限
 * @param adminId  管理员Id
 * return 权限字符串数组
 */
export const getAdminAuthority = (adminId: number) => {
  return http<string[]>({
    url: `/admin/authority/${adminId}`,
    method: 'GET'
  })
}

/**
 * 添加新管理员
 * @param adminId  管理员Id
 * return 权限字符串数组
 */
export const addNewAdmin = (username: string, code: string, avatar: string) => {
  return http({
    url: `/admin/add`,
    method: 'POST',
    data: {
      username,
      code,
      avatar
    }
  })
}

/**
 * 删除管理员
 * @param adminId  管理员Id
 * return 成功与否
 */
export const deleteAdmin = (adminId: number) => {
  return http({
    url: `/admin/delete/${adminId}`,
    method: 'DELETE'
  })
}

/**
 * 修改管理员权限
 * @param adminId  管理员Id
 * @param roles  管理员角色
 * return 成功与否
 */
export const modifyAdminAuthority = (adminId: number, roles: IAdminRole[]) => {
  return http({
    url: `/admin/modify/${adminId}`,
    method: 'PUT',
    data: roles
  })
}
