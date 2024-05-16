<template>
  <el-dialog v-model="isShowConfirmDialog" width="30%" top="20%" center>
    <div>
      <div class="warning-icon">
        <img src="../../../assets/icons/delete-waring.svg" alt="" />
        <span>{{ props.confirmationMessage }}</span>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="isShowConfirmDialog = false">取消</el-button>
        <el-button type="primary" @click="handleClickConfirm()">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <Toast ref="toastRef" :prompt-message="props.promptMessage" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Toast from './Toast.vue'

const props = defineProps<{
  // 确认框展示信息
  confirmationMessage: string
  // 确认框展示信息
  promptMessage: string
}>()

const emit = defineEmits<{
  // 确认按钮点击事件
  confirm: []
}>()

// 获取toast实例
const toastRef = ref<InstanceType<typeof Toast>>()

// 是否打开对话框
const isShowConfirmDialog = ref(false)

// 点击确认按钮
const handleClickConfirm = () => {
  emit('confirm')
  // 关闭确认框，打开toast提示
  isShowConfirmDialog.value = false
  toastRef.value!.openToast()
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
  img {
    display: inline-block;
    margin-right: 12px;
    width: 32px;
    height: 32px;
  }
  span {
    white-space: pre-line;
  }
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
</style>
