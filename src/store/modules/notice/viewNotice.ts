import { defineStore } from 'pinia'
import type { INoticeList, INoticeItem } from '@/types/notice'
import { getAllNotice, deleteAnyNotice } from '@/api/notice'

export const useViewNoticeStore = defineStore('viewNotice', () => {
  // 全部审核通过通知参数--所有通知界面
  const allNoticeList = reactive<INoticeList>({
    current: 1,
    size: 10,
    total: 0,
    pages: 0,
    records: <INoticeItem[]>[]
  })

  // 刷新正式发布的通知
  const refreshAllNoticeList = async (content: string, type: number, dataType: number) => {
    const res = await getAllNotice(
      allNoticeList.current,
      allNoticeList.size,
      content,
      type,
      dataType
    )
    allNoticeList.current = res.data.current
    allNoticeList.size = res.data.size
    allNoticeList.total = res.data.total
    allNoticeList.pages = res.data.pages
    allNoticeList.records = res.data.records
    // 移除发布时间字符串中的T
    allNoticeList.records.map((notice) => {
      notice.publishTime = (notice.publishTime as string).replace('T', ' ')
      return notice
    })
  }

  // 更新新正式发布的通知
  const upDateAllNoticeList = async (
    offset: number,
    limit: number,
    content: string,
    type: number,
    dataType: number
  ) => {
    const res = await getAllNotice(offset, limit, content, type, dataType)
    allNoticeList.current = res.data.current
    allNoticeList.size = res.data.size
    allNoticeList.total = res.data.total
    allNoticeList.pages = res.data.pages
    allNoticeList.records = res.data.records
    // 移除发布时间字符串中的T
    allNoticeList.records.map((notice) => {
      notice.publishTime = (notice.publishTime as string).replace('T', ' ')
      return notice
    })
  }

  // 删除任意通知(要求权限足够)
  const deleteAnyNotice = async (title: string, noticeId: number) => {
    await deleteAnyNotice(title, noticeId)
  }
  return {
    allNoticeList,
    refreshAllNoticeList,
    upDateAllNoticeList,
    deleteAnyNotice
  }
})
