<template>
  <div>
    <div class="feedback">
      <el-card class="feedback-card">
        <el-tabs v-model="currentTab" class="tabs" @tab-click="onClickTab">
          <el-tab-pane :label="`全部(${allFeedBack.total})`" :name="TAB.ALL">
            <el-table :data="allFeedBack.records" style="width: 100%">
              <el-table-column prop="username" label="用户名" align="center" />
              <el-table-column prop="uuid" label="用户id" align="center" />
              <el-table-column
                :formatter="formatType"
                prop="type"
                label="用户反馈"
                align="center"
              />
              <el-table-column prop="version" label="用户版本" align="center" />
              <el-table-column prop="state" label="状态" :formatter="formatState" align="center" />
              <el-table-column
                class="feedback-operationBtn"
                label="操作"
                align="center"
                v-slot="scope"
              >
                <div class="feedback-viewDetails">
                  <el-button
                    v-show="scope.row.state === 0"
                    @click="OnHandleCommand(scope.row.userId, scope.row.feedbackId)"
                    >快捷回复</el-button
                  >
                  <el-button v-show="!(scope.row.state === 0)">已回复</el-button>
                  <a
                    href="javascript:void(0);"
                    class="feedback-viewDetails-btn"
                    @click="OnViewDetail(scope.row.uuid, scope.row.userId)"
                    >查看详情</a
                  >
                </div>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane :label="`已查看(${readFeedBacks.total})`" :name="TAB.READ">
            <el-table :data="readFeedBacks.records" style="width: 100%">
              <el-table-column prop="username" label="用户名" align="center" />
              <el-table-column prop="uuid" label="用户id" align="center" />
              <el-table-column
                :formatter="formatType"
                prop="type"
                label="用户反馈"
                align="center"
              />
              <el-table-column prop="version" label="用户版本" align="center" />
              <el-table-column prop="state" label="状态" align="center" />
              <el-table-column
                class="feedback-operationBtn"
                label="操作"
                align="center"
                v-slot="scope"
              >
                <div class="feedback-viewDetails">
                  <el-button
                    v-show="scope.row.state === 0"
                    @click="OnHandleCommand(scope.row.userId, scope.row.feedbackId)"
                    >快捷回复</el-button
                  >
                  <el-button v-show="!(scope.row.state === 0)">已回复</el-button>

                  <a
                    href="javascript:void(0);"
                    class="feedback-viewDetails-btn"
                    @click="OnViewDetail(scope.row.uuid, scope.row.userId)"
                    >查看详情</a
                  >
                </div>
              </el-table-column>
            </el-table></el-tab-pane
          >
          <el-tab-pane :label="`未查看(${unReadFeedBacks.total})`" :name="TAB.UNREAD">
            <el-table :data="unReadFeedBacks.records" style="width: 100%">
              <el-table-column prop="username" label="用户名" align="center" />
              <el-table-column prop="uuid" label="用户id" align="center" />
              <el-table-column
                :formatter="formatType"
                prop="type"
                label="用户反馈"
                align="center"
              />
              <el-table-column prop="version" label="用户版本" align="center" />
              <el-table-column prop="state" label="状态" align="center" />
              <el-table-column
                class="feedback-operationBtn"
                label="操作"
                align="center"
                v-slot="scope"
              >
                <div class="feedback-viewDetails">
                  <el-button
                    v-show="scope.row.state === 0"
                    @click="OnHandleCommand(scope.row, scope.row.feedbackId)"
                    >快捷回复</el-button
                  >
                  <el-button v-show="!(scope.row.state === 0)">已回复</el-button>
                  <a
                    href="javascript:void(0);"
                    class="feedback-viewDetails-btn"
                    @click="OnViewDetail(scope.row.uuid, scope.row.userId)"
                    >查看详情</a
                  >
                </div>
              </el-table-column>
            </el-table></el-tab-pane
          >
        </el-tabs>
      </el-card>
    </div>
    <el-dialog v-model="dialogTableVisible">
      <span class="dialogTableVisible_title">反馈内容</span>
      <el-card class="feedback-card">
        <div class="feedback-image__preview">
          <el-image
            style="width: 150px; height: 150px"
            :src="url"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :preview-src-list="srcList"
            :initial-index="4"
            fit="cover"
            title="点击预览哦"
          />
        </div>
        <div class="dialogCard-title">
          <span>{{ feedBackContent }}</span>
        </div>
        <template #footer>
          <el-input v-model="textarea" :rows="7" type="textarea" placeholder="请输入回复内容" />
          <div class="dialogCard-btn">
            <el-button @click="OnCancelMsg">取消</el-button>
            <el-button type="primary" @click="OnHandleMsg">发送</el-button>
          </div>
        </template>
      </el-card>
    </el-dialog>
    <!-- 全部 pagination -->
    <pagination
      v-show="isRead === 0"
      :total="allFeedBack.total"
      :page="allFeedBack.current"
      :limit="allFeedBack.size"
      @pagination="clickToChange"
      class="pagination_feedBack"
    />
    <!-- 已读 pagination -->
    <pagination
      v-show="isRead === 1"
      :total="readFeedBacks.total"
      :page="readFeedBacks.current"
      :limit="readFeedBacks.size"
      @pagination="clickToRead"
      class="pagination_feedBack"
    />
    <!-- 未读 pagination -->
    <pagination
      v-show="isRead === 2"
      :total="unReadFeedBacks.total"
      :page="unReadFeedBacks.current"
      :limit="readFeedBacks.size"
      @pagination="clickToUnRead"
      class="pagination_feedBack"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, toRefs, computed } from 'vue'
