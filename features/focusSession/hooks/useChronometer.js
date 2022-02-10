import { useCallback, useEffect } from 'react'
import { getChronometerStartTime } from '../helpers'
import useTime from '../../common/hooks/useTime'

const useChronometer = ({ startTime, pauseStartTime, isPaused }) => {
  const totalStartTime = useCallback(
    () =>
      getChronometerStartTime({
        startTime,
        pauseStartTime,
      }),
    [startTime, pauseStartTime]
  )

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

export default useChronometer
