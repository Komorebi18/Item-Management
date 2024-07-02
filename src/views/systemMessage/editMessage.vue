<template>
  <div>
    <div class="message-box">
      <div class="message-detail">
        <el-input
          placeholder="请在这里输入标题"
          v-model="messageTitle"
          type="text"
          :disabled="isViewingState"
          class="message-title"
        />
        <div class="parting-line"></div>
        <el-input
          v-model="messageContent"
          placeholder="请在这里输入正文"
          type="textarea"
          :disabled="isViewingState"
          resize="none"
          class="main-text"
        />
      </div>
      <div class="footer">
        <div class="word-count">正文共 {{ messageContent.length }} 字</div>
        <div class="button" v-if="!isViewingState">
          <el-button @click="setDraft">保存为草稿</el-button>
          <el-button @click="deliverDialogRef!.openDeliverDialog()">发布</el-button>
        </div>
      </div>
    </div>
    <!-- 提示框 -->
    <!-- 暂存草稿提示 -->
    <Toast ref="toastRef" :prompt-message="toastMessage" />
    <!-- 发布对话框 -->
    <DeliverOptionDialog ref="deliverDialogRef" @confirm="confirmDeliver" />
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { ref, computed } from 'vue'
import { useDeliverNoticeStore } from '@/store/modules/notice/deliverNotice'
import { updateNoticeContent, addNewNotice } from '@/api/notice'
import Toast from '@/views/systemMessage/components/Toast.vue'
import DeliverOptionDialog from '@/views/systemMessage/components/DeliverOptionDialog.vue'

// 发送方式枚举
enum DELIVER_MODE {
  TO_ALL_USER,
  TO_GROUP_USER,
  TO_SPECIFIED_USER
}

const deliverNoticeStore = useDeliverNoticeStore()
const { singleAdminNoticeList } = storeToRefs(deliverNoticeStore)

// 常量声明
// 新建通知为草稿
const NEW_NOTICE_DRAFT = 1
// 新建通知为待审核
const NEW_NOTICE_PENDING = 2

// 初始化路由实例
const router = useRouter()
// 初始化路由对象
const route = useRoute()

// 获取toast实例
const toastRef = ref<InstanceType<typeof Toast>>()
// 获取发送选项对话框实例
const deliverDialogRef = ref<InstanceType<typeof DeliverOptionDialog>>()
// 是否为查看通知状态--查看状态不展示操作按钮
const isViewingState = ref(route.query.isViewingState === '1')

// 通知ID
const messageId = parseInt(route.query.noticeId as string)
// 当前选中通知的详细内容
const currentNoticeDetail = computed(() => {
  return singleAdminNoticeList.value.records.find((item) => item.noticeId === messageId)
})
// 通知正文
const messageContent = ref(currentNoticeDetail.value?.content || '')
// 通知标题
const messageTitle = ref(currentNoticeDetail.value?.title || '')
// 通知类型的ID
const selectedTypeId = ref(1)
// 提示框信息
const toastMessage = ref('')

// 点击保存为草稿触发
const setDraft = async () => {
  // 通过messageId是否初始化判断是新建一条通知还是重新编辑已有通知
  if (Number.isInteger(messageId)) {
    // 新增通知草稿
    await addNewNotice(NEW_NOTICE_DRAFT, messageTitle.value, messageContent.value, -1, 0, 0, [])
  } else {
    //在已有通知的基础上修改
    await updateNoticeContent(
      messageTitle.value,
      messageContent.value,
      -1,
      messageId,
      [],
      0,
      selectedTypeId.value
    )
  }
  // 打开提示框
  toastMessage.value = '已保存为草稿'
  toastRef.value!.openToast()
  router.back()
}

