<template>
  <div class="box">
    <!-- 页面顶部 -->
    <div class="header">
      <el-button
        type="primary"
        :icon="Plus"
        class="button-deliver"
        color="#2F3367"
        @click="deliverMessage"
      >
        发布新的通知
      </el-button>
      <div class="search-box">
        <el-input v-model="searchInput" placeholder="请输入关键词" />
        <el-button class="search-button" color="#2F3367" @click="searchNotice">
          <el-icon>
            <Search style="color: #fff" />
          </el-icon>
        </el-button>
      </div>
    </div>
    <!-- 页面主要内容展示 -->
    <el-main style="padding-top: 0; overflow: hidden">
      <!-- 通知展示表格 -->
      <el-tabs v-model="activeName" class="tabs" @tab-change="handleTabChange">
        <el-scrollbar class="pane-content" ref="scrollbarRef">
          <el-tab-pane label="全部" name="0">
            <div v-for="notice in noticeStore.singleAdminNoticeList.records" :key="notice.noticeId">
              <el-row :gutter="20" class="single-message">
                <el-col :span="9">
                  <div class="title">
                    <img
                      src="../../assets/icons/info-success.svg"
                      alt=""
                      style="width: 1em; height: 1em; margin: 5px"
                    />
                    <h3>{{ notice.title }}</h3>
                  </div>
                  <el-text class="w-150px mb-2" truncated style="color: #8a8ea8; margin-left: 2em">
                    {{ notice.content }}
                  </el-text>
                </el-col>
                <el-col :span="5">
                  <span class="date">{{ notice.publishTime }}</span>
                </el-col>
                <el-col :span="3">
                  <span class="deliver">{{ notice.adminName }}</span>
                </el-col>
                <el-col :span="3" style="display: flex; justify-content: space-between">
                  <el-tooltip effect="dark" content="查看" placement="top">
                    <el-icon color="#2F3367">
                      <View />
                    </el-icon>
                  </el-tooltip>
                  <el-tooltip
                    v-if="notice.state === 3"
                    effect="dark"
                    content="发送"
                    placement="top"
                  >
                    <el-icon color="#2F3367" @click="handleIconClick">
                      <Promotion />
                    </el-icon>
                  </el-tooltip>
                  <el-tooltip
                    v-if="notice.state === 1 || notice.state === 4"
                    effect="dark"
                    content="编辑"
                    placement="top"
                  >
                    <el-icon color="#2F3367" @click="handleIconClick">
                      <EditPen />
                    </el-icon>
                  </el-tooltip>
                  <el-tooltip
                    v-if="notice.state === 1 || notice.state === 4"
                    effect="dark"
                    content="删除"
                    placement="top"
                  >
                    <el-icon
                      color="#2F3367"
                      @click="
                        handleIconClick('delete', notice.title as string, notice.noticeId as number)
                      "
                    >
                      <Delete />
                    </el-icon>
                  </el-tooltip>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="编辑中" name="1">
            <div v-for="notice in noticeStore.singleAdminNoticeList.records" :key="notice.noticeId">
              <el-row :gutter="20" class="single-message">
                <el-col :span="9">
                  <div class="title">
                    <img
                      src="../../assets/icons/info-success.svg"
                      alt=""
                      style="width: 1em; height: 1em; margin: 5px"
                    />
                    <h3>{{ notice.title }}</h3>
                  </div>
                  <el-text class="w-150px mb-2" truncated style="color: #8a8ea8; margin-left: 2em">
                    {{ notice.content }}
                  </el-text>
                </el-col>
                <el-col :span="5">
                  <span class="date">{{ notice.publishTime }}</span>
                </el-col>
                <el-col :span="3">
                  <span class="deliver">{{ notice.username }}</span>
                </el-col>
                <el-col :span="3" style="display: flex; justify-content: space-between">
                  <el-tooltip effect="dark" content="发送" placement="top">
                    <el-icon color="#2F3367" @click="handleIconClick">
                      <Promotion />
                    </el-icon>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="删除" placement="top">
                    <el-icon color="#2F3367">
                      <Delete />
                    </el-icon>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="查看" placement="top">
                    <el-icon color="#2F3367">
                      <View />
                    </el-icon>
                  </el-tooltip>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="审核中" name="2">
            <div v-for="notice in noticeStore.singleAdminNoticeList.records" :key="notice.noticeId">
              <el-row :gutter="20" class="single-message">
                <el-col :span="9">
                  <div class="title">
                    <img
                      src="../../assets/icons/info-success.svg"
                      alt=""
                      style="width: 1em; height: 1em; margin: 5px"
                    />
                    <h3>{{ notice.title }}</h3>
                  </div>
                  <el-text class="w-150px mb-2" truncated style="color: #8a8ea8; margin-left: 2em">
                    {{ notice.content }}
                  </el-text>
                </el-col>
                <el-col :span="5">
                  <span class="date">{{ notice.publishTime }}</span>
                </el-col>
                <el-col :span="3">
                  <span class="deliver">{{ notice.username }}</span>
                </el-col>
                <el-col :span="3" style="display: flex; justify-content: space-between">
                  <el-tooltip effect="dark" content="发送" placement="top">
                    <el-icon color="#2F3367" @click="handleIconClick">
                      <Promotion />
                    </el-icon>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="删除" placement="top">
                    <el-icon color="#2F3367">
                      <Delete />
                    </el-icon>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="查看" placement="top">
                    <el-icon color="#2F3367">
                      <View />
                    </el-icon>
                  </el-tooltip>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="已审核" name="3">
            <div v-for="notice in noticeStore.singleAdminNoticeList.records" :key="notice.noticeId">
              <el-row :gutter="20" class="single-message">
                <el-col :span="9">
                  <div class="title">
                    <img
                      src="../../assets/icons/info-success.svg"
                      alt=""
                      style="width: 1em; height: 1em; margin: 5px"
                    />
                    <h3>{{ notice.title }}</h3>
                  </div>
                  <el-text class="w-150px mb-2" truncated style="color: #8a8ea8; margin-left: 2em">
                    {{ notice.content }}
                  </el-text>
                </el-col>
                <el-col :span="5">
                  <span class="date">{{ notice.publishTime }}</span>
                </el-col>
                <el-col :span="3">
                  <span class="deliver">{{ notice.username }}</span>
                </el-col>
                <el-col :span="3" style="display: flex; justify-content: space-between">
                  <el-tooltip effect="dark" content="发送" placement="top">
                    <el-icon color="#2F3367" @click="handleIconClick">
                      <Promotion />
                    </el-icon>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="删除" placement="top">
                    <el-icon color="#2F3367">
                      <Delete />
                    </el-icon>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="查看" placement="top">
                    <el-icon color="#2F3367">
                      <View />
                    </el-icon>
                  </el-tooltip>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
        </el-scrollbar>
      </el-tabs>
    </el-main>
    <!-- 分页按钮 -->
    <pagination
      :total="noticeStore.singleAdminNoticeList.total"
      :page="noticeStore.singleAdminNoticeList.current"
      :limit="noticeStore.singleAdminNoticeList.size"
      @pagination="handlePageChange"
    />
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
<script setup lang="ts">
// import header from '/components/header.vue'
import { Delete, Search, Promotion, Plus, View, EditPen } from '@element-plus/icons-vue'
import pagination from '@/components/Pagination/index.vue'
import router from '@/router'
import { ref, onMounted } from 'vue'
import { useNoticeStore } from '@/store/modules/notice'
import type { pageInfo } from '@/types/pageMessage'
import { tr } from 'element-plus/es/locale'
// 搜索框内容
let searchInput = ref('')

