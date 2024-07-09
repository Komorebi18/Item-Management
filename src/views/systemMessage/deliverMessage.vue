<template>
  <div class="box">
    <!-- 页面顶部 -->
    <Header
      is-show-time-selection
      is-show-type-selection
      @search="searchNotice"
      @update-time-limit="filterNoticeByTime"
      @update-type-limit="filterNoticeByType"
    >
      <template #button>
        <el-button
          type="primary"
          :icon="Plus"
          class="button-deliver"
          color="#2F3367"
          @click="deliverMessage"
        >
          发布新的通知
        </el-button>
      </template>
    </Header>
    <!-- 页面主要内容展示 -->
    <el-main class="main-wrapper">
      <!-- 通知展示表格 -->
      <el-tabs v-model="activeTab" class="tabs" @tab-change="handleTabChange">
        <el-scrollbar class="pane-content" ref="scrollbarRef">
          <TabPane
            :noticeList="singleAdminNoticeList.records"
            @view="handleViewIconClick"
            @edit="handleEditIconClick"
            @delete="handleDeleteIconClick"
            @process="handleProcessIconClick"
            @publish="handlePublishIconClick"
          />
        </el-scrollbar>
      </el-tabs>
    </el-main>
    <!-- 分页按钮 -->
    <Pagination
      :total="deliverNoticeStore.singleAdminNoticeList.total"
      :page="deliverNoticeStore.singleAdminNoticeList.current"
      :limit="deliverNoticeStore.singleAdminNoticeList.size"
      @pagination="handlePageChange"
    />
    <!-- 对话框 -->
    <ConfirmDialog ref="toastRef" @confirm="handleConfirm(isDeleteConfirm)" />
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { IPageInfo } from '@/types/pageMessage'
import Header from '@/views/systemMessage/components/Header.vue'
import TabPane from '@/views/systemMessage/components/TabPane.vue'
import ConfirmDialog from '@/views/systemMessage/components/ConfirmDialog.vue'
import { useDeliverNoticeStore } from '@/store/modules/notice/deliverNotice'
import { Plus } from '@element-plus/icons-vue'
import { deleteOwnNotice, publishNoticeToUser } from '@/api/notice'

// store数据
const deliverNoticeStore = useDeliverNoticeStore()
const router = useRouter()

const { refreshSingleAdminNoticeList, updateSingleAdminNoticeList } = deliverNoticeStore
const { singleAdminNoticeList } = storeToRefs(deliverNoticeStore)

// 当前展示的tab
const activeTab = ref(0)

// 选中的通知Id
const chooseMessageId = ref(0)

// 搜索关键词
const searchKeyword = ref('')

// 时间限制
const timeLimit = ref(0)

// 类型限制
const typeLimit = ref(0)

// 页面参数
const pageInfo = ref({
  currentPage: 1,
  pageLimit: 10
})

// 选中的通知标题
const chooseMessageTitle = computed(() => {
  const res = singleAdminNoticeList.value.records.find(
    (item) => item.noticeId === chooseMessageId.value
  )
  return res!.title
})

// 待绑定滚动条组件
const scrollbarRef = ref<HTMLElement | null>(null)

// 确认弹窗信息
const confirmationMessage = ref('')

// 提示弹窗信息
const promptMessage = ref('')

// 是否是删除确认弹窗
const isDeleteConfirm = ref(false)

// 获取toast实例
const toastRef = ref<InstanceType<typeof ConfirmDialog>>()

onMounted(() => {
  // 获取该管理员所有通知
  refreshSingleAdminNoticeList()
})

// tab页签点击触发
const handleTabChange = () => {
  // 获取该管理员对应类型通知通知
  updateSingleAdminNoticeList(
    activeTab.value,
    pageInfo.value.currentPage,
    pageInfo.value.pageLimit,
    searchKeyword.value,
    typeLimit.value,
    timeLimit.value
  )
}

// 点击操作信息icon触发对应函数
// isViewingState: 是否为查看通知状态 - 0表示否，1表示是
// 点击view-icon
const handleViewIconClick = (noticeId: number) => {
  chooseMessageId.value = noticeId
  router.push({
    path: '/system/edit',
    query: { noticeId, isViewingState: 1 }
  })
}
// 点击edit-icon
const handleEditIconClick = (noticeId: number) => {
  chooseMessageId.value = noticeId
  router.push({
    path: '/system/edit',
    query: { noticeId, isViewingState: 0 }
  })
}
// 点击delete-icon
const handleDeleteIconClick = (noticeId: number) => {
  isDeleteConfirm.value = true
  chooseMessageId.value = noticeId
  // 打开确认弹窗
  confirmationMessage.value = `是否确认将此通知删除？`
  promptMessage.value = `已删除此通知`
  toastRef.value!.openDialog(confirmationMessage.value, promptMessage.value)
}

// 点击process-icon
const handleProcessIconClick = (noticeId: number) => {
  chooseMessageId.value = noticeId
  // 接下来的逻辑...
}

