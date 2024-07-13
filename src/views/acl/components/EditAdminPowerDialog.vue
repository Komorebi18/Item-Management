<template>
  <div class="wrapper">
    <el-dialog v-model="isOpenDialog" title="编辑" width="400" center class="aaa">
      <div class="admin-msg-wrapper">
        <div class="logo">
          <img src="../../../assets/logo.png" />
        </div>
        <div class="admin-name">
          <span>用户名： {{ props.adminMessage.username }}</span>
        </div>
        <!-- <div class="admin-password">
          <span>密码：</span>
          <el-input v-model="adminPassword" placeholder="请输入管理员密码" />
        </div> -->
      </div>
      <div class="power-list">
        <div
          v-for="(item, index) in adminMessageCopy.roles"
          :key="item.roleId"
          :class="{ activeFont: item.status === 1 }"
        >
          <span>{{ matchRoleName(item.content) }}</span>
          <el-switch
            :active-value="1"
            :inactive-value="0"
            :model-value="item.status"
            @change="changeStatus($event, index)"
            class="deliver-switch"
          />
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isOpenDialog = false">取消</el-button>
          <el-button type="primary" @click="handleClickConfirm()">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import type { IAdminMessage, IAdminLog, IAdminPower } from '@/types/acl/index'

const props = defineProps<{
  // 管理员信息
  adminMessage: IAdminMessage
}>()

const emit = defineEmits<{
  confirm: [adminMessage: IAdminMessage]
}>()

// 拷贝一份副本，防止直接修改props
const adminMessageCopy = ref<IAdminMessage>(props.adminMessage)

// 确保副本初始化赋值成功
watch(
  () => props.adminMessage,
  (newValue) => {
    adminMessageCopy.value = newValue
  }
)

// 改变管理员权限
const changeStatus = (newValue: number, index: number) => {
  // 实时修改权限
  adminMessageCopy.value.roles[index].status = newValue
}

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

// 确认修改管理员权限
const handleClickConfirm = () => {
  emit('confirm', adminMessageCopy.value)
  isOpenDialog.value = false
}

const isDeliverAll = ref(false)

// 打开对话框
const openDialog = () => {
  isOpenDialog.value = true
}

// 向父组件暴露打开对话框方法
defineExpose({ openDialog })
</script>
<style lang="scss" scoped>
.power-list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e3e3e3;
  border-bottom: 1px solid #e3e3e3;

  :deep(.el-switch__core) {
    background-color: #e4e7ed;
    border: 1px solid #2f3367;
  }

  :deep(.is-checked .el-switch__core) {
    background-color: #2f3367;
  }

  :deep(.el-switch__action) {
    left: 2px;
    background-color: #2f3367;
  }
  :deep(.is-checked .el-switch__action) {
    left: calc(100% - 18px) !important;
    background-color: #e4e7ed;
  }
}

.power-list > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
  font-size: 1rem;
}

.activeFont {
  color: var(--2F3367, #2f3367);
  font-weight: 500;
}

.admin-msg-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin: 10px;
}

.admin-name,
.admin-password {
  display: flex;
  align-items: center;
  span {
    white-space: nowrap;
  }
}

.admin-password {
  padding-left: 1em;
}

.wrapper {
  :deep(.el-dialog__footer) {
    text-align: right;
    margin-right: 15px;
  }
  :deep(.el-dialog__title) {
    margin-left: 15px;
  }
}

.logo {
  width: 48px;
  height: 48px;
  box-sizing: content-box;
  border: 1px solid #e3e3e3;
  border-radius: 50%;
}
</style>
