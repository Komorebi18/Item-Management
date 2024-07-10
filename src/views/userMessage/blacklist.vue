<template>
  <div class="wrapper">
    <!-- 头部内容 -->
    <Header :is-show-time-selection="false" :is-show-type-selection="false" @search="searchUser">
      <template #button>
        <el-button
          type="primary"
          :icon="isViewBlackList ? Plus : undefined"
          class="remove-notice-btn"
          color="#2F3367"
          @click="isViewBlackList = !isViewBlackList"
        >
          {{ isViewBlackList ? '添加黑名单' : '取消' }}
        </el-button>
      </template>
    </Header>
    <!-- 数据展示行 -->
    <el-table
      v-if="blacklistUserList.records && allUserMessage.records"
      :data="isViewBlackList ? blacklistUserList.records : allUserMessage.records"
      class="userInfoList"
    >
      <el-table-column prop="username" label="用户名" width="150" />
      <el-table-column prop="userId" label="用户id" width="180" align="center" />
      <el-table-column prop="phone" label="用户注册手机号" width="260" align="center" />
      <el-table-column
        v-if="isViewBlackList"
        prop="inTime"
        label="拉入黑名单的时间"
        sortable
        width="260"
        align="center"
      />
      <el-table-column
        v-else
        prop="regTime"
        label="用户注册时间"
        sortable
        width="260"
        align="center"
      />
      <el-table-column label="操作" width="330" align="center">
        <template #default="props">
          <el-button
            size="small"
            @click="
              onClickBlacklistChange(isViewBlackList ? props.row.blacklistId : props.row.userId)
            "
            class="button-blacklist"
            >{{ isViewBlackList ? '移出黑名单' : '拉入黑名单' }}</el-button
          >
          <el-button
            v-show="isViewBlackList"
            link
            size="small"
            class="button-view-detail"
            @click="viewDetail(props.row)"
            >查看详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页按钮 -->
    <pagination
      :total="isViewBlackList ? blacklistUserList.total : allUserMessage.total"
      :page="isViewBlackList ? blacklistUserList.current : allUserMessage.current"
      :limit="isViewBlackList ? blacklistUserList.size : allUserMessage.size"
      @pagination="handlePageChange"
    />
    <!-- 拉入/移出确认对话框 -->
    <ConfirmDialog ref="confirmDialogRef" @confirm="confirmOperation" />
    <!-- 拉入/移出依据填写对话框 -->
    <CallBackDialog
      :dialog-title="isViewBlackList ? '移出依据' : '拉入依据'"
      :comment-title="isViewBlackList ? '移出依据' : '拉入依据'"
      ref="callBackDialogRef"
      @confirm="openConfirmDialog"
    />
    <!-- 查看详情对话框 -->
    <ViewDetailsDialog
      dialog-title="拉入依据"
      comment-title="拉入依据"
      :blacklist-user-message="currentBlacklistUserInfo"
      ref="viewDetailsDialogRef"
    />
    <!-- 消息提示框 -->
    <Toast ref="toastRef" :prompt-message="toastMessage" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { Plus } from '@element-plus/icons-vue'
import { useUserBlacklistStore } from '@/store/modules/userManagement/blacklist'
import { moveInBlacklist, moveOutBlacklist } from '@/api/user'
import type { IPageInfo } from '@/types/pageMessage'
import type { IBlacklistUserInfo } from '@/types/user'
import Header from '@/views/systemMessage/components/Header.vue'
import Toast from '@/views/systemMessage/components/Toast.vue'
import ConfirmDialog from '@/views/systemMessage/components/ConfirmDialog.vue'
import CallBackDialog from '@/views/systemMessage/components/CallBackDialog.vue'
import ViewDetailsDialog from '@/views/userMessage/components/ViewDetailsDialog.vue'

const userBlacklistStore = useUserBlacklistStore()

const { refreshUserList, updateUserList, refreshBlacklistUserList, updateBlacklistUserList } =
  userBlacklistStore
const { allUserMessage, blacklistUserList } = storeToRefs(userBlacklistStore)