// 当前页签
let activeName = ref('0')

// 控制删除信息对话框显示
let showDeleteBox = ref(false)

// 控制提示框显示
let showAlertBox = ref(false)

// 选中的通知Id
let chooseMessageId = ref(0)

// 选中的通知标题
let chooseMessageTitle = ref('')

// store数据
const noticeStore = useNoticeStore()

// 待绑定滚动条组件
const scrollbarRef = ref<HTMLElement | null>(null)

onMounted(() => {
  // 获取该管理员所有通知
  noticeStore.getSingleAdminNoticeList(activeName.value, searchInput.value, 0, 0)
})

// tab页签点击触发
const handleTabChange = () => {
  console.log(activeName.value)
  // 获取该管理员对应类型通知通知
  noticeStore.getSingleAdminNoticeList(activeName.value, searchInput.value, 0, 0)
}

// 点击icon图标
const handleIconClick = (type: string, title: string, noticeId: number) => {
  // 获取当前选中通知的信息
  chooseMessageTitle.value = title
  chooseMessageId.value = noticeId
  switch (type) {
    // 删除通知
    case 'delete':
      showDeleteBox.value = true
      break
    default:
      console.log('点击icon的意外情况')
  }
}

// 分页按钮点击触发
const handlePageChange = async (pageMessage: pageInfo) => {
  // 更新页面信息
  noticeStore.singleAdminNoticeList.current = pageMessage.currentPage
  noticeStore.singleAdminNoticeList.size = pageMessage.pageLimit
  // 发送请求获取新数据
  await noticeStore.getSingleAdminNoticeList(activeName.value, searchInput.value, 0, 0)
  // 滚动条回滚到顶端
  scrollbarRef.value?.scrollTo(0, 0)
}

// 搜索框筛选通知
const searchNotice = async () => {
  // 重置页面页码
  noticeStore.allNoticeList.current = 1
  // 发送请求更新数据
  await noticeStore.getSingleAdminNoticeList(activeName.value, searchInput.value, 0, 0)
}

// 删除通知
const handleDelete = async () => {
  showDeleteBox.value = false
  // 拿到待删除的通知Id发送请求
  await noticeStore.deleteOwnNotice(chooseMessageTitle.value, chooseMessageId.value)
  // 发送请求获取新数据
  await noticeStore.getSingleAdminNoticeList(activeName.value, searchInput.value, 0, 0)
  // 展示提示信息
  showAlertBox.value = true
  // 3s后关闭提示窗
  setTimeout(() => {
    showAlertBox.value = false
  }, 1500)
}

// 发布通知
const deliverMessage = () => {
  // 跳转到编辑页
  router.replace({ path: '/system/edit' })
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

.date {
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
</style>