import { ElMessageBox, ElMessage, type TabsPaneContext } from 'element-plus'
import { useFeedBackStore } from '@/store/modules/feedback'

import { changeStateToRead } from '@/api/feedback'
import { pageInfo } from '@/types/pageMessage'
import { ReplyInfo } from '@/types/feedback'
import { storeToRefs } from 'pinia'

const enum TAB {
  /**全部 */
  ALL = 0,
  /**已查看 */
  READ = 1,
  /**未查看 */
  UNREAD = 2
}

const enum STATE_TYPE {
  /**未读 */
  UNREAD = '未读',
  /**已读 */
  READ = '已读',
  /**已读已回复 */
  REPLY = '已读已回复'
}

const enum FACEBACK_TYPE {
  /**无法打开小程序 */
  CANNOT_OPEN_MINI_PROGRAM = '无法打开小程序',
  /**小程序闪退 */
  MINI_PROGRAM_FLASH_BACK = '小程序闪退',
  /**页面加载慢 */
  PAGE_LOAD_SLOW = '页面加载慢',
  /**其他异常 */
  OTHER_EXCEPTION = '其他异常',
  /**产品开发建议 */
  PRODUCT_DEVELOPMENT_SUGGESTIONS = '产品开发建议',
  /**意见反馈 */
  FEEDBACK = '意见反馈'
}
const feedBackStore = useFeedBackStore()
const { replyMessage, getUnReadFeedback, getReadFeedback, getAllFeedBack } = feedBackStore
const { allFeedBack, readFeedBacks, unReadFeedBacks } = storeToRefs(feedBackStore)

const currentTab = ref(TAB.ALL)
//打开反馈
const dialogTableVisible = ref(false)

//照片地址
const url = ref()

//预览照片地址
const srcList = ref<string[]>([])

//收到的反馈内容
const feedBackContent = ref('')

//文本框内容
const textarea = ref('')

// 存储 userId
const userId = ref(0)

//表示pagination
const isRead = ref(0)

// 回复消息
const OnHandleMsg = async () => {
  if (textarea.value === '') {
    ElMessage.warning('回复内容不能为空')
  } else {
    // // 调用后端接口
    // await replyMessage(userId.value, textarea.value)

    // 关闭回复框
    dialogTableVisible.value = false

    // 将 textarea 内容清空
    textarea.value = ''
  }
}
// 取消发送
const OnCancelMsg = () => {
  // 清空 textarea 内容
  textarea.value = ''
  // 关闭回复框
  dialogTableVisible.value = false
}

//切换tab 栏
const onClickTab = (tab: TabsPaneContext) => {
  const { paneName } = tab
  // 提取tab 信息
  console.log(paneName)
  let string = tab.props.label.substring(0, tab.props.label.indexOf('('))
  if (string === '全部') {
    // ChangeTabMsg(0)
    isRead.value = 0
    getUnReadFeedback(0, 10)
  } else if (string === '已查看') {
    isRead.value = 1
    // 获取已读数据
    getReadFeedback(0, 10)
  } else {
    isRead.value = 2
    // 获取未读数据
    getUnReadFeedback(0, 10)
  }
}

