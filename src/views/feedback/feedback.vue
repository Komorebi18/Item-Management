<template>
  <div>
    <div class="feedback">
      <el-card class="box-card">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane :label="`全部(${feedBackStore.allFeedBack.total})`" name="first">
            <el-table :data="feedBackStore.userFeedBack" style="width: 100%">
              <el-table-column prop="username" label="用户名" align="center" />
              <el-table-column prop="uuid" label="用户id" align="center" />
              <el-table-column
                :formatter="chooseContent"
                prop="type"
                label="用户反馈"
                align="center"
              />
              <el-table-column prop="version" label="用户版本" align="center" />
              <el-table-column prop="state" label="状态" align="center" />
              <el-table-column class="btn_operation" label="操作" align="center" v-slot="scope">
                <div class="details">
                  <el-button
                    v-show="!(scope.row.state === '已回复')"
                    @click="handleCommand(scope.$index, scope.row.userId, scope.row.feedbackId)"
                    >快捷回复</el-button
                  >
                  <el-button v-show="scope.row.state === '已回复'">已回复</el-button>
                  <a
                    href="javascript:void(0);"
                    class="details_title"
                    @click="viewDetail(scope.row.uuid, scope.row.userId)"
                    >查看详情</a
                  >
                </div>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane :label="`已查看(${feedBackStore.readFeedBacks.total})`" name="second">
            <el-table :data="feedBackStore.readFeedBack" style="width: 100%">
              <el-table-column prop="username" label="用户名" align="center" />
              <el-table-column prop="uuid" label="用户id" align="center" />
              <el-table-column
                :formatter="chooseContent"
                prop="type"
                label="用户反馈"
                align="center"
              />
              <el-table-column prop="version" label="用户版本" align="center" />
              <el-table-column prop="state" label="状态" align="center" />
              <el-table-column class="btn_operation" label="操作" align="center" v-slot="scope">
                <div class="details">
                  <el-button
                    v-show="!replyStatus[scope.$index]"
                    @click="handleCommand(scope.$index, scope.row.userId, scope.row.feedbackId)"
                    >快捷回复</el-button
                  >
                  <el-button v-show="scope.row.state === '已回复' || replyStatus[scope.$index]"
                    >已回复</el-button
                  >

                  <a
                    href="javascript:void(0);"
                    class="details_title"
                    @click="viewDetail(scope.row.uuid, scope.row.userId)"
                    >查看详情</a
                  >
                </div>
              </el-table-column>
            </el-table></el-tab-pane
          >
          <el-tab-pane :label="`未查看(${feedBackStore.unReadFeedBacks.total})`" name="third">
            <el-table :data="feedBackStore.unReadFeedBack" style="width: 100%">
              <el-table-column prop="username" label="用户名" align="center" />
              <el-table-column prop="uuid" label="用户id" align="center" />
              <el-table-column
                :formatter="chooseContent"
                prop="type"
                label="用户反馈"
                align="center"
              />
              <el-table-column prop="version" label="用户版本" align="center" />
              <el-table-column prop="state" label="状态" align="center" />
              <el-table-column class="btn_operation" label="操作" align="center" v-slot="scope">
                <div class="details">
                  <el-button
                    v-show="!replyStatus[scope.$index]"
                    @click="handleCommand(scope.$index, scope.row, scope.row.feedbackId)"
                    >快捷回复</el-button
                  >
                  <el-button v-show="scope.row.state === '已回复' || replyStatus[scope.$index]"
                    >已回复</el-button
                  >
                  <a
                    href="javascript:void(0);"
                    class="details_title"
                    @click="viewDetail(scope.row.uuid, scope.row.userId)"
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
      <text class="dialogTableVisible_title">反馈内容</text>
      <el-card class="box-card">
        <div class="demo-image__preview">
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
        <div class="card_title">
          <span>{{ feedBackContent }}</span>
        </div>
        <template #footer>
          <el-input v-model="textarea" :rows="7" type="textarea" placeholder="请输入回复内容" />
          <div class="card_btn">
            <el-button @click="cancelMsg">取消</el-button>
            <el-button type="primary" @click="handleMsg">发送</el-button>
          </div>
        </template>
      </el-card>
    </el-dialog>
    <!-- 全部 pagination -->
    <pagination
      v-show="isRead === 0"
      :total="feedBackStore.allFeedBack.total"
      :page="feedBackStore.allFeedBack.current"
      :limit="feedBackStore.allFeedBack.size"
      @pagination="clickToChange"
      class="pagination_feedBack"
    />
    <!-- 已读 pagination -->
    <pagination
      v-show="isRead === 1"
      :total="feedBackStore.readFeedBacks.total"
      :page="feedBackStore.readFeedBacks.current"
      :limit="feedBackStore.readFeedBacks.size"
      @pagination="clickToRead"
      class="pagination_feedBack"
    />
    <!-- 未读 pagination -->
    <pagination
      v-show="isRead === 2"
      :total="feedBackStore.unReadFeedBacks.total"
      :page="feedBackStore.unReadFeedBacks.current"
      :limit="feedBackStore.readFeedBacks.size"
      @pagination="clickToUnRead"
      class="pagination_feedBack"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, toRefs, computed } from 'vue'
