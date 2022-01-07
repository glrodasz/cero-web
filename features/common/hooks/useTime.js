import { useState, useEffect } from 'react'
import { time } from '../constants'

const tick = ({ currentTime, setCurrentTime, isReverse }) => () => {
  const modifier = isReverse
    ? time.ONE_SECOND_IN_MS * -1
    : time.ONE_SECOND_IN_MS

  setCurrentTime(currentTime + modifier)
}

const useTime = (
  { isReverse = false, startTime = 0, endTime = null, callback = () => {} } = {
    startTime: 0,
  }
) => {
  const [currentTime, setCurrentTime] = useState(startTime)

  useEffect(() => {
    if (
      (isReverse && currentTime <= 0) ||
      (endTime && currentTime >= endTime)
    ) {
      callback()
    }

    const intervalId = setInterval(
      tick({ currentTime, setCurrentTime, isReverse }),
      time.ONE_SECOND_IN_MS
    )

    return () => clearInterval(intervalId)
  }, [currentTime])

  return { currentTime }
}

export default useTime
