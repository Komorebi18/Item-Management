<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="name" label="用户名" width="180" align="center" />
    <el-table-column prop="userId" label="用户id" width="180" align="center" />
    <el-table-column prop="phone" label="用户注册手机号" align="center" />
    <el-table-column :formatter="formatterTime" prop="regTime" label="登录时间" align="center" />
    <el-table-column prop="state" :formatter="judgeState" label="是否为特殊用户" align="center" />
    <el-table-column label="操作" align="center">
      <div class="detail">
        <a href="javascript:void(0);" @click="viewLog">查看日志</a>
        <a href="javascript:void(0);" @click="viewFriend">查看好友信息</a>
      </div>
    </el-table-column>
  </el-table>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { UserMessageDetail } from '@/types/userMessage'
import { formatterTime, judgeState } from '@/utils/formattingFunction'
// 接受参数
const { tableData } = defineProps<{
  tableData: UserMessageDetail[]
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

// 点击查看好友信息
const viewFriend = () => {
  console.log('oosi')
  emit('view-Friend')
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
