import { reorderTasks } from './helpers'

export const handleDragEnd = ({ tasksData, tasksSetLocalData, tasksApi }) => (
  result
) => {
  if (result.destination) {
    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index

    const orderedTasks = reorderTasks(tasksData, sourceIndex, destinationIndex)

    tasksSetLocalData(orderedTasks)
    tasksApi.updatePriorities({ tasks: orderedTasks })
  }
}

export const handleAddTask = ({ tasks, tasksApi }) => (value) => {
  tasksApi.create({
    description: value,
    priority: tasks.length,
  })
}

export const handleDeleteTask = ({ setTaskId, setShowDialog }) => ({ id }) => {
  setShowDialog(true)
  setTaskId(id)
}

export const handleClickCancelRemove = ({ setTaskId, setShowDialog }) => () => {
  setShowDialog(false)
  setTaskId(null)
}

export const handleClickConfirmRemove = ({
  tasksApi,
  taskId,
  setShowDialog,
}) => () => {
  tasksApi.remove({ id: taskId })
  setShowDialog(false)
}

export const handleClickStartSession = ({ focusSessionsApi }) => () => {
  focusSessionsApi.create()
}
