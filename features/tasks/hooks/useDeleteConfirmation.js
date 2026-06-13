import useDialogWithState from '../../common/hooks/useDialogWithState'

const useDeleteConfirmation = () => {
  const { value: taskId, setValue: setTaskId, ...dialog } = useDialogWithState()

  return { ...dialog, taskId, setTaskId }
}

export default useDeleteConfirmation
