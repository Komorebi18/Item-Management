<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="username" label="用户名" align="center" />
    <el-table-column prop="uuid" label="用户id" align="center" />
    <el-table-column :formatter="formatType" prop="type" label="用户反馈" align="center" />
    <el-table-column prop="version" label="用户版本" align="center" />
    <el-table-column prop="state" label="状态" :formatter="formatState" align="center" />
    <el-table-column class="feedback-operationBtn" label="操作" align="center" v-slot="scope">
      <div class="feedback-viewDetails">
        <el-button
          v-show="!(scope.row.state === 2)"
          @click="OnReplyQuick(scope.row.userId, scope.row.feedbackId)"
          >快捷回复</el-button
        >
        <el-button v-show="scope.row.state === 2">已回复</el-button>
        <a
          href="javascript:void(0);"
          class="feedback-viewDetails-btn"
          @click="OnViewDetail(scope.row.feedbackId)"
          >查看详情</a
        >
      </div>
    </el-table-column>
  </el-table>
</template>
<script setup lang="ts">
import { FeedBackInfo } from '@/types/feedback'
import { ref, reactive } from 'vue'

const enum STATE_TYPE {
  /**未读 */
  UNREAD = '未读',
  /**已读 */
  READ = '已读',
  /**已读已回复 */
  REPLY = '已读已回复'
}

const enum FACEBACK_TYPE {
  /**无法打开小程序 */
  CANNOT_OPEN_MINI_PROGRAM = '无法打开小程序',
  /**小程序闪退 */
  MINI_PROGRAM_FLASH_BACK = '小程序闪退',
  /**页面加载慢 */
  PAGE_LOAD_SLOW = '页面加载慢',
  /**其他异常 */
  OTHER_EXCEPTION = '其他异常',
  /**产品开发建议 */
  PRODUCT_DEVELOPMENT_SUGGESTIONS = '产品开发建议',
  /**意见反馈 */
  FEEDBACK = '意见反馈'
}
// 子掉父
const emit = defineEmits<{
  (e: 'replyQuick', userId: number, feedbackId: number): void
  (e: 'viewDetail', feedbackId: number): void
}>()

const OnReplyQuick = (userId: number, feedbackId: number) => {
  emit('replyQuick', userId, feedbackId)
}

const OnViewDetail = (feedbackId: number) => {
  emit('viewDetail', feedbackId)
}
// 接受参数
const { tableData } = defineProps<{
  tableData: FeedBackInfo[]
}>()

// 格式化反馈内容
const formatType = (value: any) => {
  const { type } = value
  switch (type) {
    case 1:
      return FACEBACK_TYPE.CANNOT_OPEN_MINI_PROGRAM
    case 2:
      return FACEBACK_TYPE.MINI_PROGRAM_FLASH_BACK
    case 3:
      return FACEBACK_TYPE.PAGE_LOAD_SLOW
    case 4:
      return FACEBACK_TYPE.OTHER_EXCEPTION
    case 5:
      return FACEBACK_TYPE.PRODUCT_DEVELOPMENT_SUGGESTIONS
    default:
      return FACEBACK_TYPE.FEEDBACK
  }
}

//格式化状态
const formatState = (value: any) => {
  const { state } = value
  switch (state) {
    case 0:
      return STATE_TYPE.UNREAD
    case 1:
      return STATE_TYPE.READ
    case 2:
      return STATE_TYPE.REPLY
    default:
      return STATE_TYPE.UNREAD
  }
}
</script>
<style lang="scss" scoped>
.feedback-viewDetails {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .feedback-viewDetails-btn {
    text-decoration: underline;
  }
}
.el-button {
  margin-right: 20px;
}
</style>
