import { useState } from 'react'

const useDialog = () => {
  const [showDialog, setShowDialog] = useState(false)

  return { showDialog, setShowDialog }
}

export default useDialog
