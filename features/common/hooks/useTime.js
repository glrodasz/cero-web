import { useState, useEffect, useCallback } from 'react'
import time from '../../../utils/time'
import useInterval from './useInterval'

const tick =
  ({ currentTime, setCurrentTime, isTimer }) =>
  () => {
    const modifier = isTimer
      ? time.ONE_SECOND_IN_MS * -1
      : time.ONE_SECOND_IN_MS
    setCurrentTime(currentTime + modifier)
  }

const useTime = (
  { isTimer = false, startTime = 0, endTime = null, callback = () => {} } = {
    startTime: 0,
  }
) => {
  const [currentTime, setCurrentTime] = useState(startTime)
  const [delay, setDelay] = useState(time.ONE_SECOND_IN_MS)

  useInterval(tick({ currentTime, setCurrentTime, isTimer }), delay)

  const clearTime = useCallback(() => setDelay(null))
  const resumeTime = useCallback(() => setDelay(time.ONE_SECOND_IN_MS))

  useEffect(() => {
    if ((isTimer && currentTime <= 0) || (endTime && currentTime >= endTime)) {
      callback()
    }
  }, [currentTime])

  useEffect(() => {
    setCurrentTime(startTime)
  }, [startTime])

  return { currentTime, clearTime, resumeTime }
}

export default useTime
