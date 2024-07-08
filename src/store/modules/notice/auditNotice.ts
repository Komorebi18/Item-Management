import { defineStore } from 'pinia'
import type { INoticeList, INoticeItem } from '@/types/notice'
import { getPendingAuditNotice } from '@/api/notice'

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

export const useAuditNoticeStore = defineStore('viewNotice', () => {
  // 全部待审核通知参数--审核通知界面
  const pendingAuditNotice = ref<INoticeList>({
    current: 1,
    size: 10,
    total: 0,
    pages: 0,
    records: []
  })

  // 刷新待审核的通知
  const refreshPendingAuditNotice = async () => {
    const res = await getPendingAuditNotice(
      pendingAuditNotice.value.current,
      pendingAuditNotice.value.size,
      searchKeyword.value,
      typeLimit.value,
      dateLimit.value
    )
    pendingAuditNotice.value = res.data
    formatNoticeList(pendingAuditNotice.value.records)
  }

  // 更新待审核的通知
  const updatePendingAuditNotice = async (
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
    // 更新数据
    const res = await getPendingAuditNotice(offset, limit, content, type, dateType)
    pendingAuditNotice.value = res.data
    formatNoticeList(pendingAuditNotice.value.records)
  }

  return {
    pendingAuditNotice,
    refreshPendingAuditNotice,
    updatePendingAuditNotice
  }
})
