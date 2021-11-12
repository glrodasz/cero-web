import { useState } from 'react'
import useDialog from '../../common/hooks/useDialog'

const useBreaktimeTimer = () => {
  const [time, setTime] = useState(null)

  return { ...useDialog(), time, setTime }
}

export default useBreaktimeTimer
