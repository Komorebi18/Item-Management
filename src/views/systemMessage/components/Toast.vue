<template>
  <div class="toast" v-show="isShowToast">
    <div class="message-item-content">
      <p>{{ props.promptMessage }}</p>
      <img src="../../../assets/icons/delete-confirm.svg" alt="" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  // 确认框展示信息
  promptMessage: string
}>()

const isShowToast = ref(false)

// 打开提示框
const openToast = () => {
  isShowToast.value = true
  setTimeout(() => {
    isShowToast.value = false
  }, 1500)
}

// 向父组件暴露打开对话框方法
defineExpose({ openToast })
</script>
<style lang="scss" scoped>
.toast {
  position: absolute;
  top: 30%;
  left: 40%;
  width: 140px;
  height: 140px;
  border-radius: 8px;
  background: var(--2F3367, #2f3367);
  box-shadow: 0px 2px 8.1px 6px rgba(161, 166, 201, 0.35);
  background-color: #2f3367;
  z-index: 999;
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
  white-space: pre-line;
  color: #fff;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 1.28px;
}
</style>
