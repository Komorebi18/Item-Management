import dayjs from 'dayjs'
export const formatterTime = (value: any) => {
  return dayjs(value.regTime).format('YYYY.MM.DD')
}

// 判断是否为特殊用户
export const judgeState = (value: any) => {
  return value.state === 0 ? '否' : '历史黑名单用户'
}

export const formatterTimeToDetail = (value: any) => {
  return dayjs(value.loginTime).format('YYYY-MM-DD HH:mm:ss')
}
