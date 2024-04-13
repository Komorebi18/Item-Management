import { PageMessage, UserMessageDetail } from '@/types/userMessage'
import { defineStore } from 'pinia'
import { getUserMessageAPI } from '@/api/userMessage/userMessage'
export const userMessageStore = defineStore('userMessage', () => {
  // 用户信息
  const userMessage = reactive<PageMessage>({
    current: 0,
    pages: 0,
    size: 0,
    total: 0,
    records: [
      {
        id: '',
        userId: 0,
        name: '',
        phone: '',
        avatar: '',
        sex: '',
        qrCode: '',
        regTime: '',
        state: 0,
        loginTime: '',
        ip: '',
        userOperationLog: '',
        token: ''
      }
    ]
  })

  // 获取用户详情
  const userDetail = reactive<UserMessageDetail[]>([])
  // 获取用户信息
  const getUserMessage = async () => {
    const res = await getUserMessageAPI(0, 5)
    userMessage.records = res.data.records
    // 提取用户信息
    userMessage.records.map((item) => {
      // 不会使其失去响应性
      userDetail.push({
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
