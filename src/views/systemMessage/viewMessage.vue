<template>
  <div class="view-wrapper">
    <div class="notice-list-container">
      <Header
        is-show-time-selection
        is-show-type-selection
        @update-limit="onChangeLimit"
        @search="searchNotice"
      >
        <template #button>
          <el-button
            type="primary"
            :icon="isDeleteState ? undefined : EditPen"
            class="remove-notice-btn"
            color="#2F3367"
            @click="isDeleteState = !isDeleteState"
          >
            {{ isDeleteState ? '取消' : '删除通知' }}
          </el-button>
        </template>
      </Header>
      <!-- 页面主要内容展示 -->
      <el-main class="main-wrapper">
        <!-- 通知展示表格 -->
        <el-scrollbar class="message-box" ref="scrollbarRef">
          <el-row
            v-for="notice in allNoticeList.records"
            :key="notice.noticeId"
            class="message-item"
            @click="onClickMessage(notice.noticeId)"
            :class="{ 'active-message-item': notice.noticeId === currentNoticeId }"
          >
            <div class="content-box">
              <div class="delete-icon" v-if="isDeleteState">
                <img src="../../assets/icons/delete-message.svg" alt="删除通知" />
              </div>
              <div>
                <div class="message-item-title">
                  <!-- 通知发送给不同的用户显示不同的图标 -->
                  <img
                    class="deliver-to-user-img"
                    v-if="notice.userId === 1"
                    src="../../assets/imgs/deliver-to-single.png"
                  />
                  <img
                    class="deliver-to-user-img"
                    v-else-if="notice.groupId !== 0"
                    src="../../assets/imgs/deliver-to-group.png"
                  />
                  <span>{{ notice.title }}</span>
                </div>
                <el-text class="message-item-content" truncated>
                  {{ notice.content }}
                </el-text>
              </div>
            </div>
            <div class="item-info">
              <div class="item-publisher">
                <el-icon class="user-icon"><UserFilled /></el-icon>
                <span class="icon-gap">发布者:{{ notice.adminName }}</span>
              </div>
              <div class="item-browse-num">
                <div v-if="notice.userId === 1 && notice.userIds.length > 1">
                  <span class="icon-gap">发布给多个用户</span>
                </div>
                <div v-else-if="notice.userId === 1 && notice.userIds.length === 1">
                  <span class="icon-gap">用户ID: {{ notice.userIds[0] }}</span>
                </div>
                <div v-else-if="notice.groupId !== 0">
                  <span class="icon-gap"
                    >分组: {{ getGroupName(notice.groupId) || '暂无分组' }}</span
                  >
                </div>
                <div class="deliver-to-all-icon" v-else>
                  <el-icon class="user-icon"><View /></el-icon>
                  <span class="icon-gap">浏览:{{ notice.browse }}</span>
                </div>
              </div>
            </div>
            <div class="date">{{ notice.publishTime }}</div>
          </el-row>
        </el-scrollbar>
      </el-main>
      <!-- 分页按钮 -->
      <Pagination
        :total="viewNoticeStore.allNoticeList.total"
        :page="viewNoticeStore.allNoticeList.current"
        :limit="viewNoticeStore.allNoticeList.size"
        @pagination="handlePageChange"
      />
    </div>
    <!-- 当前选中消息的详情展示 -->
    <NoticeDetailWrapper v-show="!isDeleteState" :current-notice-detail="currentNoticeDetail" />
  </div>
  <!-- 对话框 -->
  <ConfirmDialog
    ref="confirmDialogRef"
    :confirmation-message="`是否确认将此通知删除?\n删除后将无法恢复。`"
    :prompt-message="`已删除此通知`"
    @confirm="handleDeleteNotice"
  />
</template>

<script lang="ts" setup>
import { EditPen, UserFilled, View } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { ref, onMounted, computed, watch } from 'vue'
import { useViewNoticeStore } from '@/store/modules/notice/viewNotice'
import { useUserStore } from '@/store/modules/user'
import { deleteAnyNotice } from '@/api/notice'
import type { IPageInfo } from '@/types/pageMessage'
import Header from '@/views/systemMessage/components/Header.vue'
import ConfirmDialog from '@/views/systemMessage/components/ConfirmDialog.vue'
import NoticeDetailWrapper from '@/views/systemMessage/components/NoticeDetailWrapper.vue'

// store数据
const viewNoticeStore = useViewNoticeStore()
const userStore = useUserStore()

const { refreshAllNoticeList, updateAllNoticeList } = viewNoticeStore
const { allNoticeList } = storeToRefs(viewNoticeStore)
const { userGroupList } = storeToRefs(userStore)

// 待绑定滚动条组件
const scrollbarRef = ref<HTMLElement | null>(null)

// 获取confirmDialog实例
const confirmDialogRef = ref<InstanceType<typeof ConfirmDialog>>()

// 搜索框内容
const searchKeyword = ref('')

// 是否处于删除状态
const isDeleteState = ref(false)

// 当前展示的通知的Id
const currentNoticeId = ref(0)

// 通知时间限制
const timeLimit = ref(0)

// 通知类型限制
const typeLimit = ref(0)
// 获取用户分组名称
const getGroupName = (groupId: number) => {
  return userGroupList.value.find((item) => item.groupId === groupId)?.groupName
}

// 当前选中通知的详细内容
const currentNoticeDetail = computed(() => {
  return allNoticeList.value.records.find((item) => item.noticeId === currentNoticeId.value)
})

