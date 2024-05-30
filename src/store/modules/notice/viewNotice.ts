import { defineStore } from 'pinia'
import type { INoticeList, INoticeItem } from '@/types/notice'
import { getAllNotice } from '@/api/notice'

// 格式化通知列表---移除发布时间字符串中的T
const formatNoticeList = (noticeList: INoticeItem[]) => {
  noticeList.forEach((notice) => {
    notice.publishTime = notice.publishTime.replace('T', ' ')
  })
}

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
    allNoticeList.value = res.data
    formatNoticeList(allNoticeList.value.records)
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
    formatNoticeList(allNoticeList.value.records)
  }

  return {
    allNoticeList,
    refreshAllNoticeList,
    updateAllNoticeList
  }
})
