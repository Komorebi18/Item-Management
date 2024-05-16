import { ReplyInfoReq } from '@/types/feedback'

// 快捷回复消息
export const DEFAULT_REPLY_MSG: ReplyInfoReq = {
  title: '收到反馈',
  content: '感谢您的反馈！我们非常重视您提供的信息，我们会尽快处理并采取适当的措施。',
  userId: 1,
  userIds: [],
  groupId: 0,
  typeId: 1
}
