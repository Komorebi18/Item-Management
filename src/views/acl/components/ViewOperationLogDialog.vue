<template>
  <div class="wrapper">
    <el-dialog v-model="isOpenDialog" title="管理员日志" width="750" center>
      <div
        v-infinite-scroll="load"
        class="infinite-list-wrapper"
        :infinite-scroll-immediate="false"
      >
        <el-table :data="props.adminLogList" style="width: 100%">
          <el-table-column prop="address" label="登录设备" min-width="100" align="center" />
          <el-table-column
            prop="modifyTime"
            label="登录时间"
            min-width="200"
            align="center"
            sortable
          />
          <el-table-column prop="content" label="操作" min-width="240" align="center" />
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { IAdminMessage, IAdminLog, IAdminPower } from '@/types/acl/index'

const props = defineProps<{
  adminLogList: IAdminLog[]
}>()

const emit = defineEmits<{
  // 加载更多数据
  loadMore: []
}>()

// 控制对话框开关
const isOpenDialog = ref(false)

// 加载更多数据
const load = () => {
  emit('loadMore')
}

// 打开对话框
const openDialog = () => {
  isOpenDialog.value = true
}

// 向父组件暴露打开对话框方法
defineExpose({ openDialog })
</script>
<style lang="scss" scoped>
.infinite-list-wrapper {
  height: 400px;
  overflow: auto;
  overflow-anchor: none;
}
</style>
