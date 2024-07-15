import { defineStore } from 'pinia'
import type { IAdminMessage, IAdminLog } from '@/types/acl/index'
import type { IPagingData } from '@/types/index'
import { getAllAdminMessage, getAdminLog } from '@/api/acl/index'

// 搜索关键词
const searchKeyword = ref('')
// 暂存管理员ID
const tempAdminId = ref(0)

// 格式化黑名单列表---移除时间字符串中的T
const formatLog = (logList: IAdminLog[]) => {
  logList.forEach((item) => {
    item.modifyTime = item.modifyTime.replace('T', ' ')
  })
}

export const useAdminAuthorityStore = defineStore('acl', () => {
  // 管理员信息
  const adminMessageList = ref<IPagingData<IAdminMessage>>({
    current: 1,
    size: 10,
    total: 0,
    pages: 0,
    records: []
  })

  // 管理员日志
  const adminLogList = ref<IPagingData<IAdminLog>>({
    current: 0,
    size: 10,
    total: 0,
    pages: 0,
    records: []
  })

  // 更新管理员信息
  const updateAdminMessageList = async (offset: number, limit: number, content: string) => {
    // 暂存搜索关键词
    searchKeyword.value = content
    const res = await getAllAdminMessage(offset, limit, content)
    adminMessageList.value = res.data
  }

  // 刷新管理员信息
  const refreshAdminMessageList = async () => {
    const res = await getAllAdminMessage(
      adminMessageList.value.current,
      adminMessageList.value.size,
      searchKeyword.value
    )
    adminMessageList.value = res.data
  }

  // 获取管理员日志
  const getAdminLogList = async (adminId: number) => {
    if (tempAdminId.value !== adminId) {
      // 清空日志
      adminLogList.value.records = []
      // 重置页码
      adminLogList.value.current = 0
      // 暂存管理员ID
      tempAdminId.value = adminId
    }
    // 触底加载更多， 每次加载10条，页码自动递增
    adminLogList.value.current++
    const res = await getAdminLog(adminId, adminLogList.value.current)
    adminLogList.value.current = res.data.current
    adminLogList.value.size = res.data.size
    adminLogList.value.total = res.data.total
    adminLogList.value.pages = res.data.pages
    adminLogList.value.records = [...adminLogList.value.records, ...res.data.records]
    formatLog(adminLogList.value.records)
  }

  return {
    adminMessageList,
    adminLogList,
    updateAdminMessageList,
    refreshAdminMessageList,
    getAdminLogList
  }
})
