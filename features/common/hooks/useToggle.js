import { useState } from 'react'

const useToggle = (initialState = false) => {
  const [isOn, setIsOn] = useState(initialState)

  const toggle = () => setIsOn((prevState) => !prevState)

  return { isOn, toggle }
}

export default useToggle
