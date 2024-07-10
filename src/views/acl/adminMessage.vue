<template>
  <div>
    <!--必填：
    action：指定上传地址
    file-list：必备数组管理图片
    样式：list-type 影响渲染样式，指定 pictur-card 照片墙
    钩子：on-preview 图片被点击时触发函数，绑定会出现放大镜，需要自己显示弹窗
          on-remove 删除图片时触发的功能
          on-change 修改图片触发的函数-->
    <el-upload
      action="#"
      list-type="picture-card"
      :file-list="fileList"
      :on-preview="onPreview"
      :on-remove="onRemove"
      :on-change="onChange"
      :http-request="httpRequest"
      :before-upload="beforeUpload"
      :class="{ hasImg: fileList.length > 0 }"
    >
      <i class="el-icon-plus" />
    </el-upload>

    <el-progress
      v-if="isShowPercent"
      :text-inside="true"
      :stroke-width="16"
      :percentage="percent"
      style="width: 146px"
    />

    <el-dialog title="预览" :visible="isShowDialog" @close="isShowDialog = false">
      <el-row type="flex" justify="center">
        <img :src="previewImg" alt="" />
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
// 引入对象储存工具库，创建实例
import COS from 'cos-js-sdk-v5'
// 前端使用固定密钥计算签名，该格式适用于前端调试
const cos = new COS({
  SecretId: '1310045286',
  SecretKey: 'AKIDMtiYLLLKdvAQwZ8kzNsVobenm0EROJBy'
})
export default {
  name: 'Dashboard',

  data() {
    return {
      isShowPercent: false,
      percent: 0,
      isShowDialog: false,
      previewImg: '',
      // 文件列表每个对象都是一张图片，url：显示图片路径，udi：唯一标识，status：状态
      fileList: []
    }
  },
  methods: {
    // 点击文件列表中已上传的文件时的钩子，放大镜
    onPreview(file) {
      this.previewImg = file.url // 显示图片
      this.isShowDialog = true // 弹窗
    },
    // 移除文件时的钩子
    onRemove(file, newFileList) {
      this.fileList = newFileList
    },
    // 添加，上传成功/失败 都会触发
    onChange(file, newFileList) {
      // 由于 fileList 的绑的是单向的，需要手动替换
      this.fileList = newFileList
    },

    // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    beforeUpload(file) {
      console.log('上传前触发')
      console.log(file)

      // 校验格式
      const typeList = ['image/jpeg', 'image/png', 'image/gif']
      if (!typeList.includes(file.type)) {
        this.$message.error('目前只支持 jpg/png/gif 图片格式')
        return false
      }

      // 校验大小
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('图片大小不能超过 5M')
        return false
      }
    },

    // 覆盖默认的上传行为，可以自定义上传的路径
    httpRequest(params) {
      // 开始上传时显示进度条
      this.isShowPercent = true
      cos.putObject(
        {
          Bucket: 'chao-13' /* 填入您自己的存储桶，必须字段 */,
          Region: 'ap-nanjing' /* 存储桶所在地域，例如ap-beijing，必须字段 */,
          Key: params.file.name /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */,
          StorageClass: 'STANDARD',
          Body: params.file, // 上传文件对象
          onProgress: (progressData) => {
            console.log(JSON.stringify(progressData))
            this.percent = progressData.percent * 100
          }
        },
        (err, data) => {
          console.log('腾讯工具库上传完毕')
          // 延迟提升用户体验-消失进度条
          setTimeout(() => {
            this.isShowPercent = false
          }, 1000)

          console.log(err || data)
          if (!err) {
            // 手动处理 fileList
            this.fileList[0].url = 'http://' + data.Location
            this.fileList[0].status = 'success'
          }
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.hasImg {
  ::v-deep .el-upload--picture-card {
    display: none;
  }
}
::v-deep img {
  // 让图片在相等大小中，保持完整显示
  object-fit: cover;
}
</style>
