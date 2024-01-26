import { FeedBack } from '@/types/feedback'
import http from '@/utils/request'

/**
 * 获取所有的反馈信息
 * @param offset  当前页
 * @param limit   每页的数量
 * @param state 是否已读 (0 未读 1 已读 全部 2)
 * @param type 反馈类型，传0查所有
 */
export const getAllFeedBackAPI = (offset: number, limit: number, state: number, type = 0) => {
  return http<FeedBack>({
    url: '/feedback',
    method: 'GET',
    params: {
      offset,
      limit,
      state,
      type
    }
  })
}

/**
 *将反馈设置为已读
 * @param feedbackId 反馈Id
 * @param state  反馈状态 0为已读，1为未读
 */
export const changeStateAPI = (feedbackId: number, state: number) => {
  return http({
    url: `/feedback/${feedbackId}`,
    method: 'PUT',
    params: {
      state
    }
  })
}
