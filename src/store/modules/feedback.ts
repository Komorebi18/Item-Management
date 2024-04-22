import { getAllFeedBacks, replyUser, changeStateToRead } from '@/api/feedback'
import { FeedBack, ReplyInfo } from '@/types/feedback'
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useFeedBackStore = defineStore('feedback', () => {
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
  const getAllFeedBack = async (offset: number, limit: number) => {
    const res = await getAllFeedBacks(offset, limit, 2)
    allFeedBack.value = res.data
  }

  //获取已读数据
  const getReadFeedback = async (offset: number, limit: number) => {
    const res = await getAllFeedBacks(offset, limit, 1)
    readFeedBacks.value = res.data
  }

  //获取未读数据
  const getUnReadFeedback = async (offset: number, limit: number) => {
    const res = await getAllFeedBacks(offset, limit, 0)
    unReadFeedBacks.value = res.data
  }

  // 将反馈状态改为已读
  const ChangeReadFeedBack = async (feedbackId: string, offset: number, limit: number) => {
    await changeStateToRead(feedbackId, 0)
    // 状态更新
    getReadFeedback(offset, limit)
  }

  // 将反馈状态改为已读已回复
  const changeReadFeedBackAndReply = async (feedbackId: string, offset: number, limit: number) => {
    await changeStateToRead(feedbackId, 1)
    // 状态更新
    getUnReadFeedback(offset, limit)
  }

  return {
    allFeedBack,
    readFeedBacks,
    unReadFeedBacks,
    ChangeReadFeedBack,
    changeReadFeedBackAndReply,
    getUnReadFeedback,
    getAllFeedBack,
    getReadFeedback
  }
})
