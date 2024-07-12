<template>
  <div class="wrapper">
    <el-dialog v-model="isOpenDialog" title="管理员日志" width="666" center>
      <el-table :data="tableData" height="360" style="width: 100%">
        <el-table-column prop="date" label="登录设备" min-width="100" align="center" />
        <el-table-column prop="name" label="登录时间" min-width="100" align="center" sortable />
        <el-table-column prop="address" label="操作" min-width="200" align="center" />
      </el-table>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

// 假数据
const tableData = [
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  { date: '2016-05-02', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' },
  { date: '2016-05-02', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' }
]

// 控制对话框开关
const isOpenDialog = ref(false)

// 打开对话框
const openDialog = () => {
  isOpenDialog.value = true
}

// 向父组件暴露打开对话框方法
defineExpose({ openDialog })
</script>
<style lang="scss" scoped></style>
