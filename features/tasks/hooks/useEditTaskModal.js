import { useState } from 'react'
import useDialog from '../../common/hooks/useDialog'

const useEditTaskModal = () => {
  const [taskId, setTaskId] = useState(null)

  return { ...useDialog(), taskId, setTaskId }
}

export default useEditTaskModal
