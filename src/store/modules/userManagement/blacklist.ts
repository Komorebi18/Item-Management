import { defineStore } from 'pinia'
import { getUserInformation, getBlacklistUser } from '@/api/user'
import type { IBlacklistUserInfo, IUserInformation } from '@/types/user'
import type { IPagingData } from '@/types/index'

// 搜索普通用户关键词
const userSearchKeyword = ref('')
// 搜索黑名单用户关键词
const blacklistSearchKeyword = ref('')

// 格式化黑名单列表---移除时间字符串中的T
const formatBlacklist = (userList: IBlacklistUserInfo[]) => {
  userList.forEach((user) => {
    user.inTime = user.inTime.replace('T', ' ')
  })
}

// 格式化普通用户列表---移除时间字符串中的T
const formatUserList = (userList: IUserInformation[]) => {
  userList.forEach((user) => {
    user.regTime = user.regTime.replace('T', ' ')
  })
}

export const useUserBlacklistStore = defineStore('userBlacklist', () => {
  // 全部用户信息
  const allUserMessage = ref<IPagingData<IUserInformation>>({
    current: 1,
    size: 10,
    total: 0,
    pages: 0,
    records: []
  })

  // 拉入黑名单的用户信息
  const blacklistUserList = ref<IPagingData<IBlacklistUserInfo>>({
    current: 1,
    size: 10,
    total: 0,
    pages: 0,
    records: []
  })

  //  更新未拉入黑名单用户列表
  const updateUserList = async (offset: number, limit: number, content: string) => {
    // 更新搜索关键词
    userSearchKeyword.value = content
    const { data } = await getUserInformation(offset, limit, content)
    allUserMessage.value = data
    formatUserList(allUserMessage.value.records)
  }

  // 刷新未拉入黑名单用户列表
  const refreshUserList = async () => {
    const { data } = await getUserInformation(
      allUserMessage.value.current,
      allUserMessage.value.size,
      userSearchKeyword.value
    )
    allUserMessage.value = data
    formatUserList(allUserMessage.value.records)
  }

  // 更新黑名单用户列表
  const updateBlacklistUserList = async (offset: number, limit: number, content: string) => {
    // 更新搜索关键词
    blacklistSearchKeyword.value = content
    const { data } = await getBlacklistUser(offset, limit, content)
    blacklistUserList.value = data
    formatBlacklist(blacklistUserList.value.records)
  }

  // 刷新黑名单用户列表
  const refreshBlacklistUserList = async () => {
    const { data } = await getBlacklistUser(
      blacklistUserList.value.current,
      blacklistUserList.value.size,
      blacklistSearchKeyword.value
    )
    blacklistUserList.value = data
    formatBlacklist(blacklistUserList.value.records)
  }

  return {
    allUserMessage,
    blacklistUserList,
    refreshUserList,
    updateUserList,
    refreshBlacklistUserList,
    updateBlacklistUserList
  }
})