watch(allNoticeList.value.records[0], (newVal) => {
  // 更新当前展示信息id
  currentNoticeId.value = newVal.noticeId
})

onMounted(async () => {
  // 获取分组
  // 获取该管理员所有通知
  await Promise.all([
    userStore.getUserGroupList(),
    refreshAllNoticeList('', typeLimit.value, timeLimit.value)
  ])
  currentNoticeId.value = allNoticeList.value.records[0].noticeId
  console.log(currentNoticeId.value)
})

// 更新页面展示信息
const handlePageChange = async (pageMessage: IPageInfo) => {
  await updateAllNoticeList(
    pageMessage.currentPage,
    pageMessage.pageLimit,
    searchKeyword.value,
    typeLimit.value,
    timeLimit.value
  )
  // 滚动条回滚到顶端
  scrollbarRef.value?.scrollTo(0, 0)
}

// 点击通知
const onClickMessage = (messageId: number) => {
  // 更新当前选中通知的Id和标题
  currentNoticeId.value = messageId
  // 判断当前是否处于删除状态
  if (isDeleteState.value) {
    // 处在删除状态--打开确认删除弹窗
    confirmDialogRef.value!.openDialog()
  }
}

// 删除通知
const handleDeleteNotice = async () => {
  // 拿到待删除的通知Id发送请求
  await deleteAnyNotice(currentNoticeDetail.value!.title, currentNoticeId.value)
  // 发送请求获取新数据
  await refreshAllNoticeList(searchKeyword.value, typeLimit.value, timeLimit.value)
}

// 搜索框筛选通知
const searchNotice = async (keyword: string) => {
  // 更新搜索关键词
  searchKeyword.value = keyword
  // 发送请求更新数据
  await refreshAllNoticeList(searchKeyword.value, typeLimit.value, timeLimit.value)
}

// 根据时间or类型筛选通知
const onChangeLimit = async (time: number, type: number) => {
  // 更新时间限制
  timeLimit.value = time
  typeLimit.value = type
  await refreshAllNoticeList(searchKeyword.value, typeLimit.value, timeLimit.value)
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

.select-box {
  display: flex;
  justify-content: space-between;
  width: 15vw;
  border: none;
}

:deep(.select-box .el-select__placeholder) {
  color: #2f3367;
  font-weight: 600;
}

.header {
  display: flex;
  padding: 10px 10px 0 20px;
  justify-content: space-between;
  align-self: center;
}
.search-box {
  display: flex;
  height: 32px;
}

.message-box {
  height: 64vh;
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

.deliver-to-user-img {
  width: 18px;
  height: 18px;
  margin-right: 3px;
  vertical-align: top;
}

.content-box {
  display: flex;
  align-items: center;
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
  bottom: 10px;
  right: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}
.item-publisher {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;

  color: var(--8A8EA8, #8a8ea8);
  font-family: Inter;
  font-size: 0.5em;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 1.28px;
}
.item-browse-num {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 6px;
  gap: 2px;

  color: var(--8A8EA8, #8a8ea8);
  font-family: Inter;
  font-size: 0.5em;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 1.28px;
}

/* 右侧盒子 */
.detail-title {
  padding: 20px;
  color: var(--2F3367, #2f3367);
  font-size: 1rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1rem;
  letter-spacing: 1.6px;
  text-align: center;
}
.detail-info {
  display: flex;
  justify-content: space-between;
}

.current-notice-publisher {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;

  color: var(--8A8EA8, #8a8ea8);
  font-family: Inter;
  font-size: 0.5em;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 1.28px;
}

.detail-info-date {
  color: var(--8A8EA8, #8a8ea8) !important;
  font-family: Inter;
  font-size: 0.8em;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 1.28px;
}

.detail-content {
  display: inline-flex;
  width: 100%;
  margin: 5px 0;
  padding: 24px 36px;
  justify-content: center;
  align-items: center;
  gap: 10px;

  border-top: 2px solid #e4e7ed;
  border-bottom: 2px solid #e4e7ed;

  color: var(--8A8EA8, #8a8ea8) !important;
  font-family: Inter;
  font-size: 0.8em;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 1.28px;
}

.current-notice-browse-num {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 2px;

  color: var(--8A8EA8, #8a8ea8);
  font-family: Inter;
  font-size: 0.5em;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 1.28px;
}

.deliver-to-all-icon {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.delete-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  margin-right: 22px;
  flex-shrink: 0;
  border-radius: 4px;
  border: 2px solid var(--8A8EA8, #8a8ea8);
  background: #ecf2ff;
  box-shadow: 2px 3px 4px 1px rgba(142, 142, 142, 0.17);
}

.warning-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}

.warning-icon img {
  display: inline-block;
  margin-right: 12px;
  width: 32px;
  height: 32px;
}

:deep(.select-box .el-select__wrapper) {
  box-shadow: none !important;
}
.select-box .el-select .el-input.is-focus .el-input__inner {
  color: #fff;
  background-color: #2f3367;
}

.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  color: #fff;
  background-color: #8a8ea8;
}
// 对话框样式修改
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
.toast {
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
.toast .message-item-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.toast p {
  margin: 16px;
  color: #fff;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 1.28px;
}

.active-message-item {
  background-color: #fafafa;
}

.select-time {
  width: 120px;
  margin: 5px 0 0;
}

.select-type {
  width: 150px;
  margin: 5px 0 0;
}

.main-wrapper {
  padding: 0 10px 0 20px;
}

.user-icon {
  font-size: 1.5rem;
}

.icon-gap {
  padding-left: 5px;
}
</style>
