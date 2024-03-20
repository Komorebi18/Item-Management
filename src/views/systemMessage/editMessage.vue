<template>
  <div>
    <div class="message-box">
      <div class="content">
        <el-input
          placeholder="请在这里输入标题"
          v-model="messageTitle"
          type="text"
          style="font-size: 1.3rem; margin-bottom: 5px"
        />
        <p style="height: 1px; width: 100%; background-color: #d9d9d9; margin-bottom: 15px"></p>
        <el-input
          v-model="messageText"
          placeholder="请在这里输入正文"
          type="textarea"
          :resize="'none'"
          class="main-text"
        />
      </div>
      <div class="footer">
        <p style="margin: 20px 36px">正文共 {{ messageText.length }} 字</p>
        <div class="button">
          <el-button @click="setDraft">保存为草稿</el-button>
          <el-button @click="showDeliverBox = true">发布</el-button>
        </div>
      </div>
    </div>
    <!-- 提示框 -->
    <!-- 暂存草稿提示 -->
    <div class="alert-box" v-show="showAlertBox">
      <div class="alert-content">
        <div style="margin: 15px 0">
          <p v-if="isDeliverAlert" style="margin-bottom: 5px">发布成功</p>
          <p :class="{ fontSize: isDeliverAlert === false }">
            {{ isDeliverAlert ? '请等待管理员审核' : '已保存草稿' }}
          </p>
        </div>
        <img src="../../assets/icons/delete-confirm.svg" />
      </div>
    </div>
    <!-- 发布对话框 -->
    <el-dialog v-model="showDeliverBox" width="30vw" center title="发送通知">
      <div class="select-box">
        <div :class="{ activeFont: isDeliverAll === true }">
          <span>发给所有用户</span>
          <el-switch
            v-model="isDeliverAll"
            class="ml-2"
            style="--el-switch-on-color: #2f3367; --el-switch-off-color: #8a8ea8"
          />
        </div>
        <div :class="{ activeFont: isDeliverGroup === true }">
          <span>分组发送通知</span>
          <el-switch
            v-model="isDeliverGroup"
            class="ml-2"
            style="--el-switch-on-color: #2f3367; --el-switch-off-color: #8a8ea8"
          />
        </div>
        <div class="select-detail" v-if="isDeliverGroup">
          <el-select
            v-model="tagLimit"
            placeholder="全部标签"
            style="width: 100px; margin: 5px 0 0"
          >
            <el-option key="4" label="全部" value="item4" />
            <el-option key="1" label="近三天" value="item1" />
            <el-option key="2" label="近一周" value="item2" />
            <el-option key="3" label="近一月" value="item3" />
          </el-select>
          <el-select
            v-model="blacklistUserLimit"
            placeholder="黑名单用户"
            style="width: 115px; margin: 5px 0 0"
          >
            <el-option key="4" label="全部" value="item4" />
            <el-option key="1" label="近三天" value="item1" />
            <el-option key="2" label="近一周" value="item2" />
            <el-option key="3" label="近一月" value="item3" />
          </el-select>
        </div>
        <div :class="{ activeFont: isDeliverOne === true }">
          <span>发送给个人</span>
          <el-switch
            v-model="isDeliverOne"
            class="ml-2"
            style="--el-switch-on-color: #2f3367; --el-switch-off-color: #8a8ea8"
          />
        </div>
        <div v-if="isDeliverOne">
          <el-select v-model="userIdLimit" placeholder="Select" style="width: 100px">
            <div class="select-header">
              <div class="search-box">
                <el-input v-model="searchText" placeholder="请输入用户名或ID" />
                <el-button color="#2F3367">
                  <el-icon style="vertical-align: middle" color="#fff">
                    <Search />
                  </el-icon>
                </el-button>
              </div>
              <div class="select-header-title">
                <span>用户名</span>
                <span>用户ID</span>
              </div>
            </div>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <div class="select-option">
                <span>王明</span>
                <span>114514</span>
              </div>
            </el-option>
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
import router from '@/router'
import { ref, watchEffect } from 'vue'
import { Search } from '@element-plus/icons-vue'
// 通知正文
let messageText = ref('')

// 通知标题
let messageTitle = ref('')

// 暂存提示框显示
let showAlertBox = ref(false)

// 发布通知对话框显示
let showDeliverBox = ref(false)

// 变量--发送用户
// 是否发送给所有人
let isDeliverAll = ref(true)

// 是否发送给分组用户
let isDeliverGroup = ref(false)

// 是否发送给个人
let isDeliverOne = ref(false)

// 发送的标签分组
let tagLimit = ref('标签分组')

// 发送的黑名单分组
let blacklistUserLimit = ref('黑名单分组')

// 发送的用户Id
let userIdLimit = ref('用户')

// 搜索内容
let searchText = ref('')

// 是否为发送成功提醒
let isDeliverAlert = ref(false)

// 模拟数据
const options = [
  {
    value: 'Option1',
    label: 'Option1'
  },
  {
    value: 'Option2',
    label: 'Option2'
  },
  {
    value: 'Option3',
    label: 'Option3'
  },
  {
    value: 'Option4',
    label: 'Option4'
  },
  {
    value: 'Option5',
    label: 'Option5'
  }
]

// 选择发送按钮
watchEffect(() => {
  if (isDeliverGroup.value === true || isDeliverOne.value === true) {
    isDeliverAll.value = false
  } else {
    isDeliverAll.value = true
  }
})

// 点击保存为草稿触发
const setDraft = (event: any) => {
  event.target.blur()
  isDeliverAlert.value = false
  showAlertBox.value = true
  // 3s后关闭提示窗
  setTimeout(() => {
    showAlertBox.value = false
    router.replace({ path: '/system/deliver-info' })
  }, 1000)
}

// 确认发布通知
const confirmDeliver = () => {
  isDeliverAlert.value = true
  showDeliverBox.value = false
  showAlertBox.value = true
  // 3s后关闭提示窗
  setTimeout(() => {
    showAlertBox.value = false
    router.replace({ path: '/system/deliver-info' })
  }, 1000)
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
.content {
  display: flex;
  flex-direction: column;
  flex: 5;
  padding: 50px;
  color: #2f3367;
}

:deep(.content .el-input__wrapper) {
  background-color: #fff;
  box-shadow: none;
}

:deep(.content .el-textarea__inner) {
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
}

.activeFont {
  color: var(--2F3367, #2f3367);
}
</style>
