<template>
  <div class="view-wrapper">
    <div class="notice-list-container">
      <Header
        :is-show-time-selection="false"
        is-show-type-selection
        @update-time-limit="onChangeTimeLimit"
        @update-type-limit="onChangeTypeLimit"
        @search="searchNotice"
      >
      </Header>
      <!-- 页面主要内容展示 -->
      <el-main class="main-wrapper">
        <!-- 通知展示表格 -->
        <el-scrollbar class="message-box" ref="scrollbarRef">
          <el-row
            v-for="notice in pendingAuditNotice.records"
            :key="notice.noticeId"
            class="message-item"
            @click="onClickMessage(notice.noticeId, notice.title)"
            :class="{ 'active-message-item': notice.noticeId === currentNoticeId }"
          >
            <div class="content-box">
              <div class="message-item-title">
                <span>{{ notice.title }}</span>
              </div>
              <el-text class="message-item-content" truncated>
                {{ notice.content }}
              </el-text>
            </div>
            <div class="item-info">
              <el-tooltip effect="dark" content="通过" placement="top"
                ><img
                  src="../../assets/icons/passAudit.svg"
                  alt=""
                  class="tooltip-audit"
                  @click="confirmDialogRef!.openDialog(`是否确认通过此通知`, `已通过此通知`)"
              /></el-tooltip>

              <el-tooltip effect="dark" content="打回" placement="top"
                ><img
                  src="../../assets/icons/repulse.svg"
                  alt=""
                  class="tooltip-audit"
                  @click="openCallBackDialog"
              /></el-tooltip>
            </div>
            <div class="date">{{ notice.publishTime }}</div>
          </el-row>
          <el-row v-if="!currentNoticeDetail">暂无消息</el-row>
        </el-scrollbar>
      </el-main>
      <!-- 分页按钮 -->
      <Pagination
        :total="auditNoticeStore.pendingAuditNotice.total"
        :page="auditNoticeStore.pendingAuditNotice.current"
        :limit="auditNoticeStore.pendingAuditNotice.size"
        @pagination="handlePageChange"
      />
    </div>
    <!-- 当前选中消息的详情展示 -->
    <NoticeDetailWrapper :current-notice-detail="currentNoticeDetail" />
    <!-- 审核通过对话框 -->
    <ConfirmDialog ref="confirmDialogRef" @confirm="passPendingAuditNotice" />
    <!-- 消息提示框 -->
    <Toast ref="toastRef" :prompt-message="toastMessage" />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, onMounted, computed, watch, toRaw } from 'vue'
import { useAuditNoticeStore } from '@/store/modules/notice/auditNotice'
import { useUserStore } from '@/store/modules/user'
import { useModal } from '@/hook/useModal'
import { updateNoticeStateToPass, rejectNotice } from '@/api/notice'
import type { IPageInfo } from '@/types/pageMessage'
import Header from '@/views/systemMessage/components/Header.vue'
import ConfirmDialog from '@/views/systemMessage/components/ConfirmDialog.vue'
import NoticeDetailWrapper from '@/views/systemMessage/components/NoticeDetailWrapper.vue'
import Toast from '@/views/systemMessage/components/Toast.vue'
import CallBackDialog from '@/views/systemMessage/components/CallBackDialog.vue'

// store数据
const auditNoticeStore = useAuditNoticeStore()
const userStore = useUserStore()

const { refreshPendingAuditNotice, updatePendingAuditNotice } = auditNoticeStore
const { pendingAuditNotice } = storeToRefs(auditNoticeStore)
const { showModal } = useModal()

// 待绑定滚动条组件
const scrollbarRef = ref<HTMLElement | null>(null)
// 获取confirmDialog实例
const confirmDialogRef = ref<InstanceType<typeof ConfirmDialog>>()
// 获取toast实例
const toastRef = ref<InstanceType<typeof Toast>>()
// 消息提示框提示信息
const toastMessage = ref('')
// 当前选中的通知的Id
const currentNoticeId = ref(0)
// 当前选中的通知的标题
const currentNoticeTitle = ref('')
// 搜索关键词
const searchKeyword = ref('')
// 通知时间限制
const timeLimit = ref(0)
// 通知类型限制
const typeLimit = ref(0)
// 页面参数
const pageInfo = ref({
  currentPage: 1,
  pageLimit: 10
})

// 当前选中通知的详细内容
const currentNoticeDetail = computed(() => {
  return pendingAuditNotice.value.records.find((item) => item.noticeId === currentNoticeId.value)
})

watch(
  () => pendingAuditNotice.value.records[0],
  (newVal) => {
    if (newVal) {
      // 更新当前展示信息id
      currentNoticeId.value = newVal.noticeId
    }
  }
)

