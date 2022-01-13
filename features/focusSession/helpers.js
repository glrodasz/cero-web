import { time } from '../common/constants'

export const getBarWidth = (
  currentTime,
  filledBarTime = time.ONE_HOUR_IN_MS
) => {
  const timeRatio = currentTime % filledBarTime
  return (timeRatio * 100) / filledBarTime
}
