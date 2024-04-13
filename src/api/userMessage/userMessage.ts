import { PageMessage, UserMessage } from '@/types/userMessage'
import http from '@/utils/request'

/**
 * 分页获取用户信息
 */
export const getUserMessageAPI = (offset: number, limit: number) => {
  return http<PageMessage>({
    method: 'GET',
    url: '/user/page',
    params: {
      offset,
      limit
    }
  })
}
