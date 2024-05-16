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
        <p class="parting-line"></p>
        <el-input
          v-model="messageContent"
          placeholder="请在这里输入正文"
          type="textarea"
          :disabled="isViewingState"
          :resize="'none'"
          class="main-text"
        />
      </div>
      <div class="footer">
        <p class="word-count">正文共 {{ messageContent.length }} 字</p>
        <div class="button" v-if="!isViewingState">
          <el-button @click="setDraft">保存为草稿</el-button>
          <el-button @click="showDeliverBox = true">发布</el-button>
        </div>
      </div>
    </div>
    <!-- 提示框 -->
    <!-- 暂存草稿提示 -->
    <Toast ref="toastRef" :prompt-message="toastMessage" />
    <!-- 发布对话框 -->
    <el-dialog v-model="showDeliverBox" width="30vw" center title="发送通知">
      <div class="select-box">
        <div>
          <span>选择通知类型</span>
          <el-select v-model="typeId" placeholder="请选择通知类型" class="select-notice-type">
            <el-option
              v-for="tag in noticeStore.noticeTypeList"
              :key="tag.typeId"
              :label="tag.typeName"
              :value="tag.typeId"
            />
          </el-select>
        </div>
        <div :class="{ activeFont: isDeliverAll === true }">
          <span>发给所有用户</span>
          <el-switch v-model="isDeliverAll" class="deliver-switch" />
        </div>
        <div :class="{ activeFont: isDeliverGroup === true }">
          <span>分组发送通知</span>
          <el-switch v-model="isDeliverGroup" class="deliver-switch" />
        </div>
        <div class="select-detail" v-if="isDeliverGroup">
          <el-select v-model="groupId" placeholder="请选择分组" class="select-notice-group">
            <el-option
              v-for="group in userStore.userGroupList"
              :key="group.groupId"
              :label="group.groupName"
              :value="group.groupId"
            />
          </el-select>
        </div>
        <div :class="{ activeFont: isDeliverOne === true }">
          <span>发送给个人</span>
          <el-switch v-model="isDeliverOne" class="deliver-switch" />
        </div>
        <div v-if="isDeliverOne" class="deliver-one">
          <div class="selected-box" v-for="user in selectedList" :key="user.userId">
            <div class="selected-one">
              <i class="selected-user-card">{{ user.name }}</i>
              <el-icon class="delete-icon" @click="deleteSelectUser(user.userId)"
                ><Close
              /></el-icon>
            </div>
          </div>
          <el-select
            v-model="selectedUserId"
            placeholder="Select"
            @change="handleSelectionChange"
            class="select-message-user"
            ><ul
              v-infinite-scroll="loadMoreUserInfo"
              class="select-user-list"
              :infinite-scroll-immediate="false"
            >
              <div class="select-header">
                <div class="search-box">
                  <el-input v-model="searchText" placeholder="请输入用户名或ID" />
                  <el-button color="#2F3367">
                    <el-icon class="search-user-icon" color="#fff">
                      <Search />
                    </el-icon>
                  </el-button>
                </div>
                <div class="select-header-title">
                  <span class="option-user-name">用户名</span>
                  <span class="option-user-id">用户ID</span>
                </div>
              </div>
              <el-option
                v-for="user in userStore.userPartialInformation.records"
                :key="user.userId"
                :value="user.userId"
              >
                <div class="select-option">
                  <span>{{ user.name }}</span>
                  <span>{{ user.id }}</span>
                </div>
              </el-option>
            </ul>
          </el-select>
        </div>
      </div>
      <div class="button-box">
        <el-button @click="showDeliverBox = !showDeliverBox">取消</el-button>
        <el-button color="#8A8EA8" class="button-confirm" @click="confirmDeliver">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, watchEffect, onMounted } from 'vue'
import { Search, Close } from '@element-plus/icons-vue'
import { useNoticeStore } from '@/store/modules/notice'
import { useUserStore } from '@/store/modules/user'
import { updateNoticeContent, addNewNotice } from '@/api/notice'
import Toast from '@/views/systemMessage/components/Toast.vue'

// 常量声明
// 新建通知为草稿
const NEW_NOTICE_DRAFT = 1
// 新建通知为待审核
const NEW_NOTICE_PENDING = 2

// 初始化路由实例
const router = useRouter()

// 初始化路由对象
const route = useRoute()

// store数据
const noticeStore = useNoticeStore()
const userStore = useUserStore()

// 获取toast实例
const toastRef = ref<InstanceType<typeof Toast>>()

// 通知正文
const messageContent = ref((route.query.content as string) || '')

// 通知标题
const messageTitle = ref((route.query.title as string) || '')

// 通知ID
const messageId = parseInt(route.query.noticeId as string)

// 通知分组的ID
const groupId = ref(1)

// 通知类型的ID
const typeId = ref(1)

// 是否为查看通知状态--查看状态不展示操作按钮
const isViewingState = ref<boolean>(route.query.isViewingState === '1')

// 提示框信息
const toastMessage = ref('')

// 发布通知对话框显示
const showDeliverBox = ref(false)

// 变量--发送用户
// 是否发送给所有人
const isDeliverAll = ref(true)

