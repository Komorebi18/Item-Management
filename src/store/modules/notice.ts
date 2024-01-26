import { defineStore } from 'pinia'
import type { NoticeList, NoticeItem, NoticeType } from '@/types/notice'
import {
  getSingleAdminNoticeAPI,
  getAllNoticeAPI,
  updateNoticeContentAPI,
  updateNoticeStateToCheckAPI,
  updateNoticeStateToPassAPI,
  rejectNoticeAPI,
  deleteOwnNoticeAPI,
  deleteAnyNoticeAPI,
  allNoticeType
} from '@/api/notice'
export const useNoticeStore = defineStore('notice', () => {
  // 管理员个人通知参数--发布通知界面
  const singleAdminNoticeList = reactive<NoticeList>({
    current: 1,
    size: 10,
    total: 0,
    pages: 0,
    records: []
  })

  // 全部审核通过通知参数--所有通知界面
  const allNoticeList = reactive<NoticeList>({
    current: 1,
    size: 10,
    total: 0,
    pages: 0,
    records: []
  })

  // 所有通知的类型
  const noticeTypeList = ref<NoticeType[]>([])

  // 获取管理员个人通知
  const getSingleAdminNoticeList = async (state: string, content: string, type: number) => {
    // 调用接口获取数据
    const res = await getSingleAdminNoticeAPI(
      state,
      singleAdminNoticeList.current as number,
      singleAdminNoticeList.size as number,
      content,
      type
    )
    singleAdminNoticeList.current = res.data.current
    singleAdminNoticeList.size = res.data.size
    singleAdminNoticeList.total = res.data.total
    singleAdminNoticeList.pages = res.data.pages
    singleAdminNoticeList.records = res.data.records
  }

  // 获取所有已发布通知
  const getAllNoticeList = async (
    state: string,
    content: string,
    timeLimit: string,
    type: number
  ) => {
    // 调用接口获取数据
    const res = await getAllNoticeAPI(
      state,
      allNoticeList.current as number,
      allNoticeList.size as number,
      content,
      type
    )
    allNoticeList.current = res.data.current
    allNoticeList.size = res.data.size
    allNoticeList.total = res.data.total
    allNoticeList.pages = res.data.pages
    // 重置信息列表的内容,直接复制可能不会覆盖原先存放的内容
    allNoticeList.records = []
    // 对数据进行筛选--以timeLimit为标准,筛选近三天，近一周，近一月的通知
    const temNoticeList = res.data.records?.filter((element) => {
      // 获取当前时间的时间戳
      const currentTime = new Date()
      const currentTimeStamp = currentTime.getTime()
      // 获取当前一条通知的发布时间
      const publishTime = new Date(element.publishTime as string)
      const publishTimeStamp = publishTime.getTime()
      if (timeLimit === 'day') {
        // 限制条件为三天内
        return currentTimeStamp - publishTimeStamp < 259200000
      } else if (timeLimit === 'week') {
        // 限制条件为一周内
        return currentTimeStamp - publishTimeStamp < 604800000
      } else if (timeLimit === 'month') {
        // 限制条件为一个月内
        return currentTimeStamp - publishTimeStamp < 2592000000
      } else {
        return true
      }
    })
    Array.prototype.push.apply(allNoticeList.records, temNoticeList as NoticeItem[])
  }

  // 更新通知内容
  const updateNoticeContent = async (
    title: string,
    content: string,
    userId: number,
    noticeId: number
  ) => {
    await updateNoticeContentAPI(title, content, userId, noticeId)
  }

  // 修改通知状态为待审核
  const updateNoticeStateToCheck = async (title: string, noticeId: number) => {
    await updateNoticeStateToCheckAPI(title, noticeId)
  }

  // 修改通知状态为通过审核
  const updateNoticeStateToPass = async (title: string, noticeId: number) => {
    await updateNoticeStateToPassAPI(title, noticeId)
  }

  // 驳回通知
  const rejectNotice = async (comment: string, title: string, noticeId: number) => {
    await rejectNoticeAPI(comment, title, noticeId)
  }

  // 删除自己未提交和被驳回的通知
  const deleteOwnNotice = async (title: string, noticeId: number) => {
    await deleteOwnNoticeAPI(title, noticeId)
  }

  // 删除任意通知(要求权限足够)
  const deleteAnyNotice = async (title: string, noticeId: number) => {
    await deleteAnyNoticeAPI(title, noticeId)
  }

  // 获取所有通知
  const getAllNoticeType = async () => {
    const res = await allNoticeType()
    noticeTypeList.value = res.data
  }

  return {
    noticeTypeList,
    allNoticeList,
    singleAdminNoticeList,
    getAllNoticeList,
    getSingleAdminNoticeList,
    updateNoticeContent,
    updateNoticeStateToCheck,
    updateNoticeStateToPass,
    rejectNotice,
    deleteOwnNotice,
    deleteAnyNotice,
    getAllNoticeType
  }
})
