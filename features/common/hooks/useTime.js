import { useState, useEffect } from 'react'
import { time } from '../constants'
import useInterval from './useInterval'

const tick = ({ currentTime, setCurrentTime, isTimer }) => () => {
  const modifier = isTimer ? time.ONE_SECOND_IN_MS * -1 : time.ONE_SECOND_IN_MS
  setCurrentTime(currentTime + modifier)
}

const useTime = (
  { isTimer = false, startTime = 0, endTime = null, callback = () => {} } = {
    startTime: 0,
  }
) => {
  const [currentTime, setCurrentTime] = useState(startTime)

  useEffect(() => {
    setCurrentTime(startTime)
  }, [startTime])

  useInterval(
    tick({ currentTime, setCurrentTime, isTimer }),
    time.ONE_SECOND_IN_MS
  )

  useEffect(() => {
    if ((isTimer && currentTime <= 0) || (endTime && currentTime >= endTime)) {
      callback()
    }
  }, [currentTime])

  return { currentTime }
}

export default useTime
