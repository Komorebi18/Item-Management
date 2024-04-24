import { fetchAllFeedBacks, replyUser, changeStateToRead } from '@/api/feedback'
import { FeedBack, ReplyInfo } from '@/types/feedback'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFeedBackStore = defineStore('feedback', () => {
  const enum STATE {
    /**未查看 */
    UNREAD,
    /**已查看 */
    READ,
    /**全部 */
    ALL
  }

  //基本数据
  const allFeedBack = ref<FeedBack>({
    current: 0,
    pages: 0,
    records: [],
    size: 0,
    total: 0
  })

  //储存已读基本信息
  const readFeedBacks = ref<FeedBack>({
    current: 0,
    pages: 0,
    records: [],
    size: 0,
    total: 0
  })

  //储存未读基本信息
  const unReadFeedBacks = ref<FeedBack>({
    current: 0,
    pages: 0,
    records: [],
    size: 0,
    total: 0
  })

  //获取全部数据
  const getAllFeedBacks = async (offset: number, limit: number) => {
    const res = await fetchAllFeedBacks(offset, limit, STATE.ALL)
    allFeedBack.value = res.data
  }

  //获取已读数据
  const getReadFeedbacks = async (offset: number, limit: number) => {
    const res = await fetchAllFeedBacks(offset, limit, STATE.READ)
    readFeedBacks.value = res.data
  }

  //获取未读数据
  const getUnReadFeedbacks = async (offset: number, limit: number) => {
    const res = await fetchAllFeedBacks(offset, limit, STATE.UNREAD)
    unReadFeedBacks.value = res.data
  }

  // 刷新全部数据
  const refreshAllFeedBacks = async () => {
    const { current, size } = allFeedBack.value
    getAllFeedBacks(current, size)
  }

  // 刷新已读数据
  const refreshReadFeedbacks = async () => {
    const { current, size } = readFeedBacks.value
    getReadFeedbacks(current, size)
  }

  // 刷新未读数据
  const refreshUnReadFeedbacks = async () => {
    const { current, size } = unReadFeedBacks.value
    getUnReadFeedbacks(current, size)
  }

  // 将反馈状态改为已读
  const updateStateToRead = async (feedbackId: number) => {
    await changeStateToRead(feedbackId, STATE.UNREAD)
    // 状态更新
    refreshReadFeedbacks()
    refreshUnReadFeedbacks()
    refreshAllFeedBacks()
  }

  // 将反馈状态改为已读已回复
  const updateStateReply = async (feedbackId: number) => {
    await changeStateToRead(feedbackId, STATE.READ)
    // 状态更新
    refreshReadFeedbacks()
    refreshUnReadFeedbacks()
    refreshAllFeedBacks()
  }

  // 回复用户
  const replyToUser = async (context: ReplyInfo) => {
    await replyUser(context)
  }

  // 修改页面Page
  return {
    allFeedBack,
    readFeedBacks,
    unReadFeedBacks,
    updateStateToRead,
    updateStateReply,
    getUnReadFeedbacks,
    getAllFeedBacks,
    getReadFeedbacks,
    refreshAllFeedBacks,
    refreshReadFeedbacks,
    replyToUser,
    refreshUnReadFeedbacks
  }
})