onMounted(async () => {
  // 获取分组
  // 获取该管理员所有通知
  await Promise.all([userStore.getUserGroup(), refreshPendingAuditNotice()])
  currentNoticeId.value = pendingAuditNotice.value.records[0].noticeId
})

// 更新页面展示信息
const handlePageChange = (pageMessage: IPageInfo) => {
  pageInfo.value = pageMessage
  updatePendingAuditNotice(
    pageInfo.value.currentPage,
    pageInfo.value.pageLimit,
    searchKeyword.value,
    typeLimit.value,
    timeLimit.value
  )
  // 滚动条回滚到顶端
  scrollbarRef.value?.scrollTo(0, 0)
}

// 点击通知
const onClickMessage = (messageId: number, title: string) => {
  // 更新当前选中通知的Id和标题
  currentNoticeId.value = messageId
  currentNoticeTitle.value = title
}

// 确认打回通知
const repulseNotice = async (comment: string, imgUrlList: string[]) => {
  await rejectNotice(comment, currentNoticeTitle.value, currentNoticeId.value, imgUrlList)
  toastMessage.value = '已打回通知'
  toastRef.value?.openToast()
  refreshPendingAuditNotice()
}

// 审核通过
const passPendingAuditNotice = async () => {
  await updateNoticeStateToPass(currentNoticeTitle.value, currentNoticeId.value)
  toastMessage.value = '已审核通过'
  toastRef.value?.openToast()
  refreshPendingAuditNotice()
}
// 搜索框筛选通知
const searchNotice = async (keyword: string) => {
  // 更新搜索关键字
  searchKeyword.value = keyword
  // 发送请求更新数据
  await updatePendingAuditNotice(
    pageInfo.value.currentPage,
    pageInfo.value.pageLimit,
    searchKeyword.value,
    typeLimit.value,
    timeLimit.value
  )
}

// 根据时间筛选通知
const onChangeTimeLimit = (time: number) => {
  // 更新时间限制
  timeLimit.value = time
  updatePendingAuditNotice(
    pageInfo.value.currentPage,
    pageInfo.value.pageLimit,
    searchKeyword.value,
    typeLimit.value,
    timeLimit.value
  )
}

// 根据类型筛选通知
const onChangeTypeLimit = (type: number) => {
  // 更新类型限制
  typeLimit.value = type
  updatePendingAuditNotice(
    pageInfo.value.currentPage,
    pageInfo.value.pageLimit,
    searchKeyword.value,
    typeLimit.value,
    timeLimit.value
  )
}

// 打开打回弹窗
const openCallBackDialog = () => {
  showModal(CallBackDialog, {
    dialogTitle: '打回依据',
    commentTitle: '审核意见',
    onConfirm: repulseNotice
  })
}
</script>

<style scoped lang="scss">
.view-wrapper {
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin: 15px 0 0 15px;
}

.notice-list-container {
  width: 65%;
  background-color: #fff;
}

.current-notice-wrapper {
  width: 35%;
  background-color: #fff;
  padding: 30px 25px;
  gap: 10px;
}

.remove-notice-btn {
  display: flex;
  height: 38px;
  padding: 8px 16px;
  justify-content: center;
  align-items: center;
  gap: 3px;
  color: #fff;
  font-family: Inter;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 1.44px;
}

.message-box {
  height: 70vh;
  margin-top: 20px;
}

.message-item {
  position: relative;
  height: 120px;
  margin-right: 15px;

  border-top: 1px solid #e4e7ed;
  border-bottom: 1px solid #e4e7ed;
  background: #fff;
}

.message-item:hover {
  background-color: #fafafa;
}

.content-box {
  position: absolute;
  top: 20px;
  left: 5px;
}

.message-item-title {
  color: var(--2F3367, #2f3367);
  font-family: Inter;
  font-size: 1rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: 1.6px;
}

.message-item-content {
  margin-top: 14px;
  width: 90%;
  color: var(--8A8EA8, #8a8ea8) !important;
  font-family: Inter;
  font-size: 0.8em;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 1.28px;
}

.date {
  position: absolute;
  top: 20px;
  right: 5px;
  color: var(--8A8EA8, #8a8ea8);
  font-family: Inter;
  font-size: 0.5em;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 1.28px;
}

.item-info {
  position: absolute;
  bottom: 8px;
  right: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

// 消息提示框
.active-message-item {
  background-color: #fafafa;
}

.main-wrapper {
  padding: 0 10px 0 20px;
}

.tooltip-audit {
  width: 1.3em;
  height: 1.3em;
  margin: 9px;
}
</style>
