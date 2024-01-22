<template>
  <div class="box">
    <!-- 左边盒子 -->
    <div class="left-box">
      <div class="header">
        <div class="left-header">
          <el-button
            type="primary"
            :icon="isDelect === true ? '' : EditPen"
            class="button-deliver"
            color="#2F3367"
            @click="isDelect = !isDelect"
          >
            {{ isDelect === true ? '取消' : '删除通知' }}
          </el-button>
          <div class="select-box">
            <el-select
              v-model="timeLimit"
              class="time-select"
              placeholder="全部"
              style="width: 88px; margin: 5px 0 0"
            >
              <el-option key="4" label="全部" value="item4" />
              <el-option key="1" label="近三天" value="item1" />
              <el-option key="2" label="近一周" value="item2" />
              <el-option key="3" label="近一月" value="item3" />
            </el-select>
            <el-select
              v-model="userLimit"
              class="time-select"
              placeholder="全部"
              style="width: 100px; margin: 5px 0 0"
            >
              <el-option key="1" label="个人用户" value="item1" />
              <el-option key="2" label="分组用户" value="item2" />
              <el-option key="3" label="所有用户" value="item3" />
              <el-option key="4" label="所有类型" value="item4" />
            </el-select>
          </div>
        </div>
        <div class="search-box">
          <el-input v-model="input" placeholder="请输入关键词" />
          <el-button color="#2F3367">
            <el-icon style="vertical-align: middle">
              <Search />
            </el-icon>
          </el-button>
        </div>
      </div>
      <!-- 页面主要内容展示 -->
      <el-main style="padding: 0 20px 0 20px">
        <!-- 通知展示表格 -->
        <div class="message-box">
          <div v-for="item in items" :key="item.id">
            <el-row class="single-message" @click="handleMessage(item.id)">
              <div class="content-box">
                <div style="display: flex; align-items: center">
                  <div class="delect-icon" v-if="isDelect">
                    <img src="../../assets/icons/delete-message.svg" alt="删除通知" />
                  </div>
                  <div>
                    <div class="title">
                      <el-icon v-if="!item.toAll"><User /></el-icon>
                      <span>关于小程序更新至2.0版本的通知</span>
                    </div>
                    <div class="content">
                      <el-text class="w-90% mb-2" truncated>
                        亲爱的用户,您好,小程序已经更新至2.0版本aaaaaaaaaaaaaaaaaaaaaaaaaaaa
                      </el-text>
                    </div>
                  </div>
                </div>
              </div>

              <div class="info">
                <div class="info-deliver">
                  <el-icon style="font-size: 1.5em"><UserFilled /></el-icon>
                  <span style="padding-left: 2px">发布者:管理员1</span>
                </div>
                <div class="info-pageview">
                  <div class="to-all" v-if="item.toAll">
                    <el-icon style="font-size: 1.5em"><View /></el-icon>
                    <span style="padding-left: 2px">浏览:1000</span>
                  </div>
                  <div class="to-one" v-if="!item.toAll">
                    <span style="padding-left: 2px">用户ID: 1100</span>
                  </div>
                </div>
              </div>
              <div class="date">2024-01-01 18:00</div>
            </el-row>
          </div>
        </div>
      </el-main>
      <!-- 分页按钮 -->
      <pagination :total="100" :page="1" @pagination="handleChange" />
    </div>
    <!-- 右边盒子 -->
    <div class="right-box" v-show="!isDelect">
      <div class="detail-title">关于小程序更新至2.0版本的通知</div>
      <div class="detail-info">
        <div class="detail-info-deliver">
          <el-icon style="font-size: 1.5em"><UserFilled /></el-icon>
          <span>发布者:管理员1</span>
        </div>
        <div class="detail-info-date">2024-01-01 18:00</div>
      </div>
      <div class="detail-content">
        <el-text class="mx-1" type="info">
          亲爱的用户,您好,小程序已更新至1.15版我们将给您带来更加优异完善的功能，祝您本，使用愉快!
          若在使用过程中有如何问题或建议，欢迎您的反馈 !
        </el-text>
      </div>
      <div class="detail-pageview">
        <el-icon style="font-size: 1.5em"><View /></el-icon>
        <span style="padding-left: 2px">浏览:1000</span>
      </div>
    </div>
    <!-- 对话框 -->
    <el-dialog v-model="showDelectBox" width="30%" center>
      <div>
        <div class="delectWaing-icon">
          <img src="../../assets/icons/delect-waring.svg" alt="" />
          <span> 是否确认将此通知删除？ </span>
        </div>
      </div>
      <p>删除后无法恢复。</p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDelectBox = false">取消</el-button>
          <el-button type="primary" @click="handleDelect"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
    <div class="alertBox" v-show="showAlertBox">
      <div class="content">
        <p>已删除此通知</p>
        <img src="../../assets/icons/delect-confirm.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  EditPen,
  Search,
  UserFilled,
  View,
  User,
  WarnTriangleFilled
} from '@element-plus/icons-vue'
import pagination from '@/components/Pagination/index.vue'
import { ref } from 'vue'
// 搜索框内容
let input = ref('')
// 当前页签
let activeName = ref('first')
// 通知时间限制
let timeLimit = ref('全部')
// 用户限制
let userLimit = ref('所有类型')
// 是否处于删除状态
let isDelect = ref(false)
// 控制删除信息对话框显示
let showDelectBox = ref(false)
// 控制提示框显示
let showAlertBox = ref(false)
// 待删除的通知Id
let delectMessageId = ref(0)

