<template>
  <el-tab-pane label="全部" :name="TAB_TYPE.ALL"></el-tab-pane>
  <el-tab-pane label="编辑中" :name="TAB_TYPE.EDITING"></el-tab-pane>
  <el-tab-pane label="审核中" :name="TAB_TYPE.AUDITING"></el-tab-pane>
  <el-tab-pane label="已审核" :name="TAB_TYPE.AUDITED"></el-tab-pane>
  <el-row
    v-for="notice in props.noticeList"
    :key="notice.noticeId"
    :gutter="20"
    class="single-message"
  >
    <el-col :span="9">
      <div class="notice-title">
        <NoticeStateImg :noticeState="notice.state" />
        <h3>{{ notice.title }}</h3>
      </div>
      <el-text class="notice-content" truncated>
        {{ notice.content }}
      </el-text>
    </el-col>
    <el-col :span="5">
      <span class="publish-time">{{ notice.publishTime }}</span>
    </el-col>
    <el-col :span="3">
      <span class="deliver">{{ notice.adminName }}</span>
    </el-col>
    <el-col :span="3" class="notice-operation-container">
      <el-tooltip
        v-if="notice.state !== NOTICE_RELEASE_STATE.FAIL_THE_AUDIT"
        effect="dark"
        content="查看"
        placement="top"
      >
        <el-icon color="#2F3367" @click="emit('view', notice.noticeId)">
          <View />
        </el-icon>
      </el-tooltip>
      <el-tooltip
        v-if="notice.state === NOTICE_RELEASE_STATE.FAIL_THE_AUDIT"
        effect="dark"
        content="审核意见"
        placement="top"
      >
        <img
          src="../../../assets/imgs/audit-process.png"
          @click="emit('viewAuditOpinion', notice.comment, notice.imageUrls)"
        />
      </el-tooltip>
      <el-tooltip
        v-if="
          notice.state === NOTICE_RELEASE_STATE.UNPUBLISHED ||
          notice.state === NOTICE_RELEASE_STATE.FAIL_THE_AUDIT
        "
        effect="dark"
        content="编辑"
        placement="top"
      >
        <el-icon color="#2F3367" @click="emit('edit', notice.noticeId)">
          <EditPen />
        </el-icon>
      </el-tooltip>
      <el-tooltip
        v-else-if="notice.state === NOTICE_RELEASE_STATE.PASS_THE_AUDIT"
        effect="dark"
        content="发布"
        placement="top"
      >
        <el-icon color="#2F3367" @click="emit('publish', notice.noticeId)">
          <Promotion />
        </el-icon>
      </el-tooltip>
      <el-tooltip
        v-if="
          notice.state === NOTICE_RELEASE_STATE.UNPUBLISHED ||
          notice.state === NOTICE_RELEASE_STATE.FAIL_THE_AUDIT
        "
        effect="dark"
        content="删除"
        placement="top"
      >
        <el-icon color="#2F3367" @click="emit('delete', notice.noticeId)">
          <Delete />
        </el-icon>
      </el-tooltip>
      <!-- 占位盒子 -->
      <el-icon v-else></el-icon>
    </el-col>
  </el-row>
  <el-row v-if="props.noticeList.length === 0">暂无通知</el-row>
</template>
<script setup lang="ts">
import { Delete, Promotion, View, EditPen } from '@element-plus/icons-vue'
import type { INoticeItem } from '@/types/notice'
import { NOTICE_RELEASE_STATE } from '@/constants/notice'
import NoticeStateImg from './NoticeStateImg.vue'

const props = defineProps<{
  // 待展示的数据列表
  noticeList: INoticeItem[]
}>()

const emit = defineEmits<{
  // 查看通知
  view: [noticeId: number]
  // 编辑通知
  edit: [noticeId: number]
  // 删除通知
  delete: [noticeId: number]
  // 查看审核意见
  viewAuditOpinion: [comment: string, imgList: string[]]
  // 正式发布通知
  publish: [noticeId: number]
}>()

// 通知发布进度常量
enum TAB_TYPE {
  /**全部 */
  ALL,
  /**编辑中*/
  EDITING,
  /**审核中 */
  AUDITING,
  /**已审核 */
  AUDITED
}
</script>
<style lang="scss" scoped>
.single-message {
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 8px 20px 8px 8px;
}

.notice-title {
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

.notice-content {
  width: 400px;
  color: #8a8ea8;
  margin-left: 2em;
}

.publish-time {
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

.notice-operation-container {
  display: flex;
  justify-content: space-between;
}

.notice-operation-container img {
  width: 16px;
  height: 16px;
}
</style>