// 是否发送给分组用户
const isDeliverGroup = ref(false)

// 是否发送给个人
const isDeliverOne = ref(false)

// 发送的用户
const selectedUserId = ref('选择用户')

// 搜索内容
const searchText = ref('')

// 收集被选中的用户信息
const selectedList = computed(() => {
  return userStore.userPartialInformation.records.filter((user) =>
    selectedIdList.value.includes(user.userId)
  )
})

// 收集被选中的用户Id
const selectedIdList = ref<number[]>([])

onMounted(() => {
  // 获取通知类型 和 用户分组信息 和 用户部分信息
  Promise.all([
    noticeStore.getAllNoticeType(),
    userStore.getUserGroupList(),
    userStore.getUserPartialInformation()
  ])
})

watchEffect(() => {
  // 选择发送按钮-发送给所有人 与 发送给分组 与 发送给个人 互斥
  if (isDeliverGroup.value === true || isDeliverOne.value === true) {
    isDeliverAll.value = false
  } else {
    isDeliverAll.value = true
  }
  if (isDeliverAll.value === true || isDeliverOne.value === true) {
    isDeliverGroup.value = false
  }
  if (isDeliverAll.value === true || isDeliverGroup.value === true) {
    isDeliverOne.value = false
  }
})

// 点击保存为草稿触发
const setDraft = () => {
  // 通过messageId是否初始化判断是新增通知还是编辑通知
  if (Number.isInteger(messageId)) {
    // 新增通知草稿
    addNewNotice(
      NEW_NOTICE_DRAFT,
      messageTitle.value,
      messageContent.value,
      -1,
      0,
      0,
      selectedIdList.value
    )
  } else {
    //在已有通知的基础上修改
    updateNoticeContent(
      messageTitle.value,
      messageContent.value,
      -1,
      messageId,
      [],
      0,
      typeId.value
    )
  }
  // 打开提示框
  toastMessage.value = '已保存为草稿'
  toastRef.value!.openToast()
  router.back()
}

// 确认发布通知
const confirmDeliver = () => {
  if (messageTitle.value !== '' && messageContent.value !== '') {
    // 新增待审核通知
    if (isDeliverAll.value) {
      // 发送给所有人
      addNewNotice(
        NEW_NOTICE_PENDING,
        messageTitle.value,
        messageContent.value,
        -1,
        0,
        typeId.value,
        []
      )
    } else if (isDeliverGroup.value) {
      // 发送给分组
      addNewNotice(
        NEW_NOTICE_PENDING,
        messageTitle.value,
        messageContent.value,
        0,
        0,
        typeId.value,
        []
      )
    } else if (isDeliverOne.value) {
      // 发送给个人
      addNewNotice(
        NEW_NOTICE_PENDING,
        messageTitle.value,
        messageContent.value,
        1,
        0,
        typeId.value,
        selectedIdList.value
      )
    }
    // 打开提示框
    toastMessage.value = `发布成功\n请等待管理员审核`
    toastRef.value!.openToast()
    router.back()
  }
}

// 单个用户发送-选中用户时触发逻辑
const handleSelectionChange = () => {
  if (!selectedIdList.value.includes(parseInt(selectedUserId.value))) {
    selectedIdList.value.push(parseInt(selectedUserId.value))
  }
  selectedUserId.value = '选择用户'
}

// 点击icon,将选中的单个用户删除
const deleteSelectUser = (userId: number) => {
  // 将目标用户Id从收集选中用户Id的数组中移除
  selectedIdList.value.splice(
    selectedIdList.value.findIndex((user) => user === userId),
    1
  )
}

// 触底加载更多用户数据
const loadMoreUserInfo = () => {
  // 当前页面没有超过总页码
  if (userStore.userPartialInformation.current <= userStore.userPartialInformation.pages) {
    userStore.getUserPartialInformation()
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

// 消息提示框
.alert-box {
  position: absolute;
  top: 40%;
  left: 45%;
  width: 140px;
  height: 140px;
  border-radius: 8px;
  background: var(--2F3367, #2f3367);
  box-shadow: 0px 2px 8.1px 6px rgba(161, 166, 201, 0.35);
  background-color: #2f3367;
}
.alert-box .alert-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.alert-box p {
  width: 100%;
  color: #fff;
  font-size: 0.9rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-align: center;
  letter-spacing: 1.28px;
}

.fontSize {
  font-size: 1rem !important;
}

// 发布对话框
:deep(.el-dialog) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  --el-dialog-margin-top: 25vh;
}

.select-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 15px 52px;
  border-top: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
  font-size: 1rem;
  color: #8a8ea8;
}

.select-box > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
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

.deliver-switch {
  --el-switch-on-color: #2f3367;
  --el-switch-off-color: #8a8ea8;
}

.select-notice-type {
  width: 150px;
}

.selected-user-card {
  margin-right: 5px;
}

.select-notice-group {
  width: 100px;
  margin: 5px 0 0;
}

.select-user-list {
  overflow: auto;
  height: 260px;
}

.select-message-user {
  width: 100px;
}

.search-user-icon {
  vertical-align: middle;
}

.option-user-name {
  margin-left: -10px;
}

.option-user-id {
  margin-left: -7px;
}
</style>
