<template>
  <!-- 查看日志对话框 -->
  <el-dialog v-model="isOpenLogDialog" width="800">
    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="false" class="infinite-list">
      <el-table :data="logMessageDetail" style="width: 100%">
        <el-table-column prop="ip" label="登录ip" width="180" align="center" />
        <el-table-column prop="logTime" label="操作时间" align="center">
          <template #header>
            操作时间
            <el-icon @click="onIconShowPicker"><ArrowDown /></el-icon>
            <div class="date-picker">
              <el-date-picker
                v-model="dataValue"
                size="small"
                @change="getDateValue"
                type="datetimerange"
                ref="timePickRef"
                style="visibility: hidden"
              >
              </el-date-picker>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="操作" align="center" />
      </el-table>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { timeFormatting } from '@/utils/timeFormatting'
import { userMessageStore } from '@/store'
import { storeToRefs } from 'pinia'
import { throttle } from 'lodash'
// 接受参数
const props = defineProps<{
  logUserId: number | undefined
  isRefresh: boolean
}>()

// 获取用户信息
const Store = userMessageStore()
const { logMessageDetail, logMessage } = storeToRefs(Store)
const { getUserLogById, bottomRefresh } = Store

// log对话框状态
const isOpenLogDialog = ref(false)

// 日期选择器实例
const timePickRef = ref()
const dataValue = ref()
// 图标点击
const onIconShowPicker = () => {
  if (timePickRef.value) {
    timePickRef.value.handleOpen() // 直接显示日期选择面板
  }
}

// 打开弹窗
const openDialog = () => {
  isOpenLogDialog.value = true
}

// 触底加载更多
const loadMore = throttle(() => {
  if (props.isRefresh && logMessage.value.current < logMessage.value.pages) {
    bottomRefresh(props.logUserId!)
  } else {
    return
  }
}, 2000)

// 获取用户选择日期
const getDateValue = (time: string) => {
  // 格式化日期
  const { newStartTime, newEndTime } = timeFormatting(time[0], time[1])
  getUserLogById(props.logUserId!, {
    beginTime: newStartTime,
    endTime: newEndTime,
    offset: 0,
    limit: 50
  })
}
// 向父组件暴露打开对话框方法
defineExpose({
  openDialog
})
</script>
<style lang="scss" scoped>
.infinite-list {
  height: 400px;
  overflow: auto;
}
</style>
