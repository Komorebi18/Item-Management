<template>
  <el-dialog v-model="isShowConfirmDialog" width="30%" top="20%" center>
    <div>
      <div class="warning-icon">
        <img src="../../../assets/icons/delete-waring.svg" alt="" />
        <span v-html="props.confirmationMessage"></span>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="isShowConfirmDialog = false">取消</el-button>
        <el-button type="primary" @click="handleClickConfirm()">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <Toast ref="toast" :prompt-message="props.promptMessage" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Toast from './Toast.vue'

const props = defineProps({
  // 确认框展示信息
  confirmationMessage: {
    type: String,
    required: true
  },
  // 确认框展示信息
  promptMessage: {
    type: String,
    required: true
  }
})

// 获取toast实例
const toast = ref<InstanceType<typeof Toast>>()

const emit = defineEmits(['confirm'])

// 是否打开对话框
const isShowConfirmDialog = ref(false)

// 点击确认按钮
const handleClickConfirm = () => {
  emit('confirm')
  // 关闭确认框，打开toast提示
  isShowConfirmDialog.value = false
  toast.value!.openToast()
}

// 打开确认对话框的方法
const openDialog = () => {
  isShowConfirmDialog.value = true
}

// 向父组件暴露打开对话框方法
defineExpose({ openDialog })
</script>

<style lang="scss" scoped>
.warning-icon {
  display: flex;
  justify-content: center;
  margin-left: -20px;
  text-align: center;
}

.warning-icon img {
  display: inline-block;
  margin-right: 12px;
  width: 32px;
  height: 32px;
}

.confirm-text {
  text-align: center;
}

:deep(.dialog-footer .el-button) {
  background-color: #fff;
  color: #8a8ea8;
  border-color: #8a8ea8;
}
:deep(.dialog-footer .el-button--primary) {
  margin-left: 64px;
  color: #ff7676;
  border-color: #ff7676;
}

// 消息提示框
.toast {
  position: absolute;
  top: 30%;
  left: 30%;
  width: 140px;
  height: 140px;
  border-radius: 8px;
  background: var(--2F3367, #2f3367);
  box-shadow: 0px 2px 8.1px 6px rgba(161, 166, 201, 0.35);
  background-color: #2f3367;
}
.toast .message-item-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.toast p {
  margin: 16px;
  color: #fff;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 1.28px;
}
</style>
