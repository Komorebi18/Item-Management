<template>
  <div class="wrapper">
    <el-dialog v-model="isOpenDialog" title="编辑" width="400" center class="aaa">
      <div class="power-list">
        <div :class="{ activeFont: isDeliverAll }">
          <span>发布通知</span>
          <el-switch v-model="isDeliverAll" class="deliver-switch" />
        </div>
        <div :class="{ activeFont: isDeliverAll }">
          <span>发布通知</span>
          <el-switch v-model="isDeliverAll" class="deliver-switch" />
        </div>
        <div :class="{ activeFont: isDeliverAll }">
          <span>发布通知</span>
          <el-switch v-model="isDeliverAll" class="deliver-switch" />
        </div>
        <div :class="{ activeFont: isDeliverAll }">
          <span>发布通知</span>
          <el-switch v-model="isDeliverAll" class="deliver-switch" />
        </div>
      </div>
      <div class="admin-msg-wrapper">
        <div class="logo">
          <img src="../../../assets/logo.png" />
        </div>
        <div class="admin-name">
          <span>用户名：</span>
          <el-input v-model="adminName" placeholder="请输入管理员名称" />
        </div>
        <div class="admin-password">
          <span>密码：</span>
          <el-input v-model="adminPassword" placeholder="请输入管理员密码" />
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
import { ref } from 'vue'

// 控制对话框开关
const isOpenDialog = ref(true)

// 确认修改管理员权限
const handleClickConfirm = () => {}

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
}

.power-list > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
}

.activeFont {
  color: var(--2F3367, #2f3367);
}

.admin-msg-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin: 20px;
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
}

.logo {
  width: 48px;
  height: 48px;
  box-sizing: content-box;
  border: 1px solid #e3e3e3;
  border-radius: 50%;
}
</style>
