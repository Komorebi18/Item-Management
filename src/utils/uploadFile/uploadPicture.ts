import cos from './cos'

const getFormatFromName = (filename: string) => {
  const parts = filename.split('.')
  if (parts.length > 1) {
    return parts.pop()!.toLowerCase() // 弹出拓展名，并转换为小写
  }
  return null // 如果没有扩展名，返回null
}

const uploadPicture = (file: File, address: string) => {
  // 获取当前的年月日
  const currentDate = new Date()
  const year = currentDate.getFullYear()
  const month = (currentDate.getMonth() + 1).toString() // 月份从 0 开始，所以要加 1
  const day = currentDate.getDate().toString().padStart(2, '0')
  // 当前时间戳
  const currentTimestamp = new Date().getTime()
  // 获取文件后缀
  const extension = getFormatFromName(file.name)

  cos.uploadFile({
    Bucket: 'smart-management-1310045286' /* 填写自己的 bucket，必须字段 */,
    Region: 'ap-guangzhou' /* 存储桶所在地域，必须字段 */,
    Key: `${address}/${year}/${month}/${day}/${currentTimestamp}.${extension}`, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */,
    Body: file, // 上传文件对象
    SliceSize:
      1024 *
      1024 *
      5 /* 触发分块上传的阈值，超过5MB 使用分块上传，小于5MB使用简单上传。可自行设置，非必须 */
  })
}
