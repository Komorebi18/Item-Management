import { defineStore } from 'pinia'
import type { INoticeList, INoticeItem } from '@/types/notice'
import { getSingleAdminNotice } from '@/api/notice'

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
  const refreshSingleAdminNoticeList = async (
    state: number,
    content: string,
    type: number,
    dataType: number
  ) => {
    const res = await getSingleAdminNotice(
      state,
      singleAdminNoticeList.value.current,
      singleAdminNoticeList.value.size,
      content,
      type,
      dataType
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
    dataType: number
  ) => {
    const res = await getSingleAdminNotice(state, current, size, content, type, dataType)
    singleAdminNoticeList.value = res.data
    formatNoticeList(singleAdminNoticeList.value.records)
  }

  return {
    singleAdminNoticeList,
    refreshSingleAdminNoticeList,
    updateSingleAdminNoticeList
  }
})
