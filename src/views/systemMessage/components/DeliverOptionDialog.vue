<template>
  <el-dialog v-model="isShowDeliverBox" width="30vw" center title="发送通知">
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
      <div :class="{ activeFont: isDeliverAll }">
        <span>发给所有用户</span>
        <el-switch v-model="isDeliverAll" class="deliver-switch" />
      </div>
      <div :class="{ activeFont: isDeliverGroup }">
        <span>分组发送通知</span>
        <el-switch v-model="isDeliverGroup" class="deliver-switch" @change="onSelectGroup" />
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
      <div :class="{ activeFont: isDeliverOne }">
        <span>发送给个人</span>
        <el-switch v-model="isDeliverOne" class="deliver-switch" />
      </div>
      <div v-if="isDeliverOne" class="deliver-one">
        <div v-for="user in selectedList" :key="user.userId">
          <div class="selected-one">
            <i class="selected-user-card">{{ user.name }}</i>
            <el-icon class="delete-icon" @click="deleteSelectUser(user.userId)"><Close /></el-icon>
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
      <el-button @click="isShowDeliverBox = !isShowDeliverBox">取消</el-button>
      <el-button color="#8A8EA8" class="button-confirm" @click="confirmDeliver()">确认</el-button>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue'
import { Search, Close } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import { useNoticeStore } from '@/store/modules/notice/index'

const userStore = useUserStore()
const noticeStore = useNoticeStore()

// 控制弹窗显示隐藏
const isShowDeliverBox = ref(false)
// 通知分组的ID
const groupId = ref(1)
// 通知类型的ID
const typeId = ref(1)

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
// 发送方式
const deliverMode = computed(() => {
  if (isDeliverAll.value) {
    return DELIVER_MODE.TO_ALL_USER
  } else if (isDeliverGroup.value) {
    return DELIVER_MODE.TO_GROUP_USER
  } else if (isDeliverOne.value) {
    return DELIVER_MODE.TO_SPECIFIED_USER
  } else {
    return DELIVER_MODE.TO_ALL_USER
  }
})
// 发送方式枚举
enum DELIVER_MODE {
  TO_ALL_USER,
  TO_GROUP_USER,
  TO_SPECIFIED_USER
}

const emit = defineEmits<{
  // 发送通知
  confirm: [deliverMode: number, noticeTypeId: number, userIdList: number[], groupId: number]
}>()

onMounted(() => {
  // 获取通知类型 和 用户分组信息 和 用户部分信息
  noticeStore.getAllNoticeType()
  userStore.getUserGroup()
  userStore.getPartialUserInfo()
})

watchEffect(() => {
  // 选择发送按钮-发送给所有人 与 发送给分组 与 发送给个人 互斥
  isDeliverAll.value = !(isDeliverGroup.value || isDeliverOne.value)
  isDeliverGroup.value = !(isDeliverAll.value || isDeliverOne.value)
  isDeliverOne.value = !(isDeliverAll.value || isDeliverGroup.value)
})

// 选择分组发送触发的校正逻辑
const onSelectGroup = () => {
  if (isDeliverGroup.value && isDeliverOne.value) {
    isDeliverOne.value = false
  }
}

// 点击icon,将选中的单个用户删除
const deleteSelectUser = (userId: number) => {
  // 将目标用户Id从收集选中用户Id的数组中移除
  if (selectedIdList.value.findIndex((user) => user === userId) !== -1) {
    selectedIdList.value.splice(
      selectedIdList.value.findIndex((user) => user === userId),
      1
    )
  }
}

// 触底加载更多用户数据
const loadMoreUserInfo = () => {
  // 当前页面没有超过总页码
  if (userStore.userPartialInformation.current <= userStore.userPartialInformation.pages) {
    userStore.getPartialUserInfo()
  }
}

// 单个用户发送-选中用户时触发逻辑
const handleSelectionChange = () => {
  if (!selectedIdList.value.includes(parseInt(selectedUserId.value))) {
    selectedIdList.value.push(parseInt(selectedUserId.value))
  }
  selectedUserId.value = '选择用户'
}

// 确认发布通知
const confirmDeliver = () => {
  emit('confirm', deliverMode.value, typeId.value, selectedIdList.value, groupId.value)
  isShowDeliverBox.value = false
}

// 打开提示框
const openDeliverDialog = () => {
  isShowDeliverBox.value = true
}

// 向父组件暴露打开对话框方法
defineExpose({ openDeliverDialog })
</script>
<style lang="scss" scoped>
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

.select-notice-type {
  width: 150px;
}

.deliver-switch {
  --el-switch-on-color: #2f3367;
  --el-switch-off-color: #8a8ea8;
}

.select-notice-group {
  width: 100px;
  margin: 5px 0 0;
}

.selected-user-card {
  margin-right: 5px;
}

.select-message-user {
  width: 100px;
}

.select-user-list {
  overflow: auto;
  height: 260px;
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