// 获取callBackDialogRef实例
const callBackDialogRef = ref<InstanceType<typeof CallBackDialog>>()
// 获取confirmDialogRef实例
const confirmDialogRef = ref<InstanceType<typeof ConfirmDialog>>()
// 获取viewDetailsDialogRef实例
const viewDetailsDialogRef = ref<InstanceType<typeof ViewDetailsDialog>>()

// 是否处于查看黑名单状态
const isViewBlackList = ref(true)

// 搜索关键词
const searchKeyword = ref('')

// 消息提示框内容
const toastMessage = ref('')

// 移入/移出文字依据
const blacklistComment = ref('')
// 移入移出图片依据
const blacklistImgList = ref<string[]>([])
// 暂存当前通知Id（黑名单Id或者用户ID）
const currentId = ref(0)

// 当前黑名单用户详情
const currentBlacklistUserInfo = ref<IBlacklistUserInfo>(blacklistUserList.value.records[0])

// 页面参数
const pageInfo = ref({
  currentPage: 1,
  pageLimit: 10
})

onMounted(() => {
  refreshUserList()
  refreshBlacklistUserList()
})

// 打开确认弹窗
const openConfirmDialog = (basis: string, imgUrlList: string[]) => {
  blacklistComment.value = basis
  blacklistImgList.value = imgUrlList
  // 确认移入/移出黑名单逻辑
  if (isViewBlackList.value) {
    // 处于查看黑名单状态
    confirmDialogRef.value?.openDialog('是否确认将用户移出黑名单', '移出成功')
  } else {
    confirmDialogRef.value?.openDialog('是否确认将用户移入黑名单', '移入成功')
  }
}

// 点击移入/移出黑名单按钮
const onClickBlacklistChange = (id: number) => {
  currentId.value = id
  callBackDialogRef.value?.openDialog()
}

// 搜索逻辑
const searchUser = (keyword: string) => {
  searchKeyword.value = keyword
  if (isViewBlackList.value) {
    updateBlacklistUserList(pageInfo.value.currentPage, pageInfo.value.pageLimit, keyword)
  } else {
    updateUserList(pageInfo.value.currentPage, pageInfo.value.pageLimit, keyword)
  }
}

// 确认移入/移出黑名单逻辑
const confirmOperation = async () => {
  // 确认移入/移出黑名单逻辑
  if (isViewBlackList.value) {
    // 处于查看黑名单状态--移出黑名单
    await moveOutBlacklist(currentId.value, blacklistComment.value, blacklistImgList.value)
    updateUserList(pageInfo.value.currentPage, pageInfo.value.pageLimit, '')
    updateBlacklistUserList(pageInfo.value.currentPage, pageInfo.value.pageLimit, '')
  } else {
    // 移入黑名单
    await moveInBlacklist(currentId.value, blacklistComment.value, blacklistImgList.value)
    updateUserList(pageInfo.value.currentPage, pageInfo.value.pageLimit, '')
    updateBlacklistUserList(pageInfo.value.currentPage, pageInfo.value.pageLimit, '')
  }
}

// 查看黑名单用户详情
const viewDetail = (data: IBlacklistUserInfo) => {
  // 暂存黑名单用户信息
  currentBlacklistUserInfo.value = data
  // 打开详情弹窗
  viewDetailsDialogRef.value?.openDialog()
}

// 页码改变
const handlePageChange = (pageMessage: IPageInfo) => {
  pageInfo.value = pageMessage
  if (isViewBlackList.value) {
    updateBlacklistUserList(pageMessage.currentPage, pageMessage.pageLimit, searchKeyword.value)
  } else {
    updateUserList(pageMessage.currentPage, pageMessage.pageLimit, searchKeyword.value)
  }
}
</script>
<style lang="scss" scoped>
// 父盒子
.wrapper {
  margin: 10px 0 0 10px;
  background-color: #fff;
}

// 页面主体内容样式
.button-view-detail {
  text-decoration: underline;
}

:deep(.el-table__header tr) {
  background-color: #f2f3f7;
}

.userInfoList {
  width: 100%;
  padding-left: 10px;
}

.button-blacklist {
  margin-right: 20px;
}
</style>
