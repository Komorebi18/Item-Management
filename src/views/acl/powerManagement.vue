<template>
  <div class="wrapper">
    <Header :is-show-time-selection="false" :is-show-type-selection="false" @search="searchAdmin">
      <template #button>
        <el-button
          type="primary"
          :icon="Plus"
          class="remove-notice-btn"
          color="#2F3367"
          @click="addAdminDialogRef?.openDialog()"
        >
          添加管理员
        </el-button>
      </template>
    </Header>
    <!-- 数据展示行 -->
    <el-table :data="adminMessageList.records" class="userInfoList">
      <el-table-column prop="username" label="用户名" min-width="200" align="center" />
      <el-table-column label="管理员权限" min-width="300" align="center">
        <template #default="props">
          <el-button
            link
            size="small"
            class="operation-admin"
            @click="onClickViewAdminPower(props.row)"
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
            @click="onClickViewAdminLog(props.row)"
            >查看日志</el-button
          >
          <el-button
            link
            size="small"
            class="operation-admin"
            @click="onClickEditAdminPower(props.row)"
            >编辑</el-button
          >
          <el-button link size="small" class="operation-admin" @click="onClickDeleteBtn(props.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="" min-width="200"></el-table-column>
    </el-table>
    <!-- 分页按钮 -->
    <pagination
      :total="adminMessageList.total"
      :page="adminMessageList.current"
      :limit="adminMessageList.size"
      @pagination="handlePageChange"
    />
    <!-- 对话框 -->
    <!-- 新增管理员弹窗 -->
    <AddAdminDialog
      :admin-authority="adminAuthority"
      ref="addAdminDialogRef"
      @confirm="addNewAdminAccount"
    />
    <!-- 查看管理员权限对话框 -->
    <ViewPowerDialog :admin-message="currentAdminMessage" ref="viewPowerDialogRef" />
    <!-- 查看管理员操作日志对话框 -->
    <ViewOperationLogDialog
      ref="viewOperationLogDialogRef"
      :admin-log-list="adminLogList.records"
      @load-more="loadMoreAdminLog"
    />
    <!-- 修改管理员权限对话框 -->
    <EditAdminPowerDialog
      :admin-message="currentAdminMessage"
      ref="editAdminPowerDialogRef"
      @confirm="editAdminPower"
    />
    <!-- 删除确认弹窗 -->
    <ConfirmDialog ref="confirmDialogRef" @confirm="deleteAdminAccount" />
    <!-- 消息提示框 -->
    <Toast ref="toastRef" :prompt-message="promptMessage" />
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useAdminAuthorityStore } from '@/store/modules/acl'
import { deleteAdmin, addNewAdmin, modifyAdminAuthority } from '@/api/acl'
import type { IAdminMessage, IAdminLog, IAdminPower } from '@/types/acl/index'
import type { IPageInfo } from '@/types/pageMessage'
import Header from '@/views/systemMessage/components/Header.vue'
import ViewPowerDialog from '@/views/acl/components/ViewPowerDialog.vue'
import ViewOperationLogDialog from '@/views/acl/components/ViewOperationLogDialog.vue'
import EditAdminPowerDialog from '@/views/acl/components/EditAdminPowerDialog.vue'
import AddAdminDialog from '@/views/acl/components/AddAdminDialog.vue'
import ConfirmDialog from '@/views/systemMessage/components/ConfirmDialog.vue'
import Toast from '@/views/systemMessage/components/Toast.vue'

const adminAuthorityStore = useAdminAuthorityStore()
const { updateAdminMessageList, refreshAdminMessageList, getAdminLogList, getAllAdminAuthority } =
  adminAuthorityStore
const { adminMessageList, adminLogList, adminAuthority } = storeToRefs(adminAuthorityStore)

onMounted(() => {
  refreshAdminMessageList()
  getAllAdminAuthority()
})

