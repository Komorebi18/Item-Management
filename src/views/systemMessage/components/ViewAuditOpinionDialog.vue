<template>
  <el-dialog v-model="isOpenDialog" width="35%" title="审核意见" class="basis-box" center>
    <div class="basis">
      <div class="basis-comment-wrapper">
        <p>审核意见：</p>
        <p class="basis-comment">{{ auditOpinion }}</p>
      </div>

      <p>图片依据：</p>
      <div class="demo-image__preview">
        <el-image
          style="width: 100px; height: 100px"
          :src="imgUrlList[0]"
          :zoom-rate="1.2"
          :max-scale="7"
          :min-scale="0.2"
          :preview-src-list="imgUrlList"
          :initial-index="4"
          fit="cover"
        />
      </div>
    </div>
    <template #footer>
      <div class="footer">
        <el-button type="primary" @click="isOpenDialog = false"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue'

// 控制对话框的开关
const isOpenDialog = ref(false)

// 审核意见-文字依据
const auditOpinion = ref('')

// 审核意见-图片依据
const imgUrlList = ref<string[]>([])

// 打开对话框
const openDialog = (comment: string, imgList: string[]) => {
  auditOpinion.value = comment
  imgUrlList.value = imgList
  isOpenDialog.value = true
}

// 向父组件暴露打开对话框方法
defineExpose({ openDialog })
</script>
<style lang="scss" scoped>
.basis {
  margin: -20px 0 -20px;
  padding: 20px 40px 10px;
  border-top: 1px solid #e3e3e3;
  border-bottom: 1px solid #e3e3e3;
  font-size: 1rem;
}

.footer {
  padding-right: 15px;
  text-align: right;
}

:deep(.basis-box .footer .el-button--primary) {
  margin-left: 20px;
  color: #fff;
  background-color: #8a8ea8;
  border-color: #8a8ea8;
}

.basis p {
  margin-bottom: 8px;
}

.basis-comment-wrapper {
  margin: 0 0 20px;
}

.basis-comment {
  text-indent: 2em;
}
</style>
