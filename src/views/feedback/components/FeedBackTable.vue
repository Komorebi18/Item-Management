<template>
  <el-table :data="prop.tableData.records" style="width: 100%">
    <el-table-column prop="username" label="用户名" align="center" />
    <el-table-column prop="uuid" label="用户id" align="center" />
    <el-table-column :formatter="formatType" prop="type" label="用户反馈" align="center" />
    <el-table-column prop="version" label="用户版本" align="center" />
    <el-table-column prop="state" label="状态" :formatter="formatState" align="center" />
    <el-table-column class="feedback-operationBtn" label="操作" align="center" v-slot="scope">
      <div class="feedback-viewDetails">
        <el-button
          class="btn"
          v-show="!(scope.row.state === 2)"
          @click="OnReplyQuick(scope.row.userId, scope.row.feedbackId)"
          >快捷回复</el-button
        >
        <el-button class="btn" v-show="scope.row.state === 2">已回复</el-button>
        <a
          href="javascript:void(0);"
          class="feedback-viewDetails-btn"
          @click="OnViewDetail(scope.row.feedbackId)"
          >查看详情</a
        >
      </div>
    </el-table-column>
  </el-table>
  <!-- 全部 pagination -->
  <Pagination
    :total="tableData.total"
    :page="tableData.current"
    :limit="tableData.size"
    @pagination="onChangePage"
    class="pagination_feedBack"
  />
</template>
<script setup lang="ts">
import { STATE_TYPE } from '@/enums/Feedback'
import { IFeedBack } from '@/types/feedback'
import { pageInfo } from '@/types/pageMessage'

// 子掉父
const emit = defineEmits<{
  (e: 'replyQuick', userId: number, feedbackId: number): void
  (e: 'viewDetail', feedbackId: number): void
  (e: 'changePage', pageMessage: pageInfo): void
}>()

const OnReplyQuick = (userId: number, feedbackId: number) => {
  emit('replyQuick', userId, feedbackId)
}

const OnViewDetail = (feedbackId: number) => {
  emit('viewDetail', feedbackId)
}
// 接受参数
const prop = defineProps<{
  tableData: IFeedBack
}>()

// 格式化反馈内容
const formatType = ({ type }: { type: number }) => {
  switch (type) {
    case 1:
      return '无法打开小程序'
    case 2:
      return '小程序闪退'
    case 3:
      return '页面加载慢'
    case 4:
      return '其他异常'
    case 5:
      return '产品开发建议'
    default:
      return '意见反馈'
  }
}

//格式化状态
const formatState = ({ state }: { state: number }) => {
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

// 点击页数改变
const onChangePage = (pageMessage: pageInfo) => {
  emit('changePage', pageMessage)
}
</script>
<style lang="scss" scoped>
.feedback-viewDetails {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .feedback-viewDetails-btn {
    text-decoration: underline;
  }
}
.btn {
  margin-right: 20px;
}
.pagination_feedBack {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
