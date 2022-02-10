import { useState, useEffect, useRef } from 'react'

const useInterval = (callback, delay) => {
  const [intervalId, setIntervalId] = useState(null)
  const savedCallback = useRef()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const tick = () => savedCallback.current()

    if (delay !== null) {
      setIntervalId(setInterval(tick, delay))
      return () => clearInterval(intervalId)
    } else {
      clearInterval(intervalId)
    }
  }, [delay])
}

export default useInterval
