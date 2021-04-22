import { useState } from 'react'

const useDeleteConfirmation = () => {
  const [showDialog, setShowDialog] = useState(false)
  const [taskId, setTaskId] = useState(null)

  return { taskId, setTaskId, showDialog, setShowDialog }
}

export default useDeleteConfirmation
