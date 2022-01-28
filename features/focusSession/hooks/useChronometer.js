import { useCallback, useEffect, useMemo } from 'react'
import { getChronometerStartTime } from '../helpers'
import useTime from '../../common/hooks/useTime'

const useChrommeter = ({ startTime, pauseStartTime, isPaused }) => {
  const totalStartTime = useCallback(
    () =>
      getChronometerStartTime({
        startTime,
        pauseStartTime,
      }),
    [startTime, pauseStartTime]
  )

  useEffect(() => {
    console.log('>>>totalStartTime', totalStartTime)
  }, [totalStartTime])

  const now = Date.now()
  useEffect(() => {
    console.log('>>>render', now)
  }, [now])

  const { currentTime, clearTime, resumeTime } = useTime({
    startTime: totalStartTime,
  })

  useEffect(() => {
    if (isPaused) {
      clearTime()
    }
  }, [isPaused])

  return { currentTime, clearTime, resumeTime }
}

export default useChrommeter
