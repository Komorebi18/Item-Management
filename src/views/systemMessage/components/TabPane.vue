<template>
  <el-tab-pane :label="props.tabName" :name="NOTICE_RELEASE_STATE.ALL">
    <div v-for="notice in props.noticeList" :key="notice.noticeId">
      <el-row :gutter="20" class="single-message">
        <el-col :span="9">
          <div class="notice-title">
            <img
              v-if="notice.state === NOTICE_RELEASE_STATE.UNPUBLISHED"
              src="../../../assets/icons/editing.svg"
              class="notice-type-icon"
            />
            <img
              v-if="notice.state === NOTICE_RELEASE_STATE.WAIT_FOR_AUDIT"
              src="../../../assets/icons/under-review.svg"
              class="notice-type-icon"
            />
            <img
              v-if="notice.state === NOTICE_RELEASE_STATE.PASS_THE_AUDIT"
              src="../../../assets/icons/info-success.svg"
              class="notice-type-icon"
            />
            <img
              v-if="notice.state === NOTICE_RELEASE_STATE.FAIL_THE_AUDIT"
              src="../../../assets/imgs/fail-the-audit.png"
              class="notice-type-icon"
            />
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
          <el-tooltip effect="dark" content="查看" placement="top">
            <el-icon color="#2F3367" @click="emit('view', notice.noticeId)">
              <View />
            </el-icon>
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
            v-else-if="notice.state === NOTICE_RELEASE_STATE.WAIT_FOR_AUDIT"
            effect="dark"
            content="审核进程"
            placement="top"
          >
            <img
              src="../../../assets/imgs/audit-process.png"
              @click="emit('process', notice.noticeId)"
            />
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
    </div>
  </el-tab-pane>
</template>
<script setup lang="ts">
import { Delete, Promotion, View, EditPen } from '@element-plus/icons-vue'
import type { INoticeItem } from '@/types/notice'
import { NOTICE_RELEASE_STATE } from '@/constants/notice'

const props = defineProps<{
  // 待展示的数据列表
  noticeList: INoticeItem[]
  // tab名称
  tabName: string
}>()

const emit = defineEmits<{
  // 查看通知
  view: [noticeId: number]
  // 编辑通知
  edit: [noticeId: number]
  // 删除通知
  delete: [noticeId: number]
  // 查看通知进度
  process: [noticeId: number]
  // 正式发布通知
  publish: [noticeId: number]
}>()
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

.notice-type-icon {
  width: 1em;
  height: 1em;
  margin: 5px;
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
