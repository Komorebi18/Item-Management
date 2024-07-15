<template>
  <div class="wrapper">
    <el-dialog v-model="isOpenDialog" title="管理员权限" width="300" center>
      <div class="power-wrapper">
        <template v-for="item in props.adminMessage.roles" :key="item.roleId">
          <span class="power-item" :class="{ activeItem: item.status === 1 }">{{
            matchRoleName(item.content)
          }}</span>
        </template>
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { IAdminMessage } from '@/types/acl/index'

const props = defineProps<{
  // 管理员信息
  adminMessage: IAdminMessage
}>()

// 根据角色映射对应名称
const matchRoleName = (roleName: string) => {
  if (roleName === 'ITEM') {
    return '物品管理'
  } else if (roleName === 'USER') {
    return '用户管理'
  } else if (roleName === 'NOTICE') {
    return '系统通知'
  } else if (roleName === 'FEEDBACK') {
    return '用户反馈'
  } else if (roleName === 'NOTICE_AUDIT') {
    return '通知审核'
  } else {
    return '模块未命名'
  }
}

// 控制对话框开关
const isOpenDialog = ref(false)

// 打开对话框
const openDialog = () => {
  isOpenDialog.value = true
}

// 向父组件暴露打开对话框方法
defineExpose({ openDialog })
</script>
<style lang="scss" scoped>
.power-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.power-item {
  flex: 1 1 40%;
  margin: 2.5%;
  border: 1px solid #8a8ea8;
  border-radius: 5px;
  box-sizing: border-box;
  text-align: center;
  padding: 10px 0;
}

.activeItem {
  color: #fff;
  background-color: #2f3367;
}
</style>
