import http from '@/utils/request'
import type {
  IUserGroup,
  IUserInformation,
  IBlacklistUserInfo,
  IQueryParamsOfLog,
  ILogTime,
  IPersonalLogDetail
} from '@/types/user'
import type { IPagingData } from '@/types/index'
import { PageMessage } from '@/types/userMessage'

/**
 * 获取用户分组列表
 * @returns 用户分组列表
 */
export const getUserGroupList = () => {
  return http<IUserGroup[]>({
    url: `/user/group`,
    method: 'GET'
  })
}

/**
 * 获取用户ID和昵称(部分信息)
 * @param offset 当前页码
 * @param limit 每页数量
 * @param content 搜索内容(用户名，用户uuid,手机号)
 * @returns 用户ID和昵称
 */
export const getUserInformation = (offset: number, limit: number, content: string) => {
  return http<IPagingData<IUserInformation>>({
    url: `/user/page`,
    method: 'GET',
    params: {
      offset,
      limit,
      content
    }
  })
}

/**
 * 获取用户ID和昵称(部分信息)
 * @param offset 当前页码
 * @param limit 每页数量
 * @returns 用户ID和昵称
 */
export const getUserPartialInformation = (offset: number, limit: number) => {
  return http<IPagingData<IUserInformation>>({
    url: `/user/page0`,
    method: 'GET',
    params: {
      offset,
      limit
    }
  })
}

/**
 * 获取黑名单用户信息
 * @param offset 当前页码
 * @param limit 每页数量
 * @param content 搜索内容(用户名，用户uuid,手机号)
 * @returns 用户ID和昵称
 */
export const getBlacklistUser = (offset: number, limit: number, content: string) => {
  return http<IPagingData<IBlacklistUserInfo>>({
    url: `/blacklist`,
    method: 'GET',
    params: {
      offset,
      limit,
      content
    }
  })
}

/**
 * 移入黑名单
 * @param userId 用户Id
 * @param inReason 移入文字依据
 * @param imageUrls 移入图片依据
 * @returns
 */
export const moveInBlacklist = (userId: number, inReason: string, imageUrls: string[]) => {
  return http({
    url: `/blacklist/${userId}`,
    method: 'POST',
    data: {
      inReason,
      imageUrls
    }
  })
}

/**
 * 移入黑名单
 * @param blacklistId 黑名单Id
 * @param outReason 移出文字依据
 * @param imageUrls 移出图片依据
 * @returns
 */
export const moveOutBlacklist = (blacklistId: number, outReason: string, imageUrls: string[]) => {
  return http({
    url: `/blacklist/${blacklistId}`,
    method: 'PUT',
    data: {
      outReason,
      imageUrls
    }
  })
}

export const getPersonalLog = (queryParams: IQueryParamsOfLog, data?: ILogTime) => {
  return http<PageMessage<IPersonalLogDetail>>({
    url: `/admin/logs/my`,
    method: 'GET',
    params: queryParams,
    data
  })
}
