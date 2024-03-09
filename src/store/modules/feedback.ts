import { getAllFeedBackAPI, replyUserAPI } from '@/api/feedback'
import { FeedBack, FeedBackInfo, ReplyInfo } from '@/types/feedback'
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useFeedBackStore = defineStore('feedback', () => {
  //基本数据
  const allFeedBack = ref<FeedBack>({
    current: 0,
    pages: 0,
    records: [],
    size: 0,
    total: 0
  })

  //用户反馈数据
  const userFeedBack = ref<FeedBackInfo[]>([])

  //储存已读基本信息
  const readFeedBacks = ref<FeedBack>({
    current: 0,
    pages: 0,
    records: [],
    size: 0,
    total: 0
  })

  //已读信息详细信息
  const readFeedBack = ref<FeedBackInfo[]>([])

  //储存未读基本信息
  const unReadFeedBacks = ref<FeedBack>({
    current: 0,
    pages: 0,
    records: [],
    size: 0,
    total: 0
  })

  //未读信息详细信息
  const unReadFeedBack = ref<FeedBackInfo[]>([])
  // 已读数量
  const readNum = ref()

  // 未读数量
  const unReadNum = ref()

  // 快捷回复消息
  const replyMsg = ref<ReplyInfo>({
    title: '收到反馈',
    content: '感谢您的反馈！我们非常重视您提供的信息，我们会尽快处理并采取适当的措施。',
    userId: 0,
    groupId: 0,
    typeId: 1
  })

  //获取全部数据
  const getAllFeedBack = async (offset: number, limit: number, state?: number) => {
    const res = await getAllFeedBackAPI(offset, limit, (state = 2))
    allFeedBack.value = res.data
    userFeedBack.value = res.data.records
    // 获取未读数量
    readNum.value = res.data.total
  }

  //获取已读数据
  const readInfo = async (offset: number, limit: number, state?: number) => {
    const res = await getAllFeedBackAPI(offset, limit, (state = 1))
    readFeedBacks.value = res.data
    readFeedBack.value = res.data.records
    readNum.value = res.data.total
  }

  //获取未读数据
  const unReadInfo = async (offset: number, limit: number, state?: number) => {
    const res = await getAllFeedBackAPI(offset, limit, (state = 0))
    unReadFeedBacks.value = res.data
    unReadFeedBack.value = res.data.records
  }

  // 快捷回复或内容回复
  const replyMessage = async (userid?: number, userContent?: string) => {
    // 将 userId 赋值
    replyMsg.value.userId = userid as number

    if (userContent === undefined) {
      replyMsg.value.content =
        '感谢您的反馈！我们非常重视您提供的信息，我们会尽快处理并采取适当的措施。'
    } else {
      // 将用户反馈内容赋值
      replyMsg.value.content = userContent as string
    }

    const { title, content, userId, groupId, typeId } = replyMsg.value

    // 调用接口
    const res = await replyUserAPI(title, content, userId, groupId, typeId)

    // 状态更新
    if (res.code === 200) {
      ElMessage.success('回复成功')
    } else {
      ElMessage.error(`${res.msg}`)
    }
  }

  return {
    userFeedBack,
    allFeedBack,
    readFeedBack,
    readFeedBacks,
    unReadFeedBacks,
    unReadFeedBack,
    readNum,
    unReadNum,
    unReadInfo,
    getAllFeedBack,
    readInfo,
    replyMessage
  }
})
