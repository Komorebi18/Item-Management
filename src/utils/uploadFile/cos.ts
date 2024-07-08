import COS from 'cos-js-sdk-v5'
import { getTemporaryToken } from '@/api/picture/index'

// 配置COS
const cos = new COS({
  // getAuthorization 必选参数
  getAuthorization: async function (options, callback) {
    const { data } = await getTemporaryToken()
    // 检查credentials格式
    console.log(data.credentials)
    callback({
      TmpSecretId: data.credentials.tmpSecretId,
      TmpSecretKey: data.credentials.tmpSecretKey,
      SecurityToken: data.credentials.sessionToken,
      // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
      StartTime: data.startTime, // 时间戳，单位秒
      ExpiredTime: data.expiredTime // 时间戳，单位秒
    })
  }
})

export default cos
