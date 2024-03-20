<template>
  <div class="box">
    <!-- 左边盒子 -->
    <div class="left-box">
      <div class="header">
        <div class="left-header">
          <el-button
            type="primary"
            :icon="isDelete === true ? '' : EditPen"
            class="button-deliver"
            color="#2F3367"
            @click="isDelete = !isDelete"
          >
            {{ isDelete === true ? '取消' : '删除通知' }}
          </el-button>
          <div class="select-box">
            <el-select
              v-model="timeLimit"
              placeholder="全部"
              style="width: 88px; margin: 5px 0 0"
              @change="handleTimeLimit"
            >
              <el-option key="4" label="全部" value="0" />
              <el-option key="1" label="近三天" value="1" />
              <el-option key="2" label="近一周" value="2" />
              <el-option key="3" label="近一月" value="3" />
            </el-select>
            <el-select v-model="userLimit" placeholder="全部" style="width: 100px; margin: 5px 0 0">
              <el-option
                v-for="tag in noticeStore.noticeTypeList"
                v-model="tagId"
                :key="tag.typeId"
                :label="tag.typeName"
                :value="tag.typeId"
              />
              <el-option key="0" label="所有类型" value="0" />
            </el-select>
          </div>
        </div>
        <div class="search-box">
          <el-input v-model="input" placeholder="请输入关键词" @keydown.enter="searchNotice" />
          <el-button color="#2F3367" @click="searchNotice">
            <el-icon style="vertical-align: middle">
              <Search />
            </el-icon>
          </el-button>
        </div>
      </div>
      <!-- 页面主要内容展示 -->
      <el-main style="padding: 0 10px 0 20px">
        <!-- 没有数据时展示的内容 -->
        <template v-if="!noticeDetail">
          <p>暂无消息</p>
        </template>
        <!-- 通知展示表格 -->
        <el-scrollbar class="message-box" ref="scrollbarRef">
          <div v-for="notice in noticeStore.allNoticeList.records" :key="notice.noticeId">
            <el-row
              class="single-message"
              @click="handleMessage(notice.noticeId as number, notice.title as string)"
              :class="{ activeClass: notice.noticeId === noticeDetail.noticeId }"
            >
              <div class="content-box">
                <div style="display: flex; align-items: center">
                  <div class="delete-icon" v-if="isDelete">
                    <img src="../../assets/icons/delete-message.svg" alt="删除通知" />
                  </div>
                  <div>
                    <div class="title">
                      <el-icon v-if="notice.userId !== 0"><User /></el-icon>
                      <span>{{ notice.title }}</span>
                    </div>
                    <div class="content">
                      <el-text class="w-90% mb-2" truncated>
                        {{ notice.content }}
                      </el-text>
                    </div>
                  </div>
                </div>
              </div>

              <div class="info">
                <div class="info-deliver">
                  <el-icon style="font-size: 1.5em"><UserFilled /></el-icon>
                  <span style="padding-left: 2px">发布者:{{ notice.adminName }}</span>
                </div>
                <div class="info-pageview">
                  <div class="to-all" v-if="notice.userId === 0">
                    <el-icon style="font-size: 1.5em"><View /></el-icon>
                    <span style="padding-left: 5px">浏览:{{ notice.browse }}</span>
                  </div>
                  <div class="to-one" v-if="notice.userId !== 0">
                    <span style="padding-left: 5px">{{ notice.username }}</span>
                  </div>
                </div>
              </div>
              <div class="date">{{ notice.publishTime }}</div>
            </el-row>
          </div>
        </el-scrollbar>
      </el-main>
      <!-- 分页按钮 -->
      <pagination
        :total="noticeStore.allNoticeList.total"
        :page="noticeStore.allNoticeList.current"
        :limit="noticeStore.allNoticeList.size"
        @pagination="handlePageChange"
      />
    </div>
    <!-- 右边盒子 -->
    <div class="right-box" v-show="!isDelete">
      <template v-if="noticeDetail">
        <div class="detail-title">{{ noticeDetail.title }}</div>
        <div class="detail-info">
          <div class="detail-info-deliver">
            <el-icon style="font-size: 1.5em"><UserFilled /></el-icon>
            <span>发布者:{{ noticeDetail.adminName }}</span>
          </div>
          <div class="detail-info-date">{{ noticeDetail.publishTime }}</div>
        </div>
        <div class="detail-content">
          <el-text class="mx-1" type="info">
            {{ noticeDetail.content }}
          </el-text>
        </div>
        <div class="detail-pageview">
          <el-icon style="font-size: 1.5em"><View /></el-icon>
          <span style="padding-left: 2px">浏览:{{ noticeDetail.browse }}</span>
        </div>
      </template>
      <template v-if="!noticeDetail">
        <p>暂无消息</p>
      </template>
    </div>
    <!-- 对话框 -->
    <el-dialog v-model="showDeleteBox" width="30%" center>
      <div>
        <div class="deleteWaing-icon">
          <img src="../../assets/icons/delete-waring.svg" alt="" />
          <span> 是否确认将此通知删除？ </span>
        </div>
      </div>
      <p>删除后无法恢复。</p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDeleteBox = false">取消</el-button>
          <el-button type="primary" @click="handleDelete"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
    <div class="alert-box" v-show="showAlertBox">
      <div class="content">
        <p>已删除此通知</p>
        <img src="../../assets/icons/delete-confirm.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { EditPen, Search, UserFilled, View, User } from '@element-plus/icons-vue'
