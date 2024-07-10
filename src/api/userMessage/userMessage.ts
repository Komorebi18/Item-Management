import {
  IFriendDetail,
  IUserLogDetail,
  IUserLogQuery,
  PageMessage,
  UserMessage
} from '@/types/userMessage'
import http from '@/utils/request'

/**
 *分页获取用户信息(可搜索)
 * @param offset 当前页码
 * @param limit 每页数量
 * @param content 搜索内容(用户名，用户uuid,手机号)
 * @returns
 */
export const getUserMessage = (offset: number, limit: number, content?: string) => {
  return http<PageMessage<UserMessage>>({
    method: 'GET',
    url: '/user/page',
    params: {
      offset,
      limit,
      content
    }
  })
}

/**
 * 通过用户 ID 获取日志(物品日志，好友日志，登录日志)
 * @param useId 用户 ID
 * @param params IUserLogQuery
 * @returns
 */
export const getUserLog = (userId: number, params: IUserLogQuery) => {
  return http<PageMessage<IUserLogDetail>>({
    method: 'GET',
    url: `/user/${userId}/log`,
    params: params
  })
}

export const getUserFriends = (userId: number) => {
  return http<IFriendDetail[]>({
    method: 'GET',
    url: `/buddy/${userId}`
  })
}
