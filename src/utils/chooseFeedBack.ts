export const chooseContent = (row: any, column: any, value: number) => {
  let curValue = value.toString()
  switch (curValue) {
    case '1':
      curValue = '无法打开小程序'

      break
    case '2':
      curValue = '小程序闪退'

      break
    case '3':
      curValue = '页面加载慢'

      break
    case '4':
      curValue = '其他异常'

      break
    case '5':
      curValue = '产品开发建议'

      break
    default:
      curValue = '意见反馈'
      break
  }
  return curValue
}
