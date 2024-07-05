import http from '@/utils/request'
import type { ITemporaryToken } from '@/types'

/**
 * 获取临时API
 */
export const getTemporaryToken = () => {
  return http<ITemporaryToken>({
    url: '/valid/authentication',
    method: 'POST'
  })
}
