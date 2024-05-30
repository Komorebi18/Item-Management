<template>
  <div class="header">
    <div class="left-header">
      <slot name="button"></slot>
      <div class="select-box">
        <TimeSelection v-if="props.isShowTimeSelection" @update-time-limit="onChangeTimeLimit" />
        <TypeSelection v-if="props.isShowTypeSelection" @update-type-limit="onChangeTypeLimit" />
      </div>
    </div>
    <SearchInput @search="searchNotice" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import TypeSelection from './TypeSelection.vue'
import TimeSelection from './TimeSelection.vue'
import SearchInput from '@/components/SearchInput/index.vue'

const emit = defineEmits<{
  // 搜索通知
  search: [keyword: string]
  // 更新通知时间限制
  updateTimeLimit: [timeLimit: number]
  // 更新通类型限制
  updateTypeLimit: [typeLimit: number]
}>()

const props = defineProps<{
  // 是否展示时间筛选下拉框
  isShowTimeSelection: boolean
  // 是否展示类型筛选下拉框
  isShowTypeSelection: boolean
}>()

// 时间参数
const timeLimit = ref(0)
// 类型参数
const typeLimit = ref(0)

// 搜索通知
const searchNotice = (keyword: string) => {
  emit('search', keyword)
}

// 类型限制参数改变
const onChangeTypeLimit = (type: number) => {
  typeLimit.value = type
  emit('updateTypeLimit', typeLimit.value)
}

// 时间限制参数改变
const onChangeTimeLimit = (time: number) => {
  timeLimit.value = time
  emit('updateTimeLimit', timeLimit.value)
}
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  padding: 10px 10px 0 20px;
  justify-content: space-between;
  align-self: center;
}
.search-box {
  display: flex;
  height: 32px;
}

.remove-notice-btn {
  display: flex;
  height: 38px;
  padding: 8px 16px;
  justify-content: center;
  align-items: center;
  gap: 3px;
  color: #fff;
  font-family: Inter;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 1.44px;
}

.select-box {
  display: flex;
  justify-content: space-between;
  width: 13vw;
  border: none;
}

:deep(.select-box .el-select__placeholder) {
  color: #2f3367;
  font-weight: 600;
}

:deep(.el-input__wrapper) {
  border-radius: 4px 0 0 4px;
}

:deep(.select-box .el-select__wrapper) {
  box-shadow: none !important;
}

.search-btn {
  border-radius: 0 4px 4px 0;
}
</style>
