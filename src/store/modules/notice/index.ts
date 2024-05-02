import { defineStore } from 'pinia'
import type { INoticeType } from '@/types/notice'
import { allNoticeType } from '@/api/notice'
export const useNoticeStore = defineStore('notice', () => {
  // 所有通知的类型
  const noticeTypeList = ref<INoticeType[]>([])

  // 获取所有通知类型
  const getAllNoticeType = async () => {
    const res = await allNoticeType()
    noticeTypeList.value = res.data
  }

  return {
    noticeTypeList,
    getAllNoticeType
  }
})
