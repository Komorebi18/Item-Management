<template>
  <div class="wrapper">
    <el-dialog v-model="isOpenDialog" title="管理员权限" width="300" center>
      <div class="power-wrapper">
        <template v-for="item in props.adminMessage.roles" :key="item.roleId">
          <span class="power-item">发布通知</span>
        </template>
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { IAdminMessage, IAdminLog, IAdminPower } from '@/types/acl/index'

const props = defineProps<{
  // 管理员信息
  adminMessage: IAdminMessage
}>()

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
}

.power-item {
  flex: 1 1 40%;
  margin: 2.5%;
  box-sizing: border-box;

  color: #fff;
  text-align: center;
  padding: 10px 0;
  border-radius: 5px;
  background-color: #2f3367;
}
</style>
