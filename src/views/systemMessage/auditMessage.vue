<template>
  <div class="box">
    <!-- 左边盒子 -->
    <div class="left-box">
      <div class="header">
        <div class="left-header">
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
          <div
            v-for="notice in noticeStore.allPendingAuditNoticeList.records"
            :key="notice.noticeId as number"
          >
            <el-row
              class="single-message"
              @click="handleMessage(notice.noticeId as number)"
              :class="{ activeClass: notice.noticeId === noticeDetail.noticeId }"
            >
              <div class="content-box">
                <div style="display: flex; align-items: center">
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
                <el-tooltip effect="dark" content="通过" placement="top"
                  ><img
                    src="../../assets/icons/passAudit.svg"
                    alt=""
                    style="width: 1.3em; height: 1.3em; margin: 10px"
                    @click="handleClickPass(notice.noticeId as number, notice.title as string)"
                /></el-tooltip>

                <el-tooltip effect="dark" content="打回" placement="top"
                  ><img
                    src="../../assets/icons/repulse.svg"
                    alt=""
                    style="width: 1.3em; height: 1.3em; margin: 10px"
                    @click="isRepulseNotice = true"
                /></el-tooltip>
              </div>
              <div class="date">{{ notice.publishTime }}</div>
            </el-row>
          </div>
        </el-scrollbar>
      </el-main>
      <!-- 分页按钮 -->
      <pagination
        :total="noticeStore.allPendingAuditNoticeList.total"
        :page="noticeStore.allPendingAuditNoticeList.current"
        :limit="noticeStore.allPendingAuditNoticeList.size"
        @pagination="handlePageChange"
      />
    </div>
    <!-- 右边盒子 -->
    <div class="right-box">
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
    <!-- 打回通知依据对话框 -->
    <el-dialog v-model="isRepulseNotice" width="30%" title="移入依据" class="basis-box">
      <!-- <div class="title" style="text-align: center">移入依据</div> -->
      <div class="line"></div>
      <div class="basis">
        <p>移入依据:</p>
        <el-input
          v-model="textualBasis"
          type="textarea"
          :resize="'none'"
          :rows="4"
          style="width: 92%; height: 100px; margin: 5px 0 10px"
        />
        <p>图片依据：</p>
        <el-upload
          v-model:file-list="fileList"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          ><el-icon><Plus /></el-icon
        ></el-upload>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isRepulseNotice = false">取消</el-button>
          <el-button type="primary" @click="handleRepulseNotice"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 确定对话框 -->
    <el-dialog v-model="showConfirmBox" width="30%" center class="confirm-box">
      <div>
        <div class="deleteWaing-icon">
          <img src="../../assets/icons/delete-waring.svg" alt="" />
          <span> 是否确认通过此通知？ </span>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showConfirmBox = false">取消</el-button>
          <el-button type="primary" @click="handlePassNotice"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
    <div class="alert-box" v-show="showAlertBox">
      <div class="content">
        <p>已通过此通知</p>
        <img src="../../assets/icons/delete-confirm.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, UserFilled, View, User, Plus } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import type { NoticeItem } from '@/types/notice'
import type { pageInfo } from '@/types/pageMessage'
import { useNoticeStore } from '@/store/modules/notice'

// store数据
const noticeStore = useNoticeStore()

// 搜索框内容
let input = ref('')

// 通知时间限制
let timeLimit = ref('0')

// 控制确认信息对话框显示
let showConfirmBox = ref(false)

// 控制提示框显示
let showAlertBox = ref(false)

// 当前选中的通知Id
let selectMessageId = ref(0)

// 当前选中的通知标题
let selectMessageTitle = ref('')

// 是否打回通知
let isRepulseNotice = ref(false)

// 打回通知的文字依据
let textualBasis = ref('')

// 待绑定滚动条组件
const scrollbarRef = ref<HTMLElement | null>(null)

// 通知数据
let noticeList = ref<NoticeItem[]>([])

// 当前选中通知的详细内容
let noticeDetail = ref<NoticeItem>({
  noticeId: 0,
  title: '',
  content: '',
  userId: 0,
  userIds: [],
  usernames: [],
  adminName: '',
  publishTime: '',
  browse: 0,
  state: 0,
  comment: '',
  groupId: 0,
  typeId: 0,
  groupName: ''
})

