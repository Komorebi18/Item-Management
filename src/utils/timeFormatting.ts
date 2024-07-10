import dayjs from 'dayjs'
export const timeFormatting = (startTime: string, endTime: string) => {
  const newStartTime = dayjs(startTime).format('YYYY-MM-DD HH:mm:ss')
  const newEndTime = dayjs(endTime).format('YYYY-MM-DD HH:mm:ss')
  return {
    newStartTime,
    newEndTime
  }
}
