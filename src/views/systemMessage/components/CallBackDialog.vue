<template>
  <el-dialog v-model="repulseState" width="30%" :title="props.dialogTitle" class="basis-box" center>
    <div class="basis">
      <p>{{ props.commentTitle }}:</p>
      <el-input v-model="comment" type="textarea" :resize="'none'" :rows="4" class="basis-input" />
      <p>图片依据：</p>
      <el-upload
        v-model:file-list="fileList"
        action="#"
        list-type="picture-card"
        :http-request="httpRequest"
        :on-preview="handlePictureCardPreview"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
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
import { ref, toRaw } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { uploadPicture } from '@/utils/uploadFile/uploadPicture'
const props = defineProps<{
  // 对话框标题
  dialogTitle: string
  // 文字输入框标题
  commentTitle: string
}>()

const emit = defineEmits<{
  // 确认按钮点击事件
  confirm: [callbackBasis: string, imgUrlList: string[]]
}>()

// 控制对话框的开关
const repulseState = ref(false)

// 打回通知依据
const comment = ref('')

// 收集待上传的图片
const fileList = ref<UploadUserFile[]>([])
// 预览图片地址
const dialogImageUrl = ref('')
// 控制预览图片对话框的开关
const dialogVisible = ref(false)
// 上传完成后的图片地址
const imgUrlList = ref<string[]>([])

// 确认打回
const handleRepulseNotice = async () => {
  imgUrlList.value = []
  // 上传图片到腾讯云
  for (const rawFile of fileList.value) {
    const file = toRaw(rawFile)
    // 文件非空，继续执行
    if (file.raw) {
      // 图片上传腾讯云，返回图片地址
      const imgUrl = await uploadPicture(file.raw, 'systemMessage/callback')
      imgUrlList.value.push(imgUrl)
    }
  }

  // 通知父组件
  emit('confirm', comment.value, imgUrlList.value)
  // 关闭对话框
  repulseState.value = false
  // 清空数据
  comment.value = ''
  fileList.value = []
}

// 打开对话框
const openDialog = () => {
  repulseState.value = true
}

// 覆盖默认的上传行为
const httpRequest = async () => {
  // 啥也不做，文件上传腾讯云放到确认后
}

// 预览图片
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
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

.basis-input {
  width: 92%;
  height: 100px;
  margin: 5px 0 10px;
}
</style>
