import { defineStore } from 'pinia'
import type { INoticeList, INoticeItem } from '@/types/notice'
import { getPendingAuditNotice } from '@/api/notice'

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
  const refreshPendingAuditNotice = async (content: string, type: number, dataType: number) => {
    const res = await getPendingAuditNotice(
      pendingAuditNotice.value.current,
      pendingAuditNotice.value.size,
      content,
      type,
      dataType
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
    dataType: number
  ) => {
    const res = await getPendingAuditNotice(offset, limit, content, type, dataType)
    pendingAuditNotice.value = res.data
    formatNoticeList(pendingAuditNotice.value.records)
  }

  return {
    pendingAuditNotice,
    refreshPendingAuditNotice,
    updatePendingAuditNotice
  }
})
