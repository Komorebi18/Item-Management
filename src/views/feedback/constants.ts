import { ReplyInfoReq } from '@/types/feedback'

// 回复标题
const TITLE = '收到反馈'

// 默认回复内容
const DEFUALT_CONTENT = '感谢您的反馈！我们非常重视您提供的信息，我们会尽快处理并采取适当的措施。'

// 快捷回复消息
export const replyMsg = ref<ReplyInfoReq>({
  title: TITLE,
  content: DEFUALT_CONTENT,
  userId: 1,
  userIds: [],
  groupId: 0,
  typeId: 1
})
