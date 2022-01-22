import time from '../../utils/time'

export const getBarWidth = (
  currentTime,
  filledBarTime = time.ONE_HOUR_IN_MS
) => {
  const timeRatio = currentTime % filledBarTime
  return (timeRatio * 100) / filledBarTime
}

export const getChronometerStartTime = ({ focusSessionTimestamp }) => {
  return focusSessionTimestamp ? Date.now() - focusSessionTimestamp : 0
}