// tab页签点击触发
const handleClick = () => {
  console.log('点击了tab页签')
}

// 点击icon图标
const handleIconClick = () => {
  console.log('点击了icon')
}

// 分页按钮点击触发
const handleChange = () => {
  console.log('点击了页码')
}

// 模拟系统信息数据
const items = [
  { id: 1, name: 'Item 1', toAll: true },
  { id: 2, name: 'Item 2', toAll: true },
  { id: 3, name: 'Item 3', toAll: false },
  { id: 4, name: 'Item 4', toAll: true },
  { id: 5, name: 'Item 5', toAll: false },
  { id: 6, name: 'Item 6', toAll: true }
]

// 点击通知
const handleMessage = (messageId: number) => {
  // 当前通知的Id
  delectMessageId.value = messageId
  // 删除状态下点击
  if (isDelect.value) {
    // 打开确认弹窗
    showDelectBox.value = true
  }
}

// 删除通知
const handleDelect = () => {
  showDelectBox.value = false
  // 拿到待删除的通知Id发送请求
  // 展示提示信息
  showAlertBox.value = true
  // 3s后关闭提示窗
  setTimeout(() => {
    showAlertBox.value = false
  }, 1500)
}
</script>

<style scoped lang="scss">
.box {
  position: relative;
  display: flex;
  justify-content: flex-start;
  gap: 18px;
  margin: 15px 0 0 15px;
}

.left-box {
  width: 55vw;
  background-color: #fff;
}

.right-box {
  width: 27vw;
  background-color: #fff;
  padding: 30px 25px;
  gap: 10px;
}
.button-deliver {
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
  width: 40vh;
  border: none;
}

:deep(.el-select__placeholder) {
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
  height: 63vh;
  margin-top: 20px;
}

.single-message {
  position: relative;
  height: 15vh;
  padding: 12px 5px;

  border-top: 1px solid #e4e7ed;
  border-bottom: 1px solid #e4e7ed;
  background: #fff;
}

.single-message:hover {
  background-color: #fafafa;
}

.content-box {
  position: absolute;
  top: 15px;
  left: 5px;
}

.title {
  color: var(--2F3367, #2f3367);
  font-family: Inter;
  font-size: 1rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: 1.6px;
}

.content {
  margin-top: 14px;
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
  top: 15px;
  right: 5px;
  color: var(--8A8EA8, #8a8ea8);
  font-family: Inter;
  font-size: 0.5em;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 1.28px;
}

.info {
  position: absolute;
  bottom: 10px;
  right: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}
.info-deliver {
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
.info-pageview {
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

/* 右侧盒子 */
.detail-title {
  padding: 20px;
  color: var(--2F3367, #2f3367);
  font-family: Inter;
  font-size: 1rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: 1.6px;
}
.detail-info {
  display: flex;
  justify-content: space-between;
}

.detail-info-deliver {
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

.detail-pageview {
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

.to-all {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.delect-icon {
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

.delectWaing-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}

.delectWaing-icon img {
  display: inline-block;
  margin-right: 12px;
  width: 32px;
  height: 32px;
}

:deep(.el-select__wrapper) {
  box-shadow: none !important;
}
.el-select .el-input.is-focus .el-input__inner {
  color: #fff;
  background-color: #2f3367;
}

.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  color: #fff;
  background-color: #8a8ea8;
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
.alertBox {
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
.alertBox .content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.alertBox p {
  margin: 16px;
  color: #fff;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 1.28px;
}
</style>
