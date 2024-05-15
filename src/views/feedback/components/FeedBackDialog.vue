<template>
  <el-dialog v-model="isShowDialog">
    <span class="dialogTableVisible-title">反馈内容</span>
    <el-card class="feedback-card">
      <div class="feedback-image-preview">
        <el-image
          class="dialogCard-img"
          :src="currentFeedBack?.imageUrl[0]"
          :zoom-rate="1.2"
          :max-scale="7"
          :min-scale="0.2"
          :preview-src-list="currentFeedBack?.imageUrl"
          :initial-index="4"
          fit="cover"
          title="点击预览哦"
        />
      </div>
      <div class="dialogCard-title">
        <span>{{ currentFeedBack?.content }}</span>
      </div>
      <template #footer>
        <el-input
          v-model="feedBackContent"
          :rows="7"
          type="textarea"
          placeholder="请输入回复内容"
        />
        <div class="dialogCard-btn">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="onHandleMsg">发送</el-button>
        </div>
      </template>
    </el-card>
  </el-dialog>
</template>
<script setup lang="ts">
import { IFeedBackInfo } from '@/types/feedback'
import { ref, defineExpose } from 'vue'
import { ElMessage } from 'element-plus'
import { useFeedBackStore } from '@/store'
import { replyUser } from '@/api/feedback'
import { replyMsg } from '../constants'
const feedBackStore = useFeedBackStore()
const { updateStateReply } = feedBackStore
//打开反馈
const isShowDialog = ref<boolean>(false)

//反馈内容
const feedBackContent = ref<string>('')

// 接受参数
const props = defineProps<{
  currentFeedBack: IFeedBackInfo | undefined
}>()

// 关闭对话框
const closeDialog = () => {
  isShowDialog.value = false
  // 清空 textarea 内容
  feedBackContent.value = ''
}

// 打开对话框
const openDialog = () => {
  isShowDialog.value = true
}

// 回复消息
const onHandleMsg = async () => {
  if (feedBackContent.value === '') return ElMessage.warning('回复内容不能为空')

  Object.assign(replyMsg.value, {
    content: feedBackContent.value,
    userIds: [props.currentFeedBack?.userId]
  })

  await replyUser(replyMsg.value)
  // 将状态更新为已读已更新
  await updateStateReply(props.currentFeedBack?.feedbackId as number)
  // 关闭对话框
  closeDialog()
  ElMessage.success('回复成功')
}

// 向父组件暴露打开对话框方法
defineExpose({
  openDialog
})
</script>
<style lang="scss" scoped>
.dialogTableVisible-title {
  color: #000;
  margin-left: 14px;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
.feedback-card {
  padding-top: 0px;
  box-shadow: none;
}
.dialogCard-title {
  margin-top: 25px;
}
.dialogCard-btn {
  float: right;
  margin: 10px 30px;
}
.dialogCard-img {
  width: 150px;
  height: 150px;
}
</style>
