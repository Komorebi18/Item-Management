import { IFeedBack, ReplyInfoReq } from '@/types/feedback'
import http from '@/utils/request'

/**
 * 获取所有的反馈信息
 * @param offset  当前页
 * @param limit   每页的数量
 * @param state 是否已读 (0 未读 1 已读 全部 2)
 * @param type 反馈类型，传0查所有
 */
export const fetchAllFeedBacks = (offset: number, limit: number, state: number, type = 0) => {
  return http<IFeedBack>({
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
 * @param state  反馈状态 0为已读，1为已读已回复
 */
export const changeStateToRead = (feedbackId: number, state: number) => {
  return http({
    url: `/feedback/${feedbackId}`,
    method: 'PUT',
    params: {
      state
    }
  })
}
/**
 *快捷回复或反馈问题
 * @param title 系统通知标题
 * @param content 系统通知主体内容
 * @param userId  广播传-1，分组传0，发给用户传1
 * @param groupId 分组对应的id(不是分组发送传0)
 * @param typeId  通知类型id 传1
 * @param userIds 选中的用户id列表，userId=1的时候需要传
 * @returns
 */
export const replyUser = (params: ReplyInfoReq) => {
  return http({
    url: `/notice/sys/feedback`,
    method: 'POST',
    data: params
  })
}
