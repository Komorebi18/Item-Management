import { defineStore } from 'pinia'
import type { NoticeList, NoticeItem, NoticeType } from '@/types/notice'
import {
  getSingleAdminNoticeAPI,
  getAllNoticeAPI,
  getPendingAuditNoticeAPI,
  updateNoticeContentAPI,
  updateNoticeStateToCheckAPI,
  updateNoticeStateToPassAPI,
  publishNoticeToUserAPI,
  rejectNoticeAPI,
  deleteOwnNoticeAPI,
  deleteAnyNoticeAPI,
  allNoticeTypeAPI,
  addNewNoticeAPI
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

  // 全部待审核通知参数--审核通知界面
  const allPendingAuditNoticeList = reactive<NoticeList>({
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
  const getSingleAdminNoticeList = async (
    state: string,
    content: string,
    type: number,
    dataType: number
  ) => {
    // 调用接口获取数据
    const res = await getSingleAdminNoticeAPI(
      state,
      singleAdminNoticeList.current as number,
      singleAdminNoticeList.size as number,
      content,
      type,
      dataType
    )
    singleAdminNoticeList.current = res.data.current
    singleAdminNoticeList.size = res.data.size
    singleAdminNoticeList.total = res.data.total
    singleAdminNoticeList.pages = res.data.pages
    singleAdminNoticeList.records = res.data.records
    // 重置信息列表的内容,直接复制可能不会覆盖原先存放的内容
    singleAdminNoticeList.records = []
    Array.prototype.push.apply(singleAdminNoticeList.records, res.data.records as NoticeList[])
    // 移除发布时间字符串中的T
    singleAdminNoticeList.records.map((notice) => {
      notice.publishTime = (notice.publishTime as string).replace('T', ' ')
      return notice
    })
  }

  // 获取所有已发布通知
  const getAllNoticeList = async (content: string, type: number, dataType: number) => {
    // 调用接口获取数据
    const res = await getAllNoticeAPI(
      allNoticeList.current as number,
      allNoticeList.size as number,
      content,
      type,
      dataType
    )
    allNoticeList.current = res.data.current
    allNoticeList.size = res.data.size
    allNoticeList.total = res.data.total
    allNoticeList.pages = res.data.pages
    // 重置信息列表的内容,直接复制可能不会覆盖原先存放的内容
    allNoticeList.records = []
    Array.prototype.push.apply(allNoticeList.records, res.data.records as NoticeList[])
    // 移除发布时间字符串中的T
    allNoticeList.records.map((notice) => {
      notice.publishTime = (notice.publishTime as string).replace('T', ' ')
      return notice
    })
  }

  // 获取待审核的通知
  const getAllPendingAuditNoticeList = async (content: string, type: number, dataType: number) => {
    // 调用接口获取数据
    const res = await getPendingAuditNoticeAPI(
      allPendingAuditNoticeList.current as number,
      allPendingAuditNoticeList.size as number,
      content,
      type,
      dataType
    )
    allPendingAuditNoticeList.current = res.data.current
    allPendingAuditNoticeList.size = res.data.size
    allPendingAuditNoticeList.total = res.data.total
    allPendingAuditNoticeList.pages = res.data.pages
    // 重置信息列表的内容,直接复制可能不会覆盖原先存放的内容
    allPendingAuditNoticeList.records = []
    Array.prototype.push.apply(allPendingAuditNoticeList.records, res.data.records as NoticeList[])
    // 移除发布时间字符串中的T
    allPendingAuditNoticeList.records.map((notice) => {
      notice.publishTime = (notice.publishTime as string).replace('T', ' ')
      return notice
    })
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

  // 正式发布通知给用户
  const publishNoticeToUser = async (title: string, noticeId: number) => {
    await publishNoticeToUserAPI(title, noticeId)
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
    const res = await allNoticeTypeAPI()
    noticeTypeList.value = res.data
  }

  // 添加新通知
  const addNewNotice = async (
    state: number,
    title: string,
    content: string,
    userId: number,
    groupId: number,
    typeId: number
  ) => {
    await addNewNoticeAPI(state, title, content, userId, groupId, typeId)
  }

  return {
    noticeTypeList,
    allNoticeList,
    allPendingAuditNoticeList,
    singleAdminNoticeList,
    getAllNoticeList,
    getAllPendingAuditNoticeList,
    getSingleAdminNoticeList,
    updateNoticeContent,
    updateNoticeStateToCheck,
    updateNoticeStateToPass,
    publishNoticeToUser,
    rejectNotice,
    deleteOwnNotice,
    deleteAnyNotice,
    getAllNoticeType,
    addNewNotice
  }
})
