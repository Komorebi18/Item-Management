import { defineStore } from 'pinia'
import type { INoticeList, INoticeItem } from '@/types/notice'
import { getAllNotice } from '@/api/notice'

// 类型枚举
enum NoticeType {
  ALL
}

// 时间枚举
enum NoticeDateLimit {
  ALL
}
// 搜索关键词
const searchKeyword = ref('')
// 通知类型
const typeLimit = ref(NoticeType.ALL)
// 日期限制
const dateLimit = ref(NoticeDateLimit.ALL)

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
  const refreshAllNoticeList = async () => {
    const res = await getAllNotice(
      allNoticeList.value.current,
      allNoticeList.value.size,
      searchKeyword.value,
      typeLimit.value,
      dateLimit.value
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
    dateType: number
  ) => {
    // 更新请求参数
    searchKeyword.value = content
    typeLimit.value = type
    dateLimit.value = dateType
    // 更新通知列表
    const res = await getAllNotice(offset, limit, content, type, dateType)
    allNoticeList.value = res.data
    formatNoticeList(allNoticeList.value.records)
  }

  return {
    allNoticeList,
    refreshAllNoticeList,
    updateAllNoticeList
  }
})
