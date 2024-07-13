import {
  IFriendDetail,
  IUserLogDetail,
  IUserLogQuery,
  PageMessage,
  UserMessageDetail
} from '@/types/userMessage'
import { defineStore } from 'pinia'
import { getUserFriends, getUserLog, getUserMessage } from '@/api/userMessage/userMessage'
export const userMessageStore = defineStore('userMessage', () => {
  // 用户信息
  const userMessage = ref<PageMessage<UserMessageDetail>>({
    current: 0,
    pages: 0,
    records: [],
    size: 0,
    total: 0
  })

  // 获取用户详情
  const userDetail = ref<UserMessageDetail[]>([
    {
      userId: 0,
      username: '',
      phone: '',
      state: 0,
      regTime: '',
      loginTime: '',
      ip: '',
      userOperationLog: ''
    }
  ])

  // 日志信息
  const logMessage = ref<PageMessage<IUserLogDetail>>({
    current: 0,
    size: 0,
    total: 0,
    pages: 0,
    records: []
  })

  // 好友分组信息
  const friendGroup = ref<IFriendDetail[]>()

  // 分组标签
  const groupLabel = computed(() => {
    const groupNames = [...new Set(friendGroup.value?.map((item) => item.groupName))]
    return groupNames.map((name) => ({ text: name as string, value: name as string }))
  })

  // 日志详情
  const logMessageDetail = ref<IUserLogDetail[]>([])

  // 获取用户信息
  const getUserInfo = async (offset: number, limit: number, content = '') => {
    const res = await getUserMessage(offset, limit, content)
    userMessage.value = res.data
    // 提取用户信息
    userDetail.value = []
    userDetail.value = userMessage.value.records.map((item) => ({
      username: item.username,
      userId: item.userId,
      phone: item.phone,
      regTime: item.regTime,
      state: item.state,
      ip: item.ip,
      userOperationLog: item.userOperationLog,
      loginTime: item.loginTime
    }))
  }

  // 通过用户 ID 获取日志
  const getUserLogById = async (userId: number, params: IUserLogQuery) => {
    const res = await getUserLog(userId, params)
    logMessage.value = res.data
    logMessageDetail.value = res.data.records
  }

  // 获取好友信息
  const getUserFriendById = async (userId: number) => {
    const res = await getUserFriends(userId)
    friendGroup.value = res.data
  }

  // 触底刷新
  const bottomRefresh = async (useId: number) => {
    const res = await getUserLog(useId, {
      offset: logMessage.value.current + 1,
      limit: 10
    })
    // 当前页
    logMessage.value.current = res.data.current
    logMessage.value.pages = res.data.pages
    // push 新数据
    logMessageDetail.value.push(...res.data.records)
  }

  // 刷新数据
  const refreshUserMessage = async () => {
    const { current, size } = userMessage.value
    getUserInfo(current, size)
  }

  return {
    userMessage,
    userDetail,
    logMessage,
    logMessageDetail,
    friendGroup,
    groupLabel,
    getUserFriendById,
    getUserInfo,
    refreshUserMessage,
    getUserLogById,
    bottomRefresh
  }
})