import { ref, onMounted, computed } from 'vue'
import type { NoticeItem } from '@/types/notice'
import type { pageInfo } from '@/types/pageMessage'
import { useNoticeStore } from '@/store/modules/notice'
// 搜索框内容
let input = ref('')

// 用户限制
let userLimit = ref('所有类型')

// 是否处于删除状态
let isDelete = ref(false)

// 控制删除信息对话框显示
let showDeleteBox = ref(false)

// 控制提示框显示
let showAlertBox = ref(false)

// 待删除的通知Id
let deleteMessageId = ref(0)

// 待删除的通知标题
let deleteMessageTitle = ref('')

// store数据
const noticeStore = useNoticeStore()

// 通知数据
let noticeList = ref<NoticeItem[]>([])

// 待绑定滚动条组件
const scrollbarRef = ref<HTMLElement | null>(null)

// 通知时间限制
let timeLimit = ref('0')

// 通知类型的ID
let tagId = ref(0)

// 当前选中通知的详细内容
let noticeDetail = ref<NoticeItem>({
  noticeId: 0,
  title: '',
  content: '',
  userId: 0,
  username: '',
  adminName: '',
  publishTime: '',
  browse: 0,
  state: 0,
  comment: ''
})

onMounted(async () => {
  // 重置页面页码
  noticeStore.allNoticeList.current = 1
  // 获取所有通知的类型
  // 获取该管理员所有通知
  await Promise.all([
    noticeStore.getAllNoticeType(),
    noticeStore.getAllNoticeList('3', '', 0, parseInt(timeLimit.value))
  ])
  // 初始化盒子右侧详细信息
  noticeList.value = noticeStore.allNoticeList.records as NoticeItem[]
  noticeDetail.value = noticeList.value[0]
})

// 更新页面展示信息
const handlePageChange = async (pageMessage: pageInfo) => {
  // 更新页面信息
  noticeStore.allNoticeList.current = pageMessage.currentPage
  noticeStore.allNoticeList.size = pageMessage.pageLimit
  // 发送请求获取新数据
  await noticeStore.getAllNoticeList('3', input.value, 0, parseInt(timeLimit.value))
  // 更新盒子右侧详细信息
  noticeList.value = noticeStore.allNoticeList.records as NoticeItem[]
  noticeDetail.value = noticeList.value[0]
  // 滚动条回滚到顶端
  scrollbarRef.value?.scrollTo(0, 0)
}

// 点击通知
const handleMessage = (messageId: number, messageTitle: string) => {
  // 判断当前是否处于删除状态
  if (isDelete.value === true) {
    // 处在删除状态--打开确认删除弹窗
    showDeleteBox.value = true
    // 记录当前通知的Id和标题
    deleteMessageId.value = messageId
    deleteMessageTitle.value = messageTitle
  } else {
    // 不处在删除状态--更新选中消息的详细信息
    noticeList.value.forEach((element) => {
      if (element.noticeId === messageId) {
        noticeDetail.value = element
      }
    })
  }
}

// 删除通知
const handleDelete = async () => {
  showDeleteBox.value = false
  // 拿到待删除的通知Id发送请求
  await noticeStore.deleteAnyNotice(deleteMessageTitle.value, deleteMessageId.value)
  // 发送请求获取新数据
  await noticeStore.getAllNoticeList('3', input.value, 0, parseInt(timeLimit.value))
  // 更新盒子右侧详细信息
  noticeList.value = noticeStore.allNoticeList.records as NoticeItem[]
  noticeDetail.value = noticeList.value[0]
  // 展示提示信息
  showAlertBox.value = true
  // 3s后关闭提示窗
  setTimeout(() => {
    showAlertBox.value = false
  }, 1500)
}

// 搜索框筛选通知
const searchNotice = async () => {
  // 重置页面页码
  noticeStore.allNoticeList.current = 1
  // 发送请求更新数据
  await noticeStore.getAllNoticeList('3', input.value, 0, parseInt(timeLimit.value))
  // 更新盒子右侧详细信息
  noticeList.value = noticeStore.allNoticeList.records as NoticeItem[]
  noticeDetail.value = noticeList.value[0]
}

// 根据时间筛选通知
const handleTimeLimit = async () => {
  // 携带新的时间限制参数重新发送请求，更新数据
  await noticeStore.getAllNoticeList('3', input.value, 0, parseInt(timeLimit.value))
  // 更新盒子右侧详细信息
  noticeList.value = noticeStore.allNoticeList.records as NoticeItem[]
  noticeDetail.value = noticeList.value[0]
}
</script>

<style scoped lang="scss">
.box {
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin: 15px 0 0 15px;
}

.left-box {
  width: 52vw;
  background-color: #fff;
}

.right-box {
  width: 30vw;
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

.single-message {
  position: relative;
  height: 120px;
  margin-right: 15px;

  border-top: 1px solid #e4e7ed;
  border-bottom: 1px solid #e4e7ed;
  background: #fff;
}

.single-message:hover {
  background-color: #fafafa;
}

.content-box {
  position: absolute;
  top: 20px;
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

.activeClass {
  background-color: #fafafa;
}
</style>
