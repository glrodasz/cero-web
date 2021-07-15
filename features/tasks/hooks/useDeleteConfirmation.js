import { useState } from 'react'
import useDialog from '../../common/hooks/useDialog'

const useDeleteConfirmation = () => {
  const [taskId, setTaskId] = useState(null)

  return { ...useDialog(), taskId, setTaskId }
}

export default useDeleteConfirmation
