<template>
  <el-table :data="logData" style="width: 100%">
    <el-table-column prop="name" label="用户名" width="180" align="center" />
    <el-table-column prop="userId" label="用户id" width="180" align="center" />
    <el-table-column prop="loginTime" :formatter="formatDate" label="登录时间" align="center" />
    <el-table-column prop="operation" label="用户操作" align="center" />
    <el-table-column label="操作" align="center">
      <div class="detail">
        <a href="javascript:void(0);" @click="viewLog">查看日志</a>
      </div>
    </el-table-column>
  </el-table>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import dayjs from 'dayjs'
import { UserMessageDetail } from '@/types/userMessage'

// 接受参数
const { logData } = defineProps<{
  logData: UserMessageDetail[]
}>()

// 子掉父
const emit = defineEmits<{
  (e: 'view-Friend'): void
  (e: 'view-Log'): void
}>()

// 点击查看日志信息
const viewLog = () => {
  emit('view-Log')
}

// 格式化时间
const formatDate = (value: any) => {
  const { loginTime } = value
  if (!loginTime) {
    return '暂无登录记录'
  }
  return dayjs(loginTime).format('YYYY-MM-DD HH:mm:ss')
}
</script>
<style lang="scss" scoped>
.detail {
  text-decoration: underline;
}
</style>
