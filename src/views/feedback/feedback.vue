<template>
  <div>
    <div class="feedback">
      <el-card class="feedback-card">
        <!-- Tab栏 -->
        <el-tabs v-model="currentTab" class="tabs" @tab-click="onClickTab">
          <el-tab-pane :label="`全部(${allFeedBack.total})`" :name="TAB.ALL">
            <!-- 全部 -->
            <FeedBackTable
              :tableData="allFeedBack.records"
              @replyQuick="onReplyQuick"
              @viewDetail="onViewDetail"
            />
          </el-tab-pane>
          <el-tab-pane :label="`已查看(${readFeedBacks.total})`" :name="TAB.READ">
            <!--已查看 -->
            <FeedBackTable
              :tableData="readFeedBacks.records"
              @replyQuick="onReplyQuick"
              @viewDetail="onViewDetail"
            />
          </el-tab-pane>
          <el-tab-pane :label="`未查看(${unReadFeedBacks.total})`" :name="TAB.UNREAD">
            <!-- 未查看 -->
            <FeedBackTable
              :tableData="unReadFeedBacks.records"
              @replyQuick="onReplyQuick"
              @viewDetail="onViewDetail"
            />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 对话框 -->
    <FeedBackDiag ref="FeedBackDiagRef" :currentFeedBack="currentFeedBack" :replyMsg="replyMsg" />
    <!-- 全部 pagination -->
    <pagination
      v-show="currentTab === TAB.ALL"
      :total="allFeedBack.total"
      :page="allFeedBack.current"
      :limit="allFeedBack.size"
      @pagination="onChangeAllPage"
      class="pagination_feedBack"
    />
    <!-- 已读 pagination -->
    <pagination
      v-show="currentTab === TAB.READ"
      :total="readFeedBacks.total"
      :page="readFeedBacks.current"
      :limit="readFeedBacks.size"
      @pagination="onChangeReadPage"
      class="pagination_feedBack"
    />
    <!-- 未读 pagination -->
    <pagination
      v-show="currentTab === TAB.UNREAD"
      :total="unReadFeedBacks.total"
      :page="unReadFeedBacks.current"
      :limit="readFeedBacks.size"
      @pagination="onChangeUnReadPage"
      class="pagination_feedBack"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { type TabsPaneContext } from 'element-plus'
import { useFeedBackStore } from '@/store/modules/feedback'

import { pageInfo } from '@/types/pageMessage'
import { ReplyInfo } from '@/types/feedback'
import { storeToRefs } from 'pinia'
import FeedBackTable from './components/FeedBackTable.vue'
import FeedBackDiag from './components/FeedBackDiag.vue'
const enum TAB {
  /**全部 */
  ALL,
  /**已查看 */
  READ,
  /**未查看 */
  UNREAD
}
// 页数
const PAGE_SIZE = 10

// 偏移量
const PAGE_OFFSET = 0

// 回复标题
const TITLE = '收到反馈'

// 默认回复内容
const DEFUALT_CONTENT = '感谢您的反馈！我们非常重视您提供的信息，我们会尽快处理并采取适当的措施。'

const feedBackStore = useFeedBackStore()
const {
  getUnReadFeedbacks,
  getAllFeedBacks,
  getReadFeedbacks,
  updateStateToRead,
  replyToUser,
  updateStateReply,
  refreshAllFeedBacks,
  refreshReadFeedbacks,
  refreshUnReadFeedbacks
} = feedBackStore
const { allFeedBack, readFeedBacks, unReadFeedBacks } = storeToRefs(feedBackStore)

// 当前Tab状态
const currentTab = ref(TAB.ALL)

// 当前行的feedBackId
const currentFeedbackId = ref()

// 获取对话框组件
const FeedBackDiagRef = ref<InstanceType<typeof FeedBackDiag>>()

// 获取当前行的反馈信息
const currentFeedBack = computed(() => {
  return allFeedBack.value.records.find((item) => item.feedbackId === currentFeedbackId.value)
})

// 快捷回复消息
const replyMsg = ref<ReplyInfo>({
  title: TITLE,
  content: DEFUALT_CONTENT,
  userId: 1,
  userIds: [],
  groupId: 0,
  typeId: 1
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
const onViewDetail = async (feedbackId: number) => {
  // 控制详情页显示
  FeedBackDiagRef.value?.openDialog()

  // 纪录当前行 feedBackID
  currentFeedbackId.value = feedbackId

  // 判断是否已读
  if (currentFeedBack.value?.state === 0) {
    // 将未读设置为已读并刷新数据
    await updateStateToRead(feedbackId)
  }
}

// 按钮逻辑
const onReplyQuick = async (userId: number, feedbackId: number) => {
  // 合并对象，更新最新数据
  Object.assign(replyMsg.value, { userIds: [userId] })

  // 发送回复消息
  await replyToUser(replyMsg.value)

  // 发送更改消息状态，刷新已读和未读
  updateStateReply(feedbackId)
}

// 初次加载获取数据
onMounted(() => {
  getReadFeedbacks(PAGE_OFFSET, PAGE_SIZE)

  getUnReadFeedbacks(PAGE_OFFSET, PAGE_SIZE)

  getAllFeedBacks(PAGE_OFFSET, PAGE_SIZE)
})

const onChangeAllPage = async (pageMessage: pageInfo) => {
  await getAllFeedBacks(pageMessage.currentPage, pageMessage.pageLimit)
}

const onChangeReadPage = async (pageMessage: pageInfo) => {
  await getReadFeedbacks(pageMessage.currentPage, pageMessage.pageLimit)
}

const onChangeUnReadPage = async (pageMessage: pageInfo) => {
  await getUnReadFeedbacks(pageMessage.currentPage, pageMessage.pageLimit)
}
</script>

<style scoped lang="scss">
.text {
  font-size: 14px;
}

.el-card {
  margin: 14px 14px 14px 14px;
}
// .el-button {
//   padding-right: 20px;
// }
.feedback-viewDetails {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .feedback-viewDetails-btn {
    text-decoration: underline;
  }
}
.el-button {
  margin-right: 20px;
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