// 获取addAdminDialog实例
const addAdminDialogRef = ref<InstanceType<typeof AddAdminDialog>>()
// 获取viewPowerDialog实例
const viewPowerDialogRef = ref<InstanceType<typeof ViewPowerDialog>>()
// 获取viewOperationLogDialog实例
const viewOperationLogDialogRef = ref<InstanceType<typeof ViewOperationLogDialog>>()
// 获取editAdminPowerDialog实例
const editAdminPowerDialogRef = ref<InstanceType<typeof EditAdminPowerDialog>>()
// 获取confirmDialog实例
const confirmDialogRef = ref<InstanceType<typeof ConfirmDialog>>()
// 获取toast实例
const toastRef = ref<InstanceType<typeof Toast>>()

// 搜索关键词
const searchKeyword = ref('')
// 消息提示框信息
const promptMessage = ref('')
// 当前管理员的信息
const currentAdminMessage = ref<IAdminMessage>({
  adminId: 0,
  username: '',
  roles: []
})

// 暂存页码信息
const page = ref<IPageInfo>({
  currentPage: 1,
  pageLimit: 10
})

// 搜索管理员
const searchAdmin = (keyword: string) => {
  searchKeyword.value = keyword
  updateAdminMessageList(page.value.currentPage, page.value.pageLimit, searchKeyword.value)
}

// 页码改变
const handlePageChange = (pageMessage: IPageInfo) => {
  page.value = pageMessage
  updateAdminMessageList(page.value.currentPage, page.value.pageLimit, searchKeyword.value)
}

// 点击查看管理员日志按钮
const onClickViewAdminLog = (data: IAdminMessage) => {
  // 暂存当前管理员信息
  currentAdminMessage.value = data
  getAdminLogList(currentAdminMessage.value.adminId)
  viewOperationLogDialogRef.value?.openDialog()
}

// 点击查看管理员权限按钮
const onClickViewAdminPower = (data: IAdminMessage) => {
  // 暂存当前管理员信息
  currentAdminMessage.value = data
  viewPowerDialogRef.value?.openDialog()
}

// 点击编辑管理员的权限按钮
const onClickEditAdminPower = (data: IAdminMessage) => {
  // 暂存当前管理员信息
  currentAdminMessage.value = data
  editAdminPowerDialogRef.value?.openDialog()
}

// 点击删除管理员账号按钮
const onClickDeleteBtn = (data: IAdminMessage) => {
  // 暂存当前管理员信息
  currentAdminMessage.value = data
  confirmDialogRef.value?.openDialog('是否确认将此管理员删除?\n删除后将无法恢复。', '删除成功')
}

// 加载更多管理员日志
const loadMoreAdminLog = () => {
  if (adminLogList.value.current < adminLogList.value.pages) {
    getAdminLogList(currentAdminMessage.value.adminId)
  }
}

// 修改管理员权限
const editAdminPower = async (adminRoles: IAdminPower[]) => {
  const roles = adminRoles.map((role) => {
    // 使用解构赋值时，通过排除掉要删除的属性名来创建新对象
    const { content: _, ...newRoles } = role
    return newRoles // 返回不包含指定属性的新对象
  })
  await modifyAdminAuthority(currentAdminMessage.value.adminId, roles)
  showToast('修改管理员权限成功')
}

// 删除管理员账号
const deleteAdminAccount = async () => {
  await deleteAdmin(currentAdminMessage.value.adminId)
  showToast('删除管理员成功')
}

// 新增管理员账号
const addNewAdminAccount = async (account: string, password: string, authorityIdList: number[]) => {
  await addNewAdmin(account, password, authorityIdList, '')
  showToast('成功添加管理员')
}

// 修改数据后续操作
const showToast = (toastMsg: string) => {
  promptMessage.value = toastMsg
  toastRef.value?.openToast()
  // 筛选列表数据
  refreshAdminMessageList()
}
</script>
<style lang="scss" scoped>
.operation-admin {
  text-decoration: underline;
}

:deep(.el-dialog__body) {
  padding: 5px 25px;
}
</style>
