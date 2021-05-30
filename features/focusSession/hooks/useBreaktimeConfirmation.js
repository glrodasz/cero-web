import { useState } from 'react'

const useBreaktimeConfirmation = () => {
  const [showDialog, setShowDialog] = useState(false)

  return { showDialog, setShowDialog }
}

export default useBreaktimeConfirmation
