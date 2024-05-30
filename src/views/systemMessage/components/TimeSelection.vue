<template>
  <el-select
    v-model="timeLimit"
    placeholder="全部"
    class="select-time"
    @change="onChangeTimeLimit()"
  >
    <el-option label="全部" :value="TIME_LIMIT.ALL" />
    <el-option label="近三天" :value="TIME_LIMIT.THREE_DAYS" />
    <el-option label="近一周" :value="TIME_LIMIT.ONE_WEEK" />
    <el-option label="近一月" :value="TIME_LIMIT.ONE_MONTH" />
  </el-select>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  updateTimeLimit: [timeLimit: number]
}>()

const timeLimit = ref(TIME_LIMIT.ALL)

// 处理时间限制的逻辑
const onChangeTimeLimit = () => {
  emit('updateTimeLimit', timeLimit.value)
}

// 时间限制变量
const enum TIME_LIMIT {
  /** 全部 */
  ALL,
  /** 近三天 */
  THREE_DAYS,
  /** 近一个周 */
  ONE_WEEK,
  /** 近一个月 */
  ONE_MONTH
}
</script>
<style lang="scss" scoped>
.select-time {
  width: 100px;
  margin: 5px 0 0;
}
</style>
