<template>
  <img :src="noticeStateImg" class="notice-type-icon" />
</template>
<script setup lang="ts">
import { computed } from 'vue'

// 接受父组件传过来的通知状态
const props = defineProps<{
  noticeState: number
}>()

// 通知状态对应的图片路径
const noticeStateImg = computed(() => {
  switch (props.noticeState) {
    case 1:
      return '/src/assets/icons/editing.svg'
    case 2:
      return '/src/assets/icons/under-review.svg'
    case 3:
      return '/src/assets/icons/info-success.svg'
    case 4:
      return '/src/assets/imgs/fail-the-audit.png'
    default:
      return '/src/assets/icons/editing.svg'
  }
})
</script>
<style lang="scss" scoped>
.notice-type-icon {
  width: 1em;
  height: 1em;
  margin: 5px;
}
</style>
