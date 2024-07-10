<template>
  <el-dialog v-model="isOpenFriendDialog" width="800">
    <el-scrollbar max-height="400px">
      <div class="dialog-friend">
        <el-table :data="props.friendGroup" style="width: 100%">
          <el-table-column prop="addTime" label="操作时间" width="180" align="center" />
          <el-table-column
            prop="groupName"
            label="全部分组"
            align="center"
            :filters="props.groupLabel"
            :filter-method="filterHandler"
          />
          <el-table-column prop="name" label="好友" align="center" />
        </el-table>
      </div>
    </el-scrollbar>
  </el-dialog>
</template>
<script setup lang="ts">
import { IFriendDetail, IGroupLabel } from '@/types/userMessage'
import { TableColumnCtx } from 'element-plus'
import { ref } from 'vue'
// 接受参数
const props = defineProps<{
  groupLabel: IGroupLabel[]
  friendGroup: IFriendDetail[] | undefined
}>()

// friend对话框状态
const isOpenFriendDialog = ref(false)

// 打开弹窗
const openDialog = () => {
  isOpenFriendDialog.value = true
}

// 筛选函数
const filterHandler = (
  value: string,
  row: IFriendDetail,
  column: TableColumnCtx<IFriendDetail>
) => {
  // 将 property 强行定义未 IFriendDetail
  const property = column['property'] as keyof IFriendDetail
  return row[property] === (value as string)
}

// 向父组件暴露打开对话框方法
defineExpose({
  openDialog
})
</script>
<style lang="scss" scoped></style>