// 点击publish-icon
const handlePublishIconClick = (noticeId: number) => {
  isDeleteConfirm.value = false
  chooseMessageId.value = noticeId
  // 打开确认弹窗
  confirmationMessage.value = `是否确认将此通知发布？`
  promptMessage.value = `已发布通知`
  toastRef.value!.openDialog(confirmationMessage.value, promptMessage.value)
}

// 分页按钮点击触发
const handlePageChange = (pageMessage: IPageInfo) => {
  // 更新页面参数
  pageInfo.value = pageMessage
  // 更新页面数据
  updateSingleAdminNoticeList(
    activeTab.value,
    pageInfo.value.currentPage,
    pageInfo.value.pageLimit,
    searchKeyword.value,
    typeLimit.value,
    timeLimit.value
  )
  // 滚动条回滚到顶端
  scrollbarRef.value?.scrollTo(0, 0)
}

// 搜索框筛选通知
const searchNotice = (keyword: string) => {
  searchKeyword.value = keyword
  // 发送请求更新数据
  updateSingleAdminNoticeList(
    activeTab.value,
    pageInfo.value.currentPage,
    pageInfo.value.pageLimit,
    searchKeyword.value,
    typeLimit.value,
    timeLimit.value
  )
}

// 通过通知时间筛选通知
const filterNoticeByTime = (time: number) => {
  timeLimit.value = time
  // 发送请求更新数据
  updateSingleAdminNoticeList(
    activeTab.value,
    pageInfo.value.currentPage,
    pageInfo.value.pageLimit,
    searchKeyword.value,
    typeLimit.value,
    timeLimit.value
  )
}

// 通过通知类型筛选通知
const filterNoticeByType = (type: number) => {
  typeLimit.value = type
  // 发送请求更新数据
  updateSingleAdminNoticeList(
    activeTab.value,
    pageInfo.value.currentPage,
    pageInfo.value.pageLimit,
    searchKeyword.value,
    typeLimit.value,
    timeLimit.value
  )
}

// 确认删除或发布通知
const handleConfirm = async (isDeleteConfirmState: boolean) => {
  if (isDeleteConfirmState) {
    // 删除通知
    await deleteOwnNotice(chooseMessageTitle.value, chooseMessageId.value)
    // 发送请求获取新数据
    refreshSingleAdminNoticeList()
  } else {
    // 正式发布通知
    await publishNoticeToUser(chooseMessageTitle.value, chooseMessageId.value)
    refreshSingleAdminNoticeList()
  }
}

// 发布通知
const deliverMessage = () => {
  // 跳转到编辑页
  router.push({ path: '/system/edit' })
}
</script>

<style lang="scss" scoped>
.box {
  margin: 15px 0 0 15px;
  background-color: #fff;
}
.button-deliver {
  height: 38px;
  padding: 8px 16px;
  color: #fff;
  font-family: Inter;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 1.44px;
}
// 页面头部样式
.header {
  display: flex;
  padding: 10px;
  justify-content: space-between;
  align-self: center;
}

.search-box {
  display: flex;
  width: 378px;
  height: 38px;
}

.search-button {
  height: 38px;
  color: #2f3367;
}

// 页面主体内容样式

.tabs {
  position: relative;
  height: 67vh;
}

.pane-content {
  height: 62vh;
  overflow: auto;
}

.single-message {
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 8px 20px 8px 8px;
}

.title {
  display: flex;
  align-items: center;

  margin-bottom: 6px;
  color: var(--2F3367, #2f3367);
  font-family: Inter;
  font-size: 1rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: 1.6px;
}

.publish-time {
  color: var(--2F3367, #2f3367);
  font-family: Inter;
  font-size: 0.5em;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 1.44px;
}

.deliver {
  color: var(--2F3367, #2f3367);
  font-family: Inter;
  font-size: 0.5em;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 1.28px;
}

.deleteWaing-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}

.deleteWaing-icon img {
  display: inline-block;
  margin-right: 12px;
  width: 32px;
  height: 32px;
}

// 对话框样式修改
:deep(.el-dialog) {
  --el-dialog-margin-top: 30vh;
}

:deep(.el-dialog__body) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--2F3367, #2f3367);
  text-align: center;
  font-family: Inter;
  font-size: 1.2rem;
  font-style: normal;
  font-weight: 500;
  line-height: 122%; /* 29.28px */
}

:deep(.dialog-footer .el-button) {
  background-color: #fff;
  color: #8a8ea8;
  border-color: #8a8ea8;
}
:deep(.dialog-footer .el-button--primary) {
  margin-left: 64px;
  color: #ff7676;
  border-color: #ff7676;
}

// 消息提示框
.alert-box {
  position: absolute;
  top: 30%;
  left: 30%;
  width: 140px;
  height: 140px;
  border-radius: 8px;
  background: var(--2F3367, #2f3367);
  box-shadow: 0px 2px 8.1px 6px rgba(161, 166, 201, 0.35);
  background-color: #2f3367;
}
.alert-box .content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.alert-box p {
  margin: 16px;
  color: #fff;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 1.28px;
}

.main-wrapper {
  padding-top: 0;
  overflow: hidden;
}
</style>
