import { defineStore } from 'pinia'
import type { INoticeList } from '@/types/notice'
import { getAllNotice } from '@/api/notice'

export const useViewNoticeStore = defineStore('viewNotice', () => {
  // 全部审核通过通知参数--所有通知界面
  const allNoticeList = ref<INoticeList>({
    current: 1,
    size: 10,
    total: 0,
    pages: 0,
    records: []
  })

  // 刷新正式发布的通知
  const refreshAllNoticeList = async (content: string, type: number, dataType: number) => {
    const res = await getAllNotice(
      allNoticeList.value.current,
      allNoticeList.value.size,
      content,
      type,
      dataType
    )
    // 移除发布时间字符串中的T
    allNoticeList.value = res.data
    allNoticeList.value.records.forEach((notice) => {
      notice.publishTime = (notice.publishTime as string).replace('T', ' ')
    })
  }

  // 更新新正式发布的通知
  const updateAllNoticeList = async (
    offset: number,
    limit: number,
    content: string,
    type: number,
    dataType: number
  ) => {
    const res = await getAllNotice(offset, limit, content, type, dataType)
    allNoticeList.value = res.data
    // 移除发布时间字符串中的T
    allNoticeList.value.records.forEach((notice) => {
      notice.publishTime = (notice.publishTime as string).replace('T', ' ')
    })
  }

  return {
    allNoticeList,
    refreshAllNoticeList,
    updateAllNoticeList
  }
})
