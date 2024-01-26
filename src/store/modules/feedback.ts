import { getAllFeedBackAPI } from '@/api/feedback'
import { FeedBack, FeedBackInfo } from '@/types/feedback'
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

  //用户反馈数据
  const userFeedBack = ref<FeedBackInfo[]>([])

  //储存已读信息基本信息
  const readFeedBacks = ref<FeedBack>({
    current: 0,
    pages: 0,
    records: [],
    size: 0,
    total: 0
  })
  //已读信息详细信息
  const readFeedBack = ref<FeedBackInfo[]>([])

  //获取数据全部数据
  const getAllFeedBack = async (offset: number, limit: number, state?: number, type?: number) => {
    const res = await getAllFeedBackAPI(offset, limit, (state = 2))
    allFeedBack.value = res.data
    userFeedBack.value = res.data.records
  }

  //获取已读数据
  const readInfo = async (offset: number, limit: number, state?: number, type?: number) => {
    const res = await getAllFeedBack(offset, limit, state)
    console.log(res)
  }

  return {
    userFeedBack,
    allFeedBack,
    getAllFeedBack,
    readInfo
  }
})