onMounted(async () => {
  // 重置页面页码
  noticeStore.allPendingAuditNoticeList.current = 1
  // 获取该管理员待审核的通知
  await noticeStore.getAllPendingAuditNoticeList('', 0, parseInt(timeLimit.value))
  // 初始化盒子右侧详细信息
  noticeList.value = noticeStore.allPendingAuditNoticeList.records as NoticeItem[]
  noticeDetail.value = noticeList.value[0]
})

// 点击通过icon
const handleClickPass = (noticeId: number, title: string) => {
  // 更新当前选中通知的信息
  selectMessageId.value = noticeId
  selectMessageTitle.value = title
  // 打开对话框
  showConfirmBox.value = true
}

// 确认通过通知
const handlePassNotice = async () => {
  showConfirmBox.value = false
  // 拿到待通过审核的通知Id发送请求
  await noticeStore.publishNoticeToUser(selectMessageTitle.value, selectMessageId.value)
  // 发送请求获取新数据
  await noticeStore.getAllPendingAuditNoticeList(input.value, 0, parseInt(timeLimit.value))
  // 更新盒子右侧详细信息
  console.log(noticeStore.allPendingAuditNoticeList.records)
  noticeList.value = noticeStore.allPendingAuditNoticeList.records as NoticeItem[]
  noticeDetail.value = noticeList.value[0]
  // 展示提示信息
  showAlertBox.value = true
  // 3s后关闭提示窗
  setTimeout(() => {
    showAlertBox.value = false
  }, 1500)
}

// 确认打回通知
const handleRepulseNotice = () => {}

// 根据时间筛选通知
const handleTimeLimit = async () => {
  // 携带新的时间限制参数重新发送请求，更新数据
  await noticeStore.getAllPendingAuditNoticeList(input.value, 0, parseInt(timeLimit.value))
  // 更新盒子右侧详细信息
  noticeList.value = noticeStore.allPendingAuditNoticeList.records as NoticeItem[]
  noticeDetail.value = noticeList.value[0]
}

// 搜索框筛选通知
const searchNotice = async () => {
  // 重置页面页码
  noticeStore.allPendingAuditNoticeList.current = 1
  // 发送请求更新数据
  await noticeStore.getAllPendingAuditNoticeList(input.value, 0, parseInt(timeLimit.value))
  // 更新盒子右侧详细信息
  noticeList.value = noticeStore.allPendingAuditNoticeList.records as NoticeItem[]
  noticeDetail.value = noticeList.value[0]
}

// 点击通知
const handleMessage = (messageId: number) => {
  //更新选中消息的详细信息
  noticeList.value.forEach((element) => {
    if (element.noticeId === messageId) {
      noticeDetail.value = element
    }
  })
}

// 更新页面展示信息
const handlePageChange = async (pageMessage: pageInfo) => {
  // 更新页面信息
  noticeStore.allPendingAuditNoticeList.current = pageMessage.currentPage
  noticeStore.allPendingAuditNoticeList.size = pageMessage.pageLimit
  console.log(pageMessage.currentPage)
  // 发送请求获取新数据
  await noticeStore.getAllPendingAuditNoticeList(input.value, 0, parseInt(timeLimit.value))
  // 更新盒子右侧详细信息
  noticeList.value = noticeStore.allPendingAuditNoticeList.records as NoticeItem[]
  noticeDetail.value = noticeList.value[0]
  // 滚动条回滚到顶端
  scrollbarRef.value?.scrollTo(0, 0)
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
  bottom: 5px;
  right: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
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
:deep(.confirm-box .el-dialog) {
  --el-dialog-margin-top: 30vh;
}

:deep(.confirm-box .el-dialog__body) {
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

:deep(.confirm-box .dialog-footer .el-button) {
  background-color: #fff;
  color: #8a8ea8;
  border-color: #8a8ea8;
}
:deep(.confirm-box .dialog-footer .el-button--primary) {
  margin-left: 64px;
  color: #ff7676;
  border-color: #ff7676;
}

:deep(.basis-box .dialog-footer .el-button--primary) {
  margin-left: 20px;
  color: #fff;
  background-color: #8a8ea8;
  border-color: #8a8ea8;
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

:deep(.basis-box .el-dialog__header) {
  margin-right: 0px;
  text-align: center;
  border-bottom: 1px solid #e3e3e3;
}

:deep(.basis-box .el-dialog__body) {
  padding: 30px 40px 10px;
  border-bottom: 1px solid #e3e3e3;
}
</style>