// 确认发布通知
const confirmDeliver = (
  deliverMode: number,
  noticeTypeId: number,
  userIdList: number[],
  groupId: number
) => {
  // 更新数据
  selectedTypeId.value = noticeTypeId
  // 通过messageId是否初始化判断是新建一条通知还是重新编辑已有通知
  if (Number.isInteger(messageId)) {
    // 新增待审核通知
    if (deliverMode === DELIVER_MODE.TO_ALL_USER) {
      // 发送给所有人
      addNewNotice(
        NEW_NOTICE_PENDING,
        messageTitle.value,
        messageContent.value,
        -1,
        0,
        selectedTypeId.value,
        []
      )
    } else if (deliverMode === DELIVER_MODE.TO_GROUP_USER) {
      // 发送给分组
      addNewNotice(
        NEW_NOTICE_PENDING,
        messageTitle.value,
        messageContent.value,
        0,
        groupId,
        selectedTypeId.value,
        []
      )
    } else if (deliverMode === DELIVER_MODE.TO_SPECIFIED_USER) {
      // 发送给个人
      addNewNotice(
        NEW_NOTICE_PENDING,
        messageTitle.value,
        messageContent.value,
        1,
        0,
        selectedTypeId.value,
        userIdList
      )
    }
    // 打开提示框
    toastMessage.value = `发布成功\n请等待管理员审核`
    toastRef.value!.openToast()
    router.back()
  }
}
</script>
<style lang="scss" scoped>
.message-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 1000px;
  height: 80vh;
  margin: 33px auto 0;
  background-color: #fff;
  box-shadow: 0px -7px 11.4px 0px rgba(184, 186, 202, 0.07);
}
.message-detail {
  display: flex;
  flex-direction: column;
  flex: 5;
  padding: 50px;
  color: #2f3367;
}

:deep(.message-detail .el-input__wrapper) {
  background-color: #fff;
  box-shadow: none;
}

:deep(.message-detail .el-textarea__inner) {
  background-color: #fff;
  box-shadow: none;
}

:deep(.el-textarea__inner) {
  height: 50vh;
}

.main-text {
  flex: 5;
  color: var(--8A8EA8, #8a8ea8);
  font-family: Inter;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 1.6px;
}

.footer {
  position: relative;
  flex: 1;
  bottom: 0;
  height: 120px;
  width: 100%;
  color: var(--8A8EA8, #8a8ea8);
  font-family: Inter;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 1.28px;
  background: #fff;
  box-shadow: 0px -4px 5.8px 0px rgba(185, 188, 205, 0.54);
}

.button {
  position: absolute;
  bottom: 19px;
  right: 40px;
}

.el-button {
  border-color: #2f3367;
  color: #2f3367;
}

.el-button:hover {
  background-color: #2f3367;
  color: #fff;
}
.el-button:focus {
  background-color: #fff;
  border-color: #2f3367;
  color: #2f3367;
}

:deep(.el-switch__core) {
  background-color: #e4e7ed;
}

:deep(.el-switch__action) {
  left: 2px;
  background-color: #2f3367;
}
:deep(.is-checked .el-switch__action) {
  left: calc(100% - 18px) !important;
  background-color: #e4e7ed;
}

:deep(.el-dialog__body) {
  display: flex;
  flex-direction: column;
  display: flex;
  width: 100%;
  padding: 5px;
}

.button-box {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding: 14px 25px;
}

.select-detail {
  display: flex;
  justify-content: flex-start !important;
  gap: 20px;
}

:deep(.el-select__placeholder) {
  color: #000;
  font-size: 0.8rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 1.12px;
}

:deep(.el-select__icon) {
  color: #000;
}
:deep(.select-box .el-select__wrapper) {
  border-radius: 81px;
  background-color: #f2f3f5;
  box-shadow: none !important;
}

.select-header {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.search-box {
  display: flex;
  padding: 10px 50px;
  width: 100%;
  height: 52px;
}

.select-header-title {
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 32px;
  line-height: 32px;
  background-color: #f2f3f7;
  color: var(--2F3367, #2f3367);
  font-size: 1rem;
  text-align: center;
}

.button-confirm {
  color: #fff;
  border: none;
}

.select-option {
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 32px;
  line-height: 32px;
  color: var(--2F3367, #2f3367);
  font-size: 1rem;
  text-align: center;
}

.select-option span {
  flex: 1;
}

.activeFont {
  color: var(--2F3367, #2f3367);
}

.deliver-one {
  display: flex;
  justify-content: flex-start !important;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
}

.selected-one {
  display: flex;
  align-items: center;
  padding: 3px 5px 3px 12px;
  border-radius: 5px;
  text-align: center;
  color: #fff;
  font-weight: 100;
  background-color: #8a8ea8;
}

.delete-icon:hover {
  color: #000;
}

.message-title {
  font-size: 1.3rem;
  margin-bottom: 5px;
}

.parting-line {
  height: 1px;
  width: 100%;
  background-color: #d9d9d9;
  margin-bottom: 15px;
}

.word-count {
  margin: 20px 36px;
}
</style>
