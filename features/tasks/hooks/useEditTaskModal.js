import useDialogWithState from '../../common/hooks/useDialogWithState'

const useEditTaskModal = () => {
  const { value: taskId, setValue: setTaskId, ...dialog } = useDialogWithState()

  return { ...dialog, taskId, setTaskId }
}

export default useEditTaskModal