import { ElMessageBox, ElMessage, type TabsPaneContext } from 'element-plus'
import { useFeedBackStore } from '@/store/modules/feedback'
import { chooseContent } from '@/utils/chooseFeedBack'
import { changeStateAPI } from '@/api/feedback'
import { pageInfo } from '@/types/pageMessage'
import { ReplyInfo } from '@/types/feedback'

//获取数据
const feedBackStore = useFeedBackStore()
const activeName = ref('first')
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

//控制btn 按钮
const replyStatus = ref([false])

// 存储 userId
const userId = ref(0)

//表示pagination
const isRead = ref(0)

// 回复消息
const handleMsg = async () => {
  if (textarea.value === '') {
    ElMessage.warning('回复内容不能为空')
  } else {
    // 调用后端接口
    await feedBackStore.replyMessage(userId.value, textarea.value)

    // 关闭回复框
    dialogTableVisible.value = false

    // 将 textarea 内容清空
    textarea.value = ''
  }
}
// 取消发送
const cancelMsg = () => {
  // 清空 textarea 内容
  textarea.value = ''
  // 关闭回复框
  dialogTableVisible.value = false
}

//切换tab 栏
const handleClick = (tab: TabsPaneContext) => {
  // 提取tab 信息
  let string = tab.props.label.substring(0, tab.props.label.indexOf('('))
  if (string === '全部') {
    // ChangeTabMsg(0)
    isRead.value = 0
    feedBackStore.unReadInfo(0, 10)
  } else if (string === '已查看') {
    isRead.value = 1
    // 获取已读数据
    feedBackStore.readInfo(0, 10)
  } else {
    isRead.value = 2
    // 获取未读数据
    feedBackStore.unReadInfo(0, 10)
  }
}

//点击打开详情 (要抽离逻辑)
const viewDetail = async (id: number, user: number) => {
  // 控制详情页显示与否
  dialogTableVisible.value = true
  userId.value = user

  //通过 id 筛选出对应反馈信息
  let feedBacks = feedBackStore.userFeedBack.filter((item) => item.uuid === id)

  // 视图更新
  url.value = feedBacks[0]?.imageUrl[0]
  srcList.value = feedBacks[0]?.imageUrl
  feedBackContent.value = feedBacks[0]?.content

  //判断 已读还是未读
  if (feedBacks[0]?.state === '未读') {
    // 将未读设置为已读并请求新数据
    await feedBackAsRead(feedBacks[0].feedbackId)
    // 将状态改变
    feedBacks[0].state = '已读'
  }

  //获取数据 全部数据
  await feedBackStore.getAllFeedBack(feedBackStore.allFeedBack.current, 10)
}

// 将未读改为已读，获取最新数据
const feedBackAsRead = async (id: number) => {
  // 将未读改为已读
  await changeStateAPI(id, 0)
  // 请求已读数据
  await feedBackStore.readInfo(0, 10)

  // 获取未读数据
  await feedBackStore.unReadInfo(0, 10)
}

// 按钮逻辑
const handleCommand = async (index: number, scope: any, feedbackId: number) => {
  // 将当前行的按钮状态设置为 true
  replyStatus.value[index] = true

  // 存储当前行的 userId
  userId.value = scope

  // 发送快捷回复
  await feedBackStore.replyMessage(scope)
  // 将状态改为已回复
  await changeStateAPI(feedbackId, 1)
  // 请求新数据
  //获取数据 全部数据
  await feedBackStore.getAllFeedBack(feedBackStore.allFeedBack.current, 10)
}

// 初次加载获取数据
// 获取已读数据
feedBackStore.readInfo(0, 10)

// 获取未读数据
feedBackStore.unReadInfo(0, 10)

//获取数据 全部数据
feedBackStore.getAllFeedBack(0, 10)

// pagination  全部逻辑
const clickToChange = async (pageMessage: pageInfo) => {
  //更改页面信息
  feedBackStore.allFeedBack.current = pageMessage.currentPage
  feedBackStore.allFeedBack.size = pageMessage.pageLimit
  // 发送请求
  await feedBackStore.getAllFeedBack(pageMessage.currentPage, pageMessage.pageLimit)
}

// pagination  已读逻辑
const clickToRead = async (pageMessage: pageInfo) => {
  //更改页面信息
  feedBackStore.readFeedBacks.current = pageMessage.currentPage
  feedBackStore.readFeedBacks.size = pageMessage.pageLimit
  // 发送请求
  await feedBackStore.readInfo(pageMessage.currentPage, pageMessage.pageLimit)
}

// pagination  未读逻辑
const clickToUnRead = async (pageMessage: pageInfo) => {
  //更改页面信息
  feedBackStore.unReadFeedBacks.current = pageMessage.currentPage
  feedBackStore.unReadFeedBacks.size = pageMessage.pageLimit
  // 发送请求
  await feedBackStore.unReadInfo(pageMessage.currentPage, pageMessage.pageLimit)
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
.details {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .details_title {
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
.card_title {
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
.card_btn {
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
.card_title {
  color: #9d9d9d;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.box-card {
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
