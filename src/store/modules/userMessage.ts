import { PageMessage, UserMessageDetail } from '@/types/userMessage'
import { defineStore } from 'pinia'
import { getUserMessageAPI } from '@/api/userMessage/userMessage'
export const userMessageStore = defineStore('userMessage', () => {
  // 用户信息
  const userMessage = ref<PageMessage>()

  // 获取用户详情
  const userDetail = ref<UserMessageDetail[]>([])
  // 获取用户信息
  const getUserMessage = async (offset: number, limit: number) => {
    const res = await getUserMessageAPI(offset, limit)
    userMessage.value = res.data
    // 提取用户信息
    userDetail.value = []
    userMessage.value.records.map((item) => {
      // 不会使其失去响应性
      userDetail.value.push({
        name: item.name,
        userId: item.userId,
        phone: item.phone,
        regTime: item.regTime,
        state: item.state,
        ip: item.ip,
        userOperationLog: item.userOperationLog,
        loginTime: item.loginTime
      })
    })
  }
  return {
    userMessage,
    userDetail,
    getUserMessage
  }
})
