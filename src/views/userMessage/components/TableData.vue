<template>
  <el-table :data="props.tableData" style="width: 100%">
    <el-table-column prop="username" label="用户名" width="180" align="center" />
    <el-table-column prop="userId" label="用户id" width="180" align="center" />
    <el-table-column prop="phone" label="用户注册手机号" align="center" />
    <el-table-column :formatter="formatterTime" prop="regTime" label="登录时间" align="center" />
    <el-table-column prop="state" :formatter="judgeState" label="是否为特殊用户" align="center" />
    <el-table-column label="操作" align="center" v-slot="scope">
      <div class="detail">
        <a href="javascript:void(0);" @click="OnViewLog(scope.row.userId)">查看日志</a>
        <a href="javascript:void(0);" @click="OnViewFriend(scope.row.userId)">查看好友信息</a>
      </div>
    </el-table-column>
  </el-table>
</template>
<script setup lang="ts">
import { UserMessageDetail } from '@/types/userMessage'
import dayjs from 'dayjs'
// 接受参数
const props = defineProps<{
  tableData: UserMessageDetail[]
}>()

// 子掉父
const emit = defineEmits<{
  (e: 'view-Friend', userId: number): void
  (e: 'view-Log', userId: number): void
}>()

// 点击查看日志信息
const OnViewLog = (userId: number) => {
  emit('view-Log', userId)
}

// 点击查看好友信息
const OnViewFriend = (userId: number) => {
  emit('view-Friend', userId)
}

// 判断是否为特殊用户
const judgeState = (value: any) => {
  const { state } = value
  return state === 0 ? '否' : '历史黑名单用户'
}
// 格式化时间
const formatterTime = (value: any) => {
  const { regTime } = value
  return dayjs(regTime).format('YYYY.MM.DD')
}
</script>
<style lang="scss" scoped>
.detail {
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: underline;
  gap: 20px;
}
</style>