//点击打开详情 (要抽离逻辑)
const OnViewDetail = async (id: number, user: number) => {
  // 控制详情页显示与否
  dialogTableVisible.value = true
  userId.value = user

  //通过 id 筛选出对应反馈信息
  let feedBacks = allFeedBack.value.records.filter((item) => item.uuid === id)

  // 视图更新
  url.value = feedBacks[0]?.imageUrl[0]
  srcList.value = feedBacks[0]?.imageUrl
  feedBackContent.value = feedBacks[0]?.content

  //判断 已读还是未读
  if (feedBacks[0]?.state === 0) {
    // 将未读设置为已读并请求新数据
    await feedBackAsRead(feedBacks[0].feedbackId.toString())
    // // 将状态改变
    // feedBacks[0].state = '已读'
  }

  //获取数据 全部数据
  await getAllFeedBack(allFeedBack.value.current, 10)
}

// 将未读改为已读，获取最新数据
const feedBackAsRead = async (id: string) => {
  // 将未读改为已读
  await changeStateToRead(id, 0)
  // 请求已读数据
  await getReadFeedback(0, 10)

  // 获取未读数据
  await getUnReadFeedback(0, 10)
}

// 按钮逻辑
const OnHandleCommand = async (scope: any, feedbackId: string) => {
  // 存储当前行的 userId
  userId.value = scope

  // 发送快捷回复
  await replyMessage(scope)
  // 将状态改为已回复
  await changeStateToRead(feedbackId, 1)
  // 请求新数据
  //获取数据 全部数据
  await getAllFeedBack(allFeedBack.value.current, 10)
}

// 格式化反馈内容
const formatType = (value: any) => {
  const { type } = value
  switch (type) {
    case 1:
      return FACEBACK_TYPE.CANNOT_OPEN_MINI_PROGRAM
    case 2:
      return FACEBACK_TYPE.MINI_PROGRAM_FLASH_BACK
    case 3:
      return FACEBACK_TYPE.PAGE_LOAD_SLOW
    case 4:
      return FACEBACK_TYPE.OTHER_EXCEPTION
    case 5:
      return FACEBACK_TYPE.PRODUCT_DEVELOPMENT_SUGGESTIONS
    default:
      return FACEBACK_TYPE.FEEDBACK
  }
}

//格式化状态
const formatState = (value: any) => {
  const { state } = value
  switch (state) {
    case 0:
      return STATE_TYPE.UNREAD
    case 1:
      return STATE_TYPE.READ
    case 2:
      return STATE_TYPE.REPLY
    default:
      return STATE_TYPE.UNREAD
  }
}
//初次加载获取数据
// 获取已读数据
getReadFeedback(0, 10)

// 获取未读数据
getUnReadFeedback(0, 10)

//获取数据 全部数据
getAllFeedBack(0, 10)

// pagination  全部逻辑
const clickToChange = async (pageMessage: pageInfo) => {
  //更改页面信息
  allFeedBack.value.current = pageMessage.currentPage
  allFeedBack.value.size = pageMessage.pageLimit
  // 发送请求
  await getAllFeedBack(pageMessage.currentPage, pageMessage.pageLimit)
}

// pagination  已读逻辑
const clickToRead = async (pageMessage: pageInfo) => {
  //更改页面信息
  readFeedBacks.value.current = pageMessage.currentPage
  readFeedBacks.value.size = pageMessage.pageLimit
  // 发送请求
  await getReadFeedback(pageMessage.currentPage, pageMessage.pageLimit)
}

// pagination  未读逻辑
const clickToUnRead = async (pageMessage: pageInfo) => {
  //更改页面信息
  unReadFeedBacks.value.current = pageMessage.currentPage
  unReadFeedBacks.value.size = pageMessage.pageLimit
  // 发送请求
  await getUnReadFeedback(pageMessage.currentPage, pageMessage.pageLimit)
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
.dialogCard-btn {
  float: right;
  margin: 10px 30px;
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
.feedback-card {
  padding-top: 0px;
  box-shadow: none;
}
.dialogTableVisible_title {
  color: #000;
  margin-left: 14px;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
.pagination_feedBack {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
