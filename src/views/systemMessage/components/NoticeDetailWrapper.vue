<template>
  <div class="current-notice-wrapper">
    <template v-if="props.currentNoticeDetail">
      <div class="detail-title">{{ props.currentNoticeDetail.title }}</div>
      <div class="detail-info">
        <div class="current-notice-publisher">
          <el-icon class="user-icon"><UserFilled /></el-icon>
          <span>发布者:{{ props.currentNoticeDetail.adminName }}</span>
        </div>
        <div class="detail-info-date">{{ props.currentNoticeDetail.publishTime }}</div>
      </div>
      <div class="detail-content">
        <el-text type="info">
          {{ props.currentNoticeDetail.content }}
        </el-text>
      </div>
      <div class="current-notice-browse-num">
        <el-icon class="user-icon"><View /></el-icon>
        <span class="icon-gap">浏览:{{ props.currentNoticeDetail.browse }}</span>
      </div>
    </template>
    <template v-else>
      <p>暂无消息</p>
    </template>
  </div>
</template>
<script setup lang="ts">
import type { INoticeItem } from '@/types/notice'

const props = defineProps<{
  // 消息详情
  currentNoticeDetail: INoticeItem | undefined
}>()
</script>
<style lang="scss" scoped>
.current-notice-wrapper {
  width: 35%;
  background-color: #fff;
  padding: 30px 25px;
  gap: 10px;
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

.current-notice-publisher {
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

.user-icon {
  font-size: 1.5rem;
}

.icon-gap {
  padding-left: 5px;
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

.current-notice-browse-num {
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
</style>
