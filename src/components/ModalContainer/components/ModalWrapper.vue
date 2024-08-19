<!-- 本组件为每个弹窗外包组件，仅提供布局--水平垂直居中 -->
<template>
  <div id="modal-wrapper">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
onMounted(() => {
  // 页面禁止滚动
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  // 允许页面滚动：
  document.body.style.overflow = 'visible'
})
</script>

<style scoped>
#modal-wrapper {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
}
</style>
