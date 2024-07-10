<template>
  <el-dialog v-model="isOpenDialog" width="30%" :title="props.dialogTitle" class="basis-box" center>
    <div class="basis">
      <text>操作管理员：{{ props.blacklistUserMessage.inAdminName }}</text>
      <div class="basis-comment">
        <p>{{ props.commentTitle }}:</p>
        <el-input
          :value="props.blacklistUserMessage.inReason"
          autosize
          resize="none"
          type="textarea"
        />
      </div>

      <p>图片依据：</p>
      <div class="demo-image__preview">
        <el-image
          style="width: 100px; height: 100px"
          :src="props.blacklistUserMessage.inImages[0]"
          :zoom-rate="1.2"
          :max-scale="7"
          :min-scale="0.2"
          :preview-src-list="props.blacklistUserMessage.inImages"
          :initial-index="4"
          fit="cover"
        />
      </div>
    </div>
    <template #footer>
      <div class="footer">
        <el-button type="primary" @click="isOpenDialog = false"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { IBlacklistUserInfo } from '@/types/user'
const props = defineProps<{
  // 对话框标题
  dialogTitle: string
  // 文字输入框标题
  commentTitle: string
  // 黑名单用户详情
  blacklistUserMessage: IBlacklistUserInfo
}>()

// 控制对话框的开关
const isOpenDialog = ref(false)

// 打开对话框
const openDialog = () => {
  isOpenDialog.value = true
}

// 向父组件暴露打开对话框方法
defineExpose({ openDialog })
</script>
<style lang="scss" scoped>
.basis {
  margin: -20px 0 -20px;
  padding: 20px 10px;
  border-top: 1px solid #e3e3e3;
  border-bottom: 1px solid #e3e3e3;
  font-size: 1rem;
}

.footer {
  padding-right: 15px;
  text-align: right;
}

:deep(.basis-box .footer .el-button--primary) {
  margin-left: 20px;
  color: #fff;
  background-color: #8a8ea8;
  border-color: #8a8ea8;
}

:deep(.basis-comment .el-textarea__inner) {
  box-shadow: none;
}

.basis-comment {
  margin: 10px 0;
}
</style>
