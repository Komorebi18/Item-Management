<template>
  <div>
    <div class="feedback">
      <el-card class="feedback-card">
        <!-- Tab栏 -->
        <el-tabs v-model="currentTab" class="tabs" @tab-click="onClickTab">
          <el-tab-pane :label="`全部(${allFeedBack.total})`" :name="TAB.ALL">
            <!-- 全部 -->
            <FeedBackTable
              :tableData="allFeedBack"
              @replyQuick="onReplyQuick"
              @viewDetail="onViewDetail"
              @changePage="onChangeAllPage"
            />
          </el-tab-pane>
          <el-tab-pane :label="`已查看(${readFeedBacks.total})`" :name="TAB.READ">
            <!--已查看 -->
            <FeedBackTable
              :tableData="readFeedBacks"
              @replyQuick="onReplyQuick"
              @viewDetail="onViewDetail"
              @changePage="onChangeReadPage"
            />
          </el-tab-pane>
          <el-tab-pane :label="`未查看(${unReadFeedBacks.total})`" :name="TAB.UNREAD">
            <!-- 未查看 -->
            <FeedBackTable
              :tableData="unReadFeedBacks"
              @replyQuick="onReplyQuick"
              @viewDetail="onViewDetail"
              @changePage="onChangeUnReadPage"
            />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 对话框 -->
    <FeedBackDialog ref="feedBackDiagRef" :currentFeedBack="currentFeedBack" />
  </div>
</template>
<script lang="ts" setup>
// 回复用户

import { ref, onMounted, computed } from 'vue'
import { type TabsPaneContext } from 'element-plus'
import { useFeedBackStore } from '@/store/modules/feedback'
import { pageInfo } from '@/types/pageMessage'
import { storeToRefs } from 'pinia'
import FeedBackTable from './components/FeedBackTable.vue'
import FeedBackDialog from './components/FeedBackDialog.vue'
import { TAB } from '@/enums/Feedback'
import { replyUser } from '@/api/feedback'
import { DEFAULT_REPLY_MSG } from './constants'

const feedBackStore = useFeedBackStore()
const {
  getUnReadFeedbacks,
  getAllFeedBacks,
  getReadFeedbacks,
  updateStateReply,
  updateStateToRead,
  refreshAllFeedBacks,
  refreshReadFeedbacks,
  refreshUnReadFeedbacks
} = feedBackStore
const { allFeedBack, readFeedBacks, unReadFeedBacks } = storeToRefs(feedBackStore)

// 当前Tab状态
const currentTab = ref<TAB>(TAB.ALL)

// 当前行的feedBackId
const currentFeedbackId = ref<number>()

// 获取对话框组件
const feedBackDiagRef = ref<InstanceType<typeof FeedBackDialog>>()

// 获取当前行的反馈信息
const currentFeedBack = computed(() => {
  return allFeedBack.value.records.find((item) => item.feedbackId === currentFeedbackId.value)
})

// 切换tab 栏
const onClickTab = async (tab: TabsPaneContext) => {
  const { paneName } = tab
  if (paneName === TAB.ALL) {
    refreshAllFeedBacks()
  } else if (paneName === TAB.READ) {
    refreshReadFeedbacks()
  } else {
    refreshUnReadFeedbacks()
  }
}

//点击打开详情
const onViewDetail = (feedbackId: number) => {
  // 控制详情页显示
  feedBackDiagRef.value?.openDialog()

  // 纪录当前行 feedBackID
  currentFeedbackId.value = feedbackId

  // 判断是否已读
  if (currentFeedBack.value?.state === 0) {
    // 将未读设置为已读并刷新数据
    updateStateToRead(feedbackId)
  }
}

// 按钮逻辑
const onReplyQuick = async (userId: number, feedbackId: number) => {
  // 发送回复消息
  await replyUser({
    ...DEFAULT_REPLY_MSG,
    userIds: [userId]
  })

  // 发送更改消息状态，刷新已读和未读
  updateStateReply(feedbackId)
}

// 初次加载获取数据
onMounted(() => {
  getReadFeedbacks(0, 10)

  getUnReadFeedbacks(0, 10)

  getAllFeedBacks(0, 10)
})

const onChangeAllPage = (pageMessage: pageInfo) => {
  getAllFeedBacks(pageMessage.currentPage, pageMessage.pageLimit)
}

const onChangeReadPage = async (pageMessage: pageInfo) => {
  getReadFeedbacks(pageMessage.currentPage, pageMessage.pageLimit)
}

const onChangeUnReadPage = async (pageMessage: pageInfo) => {
  getUnReadFeedbacks(pageMessage.currentPage, pageMessage.pageLimit)
}
</script>

<style scoped lang="scss">
.feedback-card {
  margin: 14px 14px 14px 14px;
}

.feedback-viewDetails {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .feedback-viewDetails-btn {
    text-decoration: underline;
  }
}
.card_img {
  width: 234px;
  height: 114px;
  background-color: bisque;
}
.dialogCard-title {
  margin-top: 25px;
}
.demo-image__error .image-slot {
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}
.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}

.card-header {
  color: #000;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
.dialogCard-title {
  color: #9d9d9d;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.pagination_feedBack {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
