import { defineStore } from 'pinia'
import type { INoticeList, INoticeItem } from '@/types/notice'
import { getSingleAdminNotice } from '@/api/notice'

// 类型枚举
enum NoticeType {
  ALL
}

// 时间枚举
enum NoticeDateLimit {
  ALL
}
// 当前state-0表示全部(默认)
const currentActiveTab = ref(0)
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

export const useDeliverNoticeStore = defineStore('deliverNotice', () => {
  // 管理员个人通知参数--发布通知界面
  const singleAdminNoticeList = ref<INoticeList>({
    current: 1,
    size: 10,
    total: 0,
    pages: 0,
    records: []
  })

  // 刷新管理员个人通知
  const refreshSingleAdminNoticeList = async () => {
    const res = await getSingleAdminNotice(
      currentActiveTab.value,
      singleAdminNoticeList.value.current,
      singleAdminNoticeList.value.size,
      searchKeyword.value,
      typeLimit.value,
      dateLimit.value
    )
    singleAdminNoticeList.value = res.data
    formatNoticeList(singleAdminNoticeList.value.records)
  }

  // 刷新管理员个人通知
  const updateSingleAdminNoticeList = async (
    state: number,
    current: number,
    size: number,
    content: string,
    type: number,
    dateType: number
  ) => {
    // 更新请求参数
    currentActiveTab.value = state
    searchKeyword.value = content
    typeLimit.value = type
    dateLimit.value = dateType
    // 更新页面数据
    const res = await getSingleAdminNotice(state, current, size, content, type, dateType)
    singleAdminNoticeList.value = res.data
    formatNoticeList(singleAdminNoticeList.value.records)
  }

  return {
    singleAdminNoticeList,
    refreshSingleAdminNoticeList,
    updateSingleAdminNoticeList
  }
})
