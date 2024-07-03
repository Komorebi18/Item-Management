<template>
  <el-dialog v-model="repulseState" width="30%" :title="props.dialogTitle" class="basis-box" center>
    <div class="basis">
      <p>打回依据:</p>
      <el-input
        v-model="textualBasis"
        type="textarea"
        :resize="'none'"
        :rows="4"
        class="basis-input"
      />
      <p>图片依据：</p>
      <el-upload
        v-model:file-list="fileList"
        action=""
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        ><el-icon><Plus /></el-icon
      ></el-upload>
    </div>
    <template #footer>
      <div class="footer">
        <el-button @click="repulseState = false">取消</el-button>
        <el-button type="primary" @click="handleRepulseNotice"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{
  // 对话框标题
  dialogTitle: string
}>()

const emit = defineEmits<{
  // 确认按钮点击事件
  confirm: []
}>()

// 控制对话框的开关
const repulseState = ref(false)

// 打回通知依据
const textualBasis = ref('')

// 确认打回
const handleRepulseNotice = () => {
  emit('confirm')
  repulseState.value = false
}

// 打开对话框
const openDialog = () => {
  repulseState.value = true
}

// 向父组件暴露打开对话框方法
defineExpose({ openDialog })
</script>
<style lang="scss" scoped>
.basis {
  margin: -20px 0 -20px;
  padding: 20px 0;
  border-top: 1px solid #e3e3e3;
  border-bottom: 1px solid #e3e3e3;
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

:deep(.basis-box .el-dialog__header) {
  margin-right: 0px;
  text-align: center;
  border-bottom: 1px solid #e3e3e3;
}

:deep(.basis-box .el-dialog__header) {
  margin-right: 0px;
  text-align: center;
  border-bottom: 1px solid #e3e3e3;
}

:deep(.basis-box .el-dialog__body) {
  padding: 30px 40px 10px;
  border-bottom: 1px solid #e3e3e3;
}

.basis-input {
  width: 92%;
  height: 100px;
  margin: 5px 0 10px;
}
</style>
