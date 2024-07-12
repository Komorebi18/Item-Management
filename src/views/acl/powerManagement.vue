<template>
  <div class="wrapper">
    <Header :is-show-time-selection="false" :is-show-type-selection="false" @search="searchAdmin">
      <template #button>
        <el-button
          type="primary"
          :icon="Plus"
          class="remove-notice-btn"
          color="#2F3367"
          @click="editAdminPowerDialogRef?.openDialog()"
        >
          添加管理员
        </el-button>
      </template>
    </Header>
    <!-- 数据展示行 -->
    <el-table :data="adminList" class="userInfoList">
      <el-table-column prop="username" label="用户名" min-width="200" align="center" />
      <el-table-column label="管理员权限" min-width="300" align="center">
        <template #default="props">
          <el-button
            link
            size="small"
            class="operation-admin"
            @click="viewPowerDialogRef?.openDialog()"
            >查看权限</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="400" align="center">
        <template #default="props">
          <el-button
            link
            size="small"
            class="operation-admin"
            @click="viewOperationLogDialogRef?.openDialog()"
            >查看日志</el-button
          >
          <el-button
            link
            size="small"
            class="operation-admin"
            @click="editAdminPowerDialogRef?.openDialog()"
            >编辑</el-button
          >
          <el-button
            link
            size="small"
            class="operation-admin"
            @click="
              confirmDialogRef?.openDialog(
                '是否确认将此管理员删除?\n删除后将无法恢复。',
                '删除管理员成功'
              )
            "
            >删除</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="" min-width="200"></el-table-column>
    </el-table>
    <!-- 分页按钮 -->
    <pagination :total="20" :page="1" :limit="10" @pagination="handlePageChange" />
  </div>
  <!-- 对话框 -->
  <!-- 查看管理员权限对话框 -->
  <ViewPowerDialog ref="viewPowerDialogRef" />
  <!-- 查看管理员操作日志对话框 -->
  <ViewOperationLogDialog ref="viewOperationLogDialogRef" />
  <!-- 修改管理员权限对话框 -->
  <EditAdminPowerDialog ref="editAdminPowerDialogRef" />
  <!-- 删除确认弹窗 -->
  <ConfirmDialog ref="confirmDialogRef" />
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import Header from '@/views/systemMessage/components/Header.vue'
import ViewPowerDialog from '@/views/acl/components/ViewPowerDialog.vue'
import ViewOperationLogDialog from '@/views/acl/components/ViewOperationLogDialog.vue'
import EditAdminPowerDialog from '@/views/acl/components/EditAdminPowerDialog.vue'
import ConfirmDialog from '@/views/systemMessage/components/ConfirmDialog.vue'

// 获取viewPowerDialog实例
const viewPowerDialogRef = ref<InstanceType<typeof ViewPowerDialog>>()
// 获取viewOperationLogDialog实例
const viewOperationLogDialogRef = ref<InstanceType<typeof ViewOperationLogDialog>>()
// 获取editAdminPowerDialog实例
const editAdminPowerDialogRef = ref<InstanceType<typeof EditAdminPowerDialog>>()
// 获取confirmDialog实例
const confirmDialogRef = ref<InstanceType<typeof ConfirmDialog>>()

const adminList = [{ username: 111 }, { username: 112 }]

// 搜索管理员
const searchAdmin = (keyword: string) => {}

const isOpenDialog = ref(false)
</script>
<style lang="scss" scoped>
.operation-admin {
  text-decoration: underline;
}

:deep(.el-dialog__body) {
  padding: 0px 25px;
}
</style>
