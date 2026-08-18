import { useState } from 'react'
import useDialog from './useDialog'

const useDialogWithState = (initialValue = null) => {
  const [value, setValue] = useState(initialValue)

  return { ...useDialog(), value, setValue }
}

export default useDialogWithState
