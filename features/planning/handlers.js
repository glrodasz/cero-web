import { reorderTasks } from './helpers'

export const handleDragEndTask = ({ tasks }) => ({ source, destination }) => {
  if (destination) {
    const { data, api, setLocalData } = tasks
    const orderedTasks = reorderTasks(data, source.index, destination.index)

    setLocalData(orderedTasks)
    api.updatePriorities({ tasks: orderedTasks })
  }
}

export const handleClickAddTask = ({ tasks }) => (value) => {
  const { api, data } = tasks
  api.create({ description: value, priority: data.length })
}

export const handleClickDeleteTask = ({ deleteConfirmation }) => ({ id }) => {
  const { setTaskId, setShowDialog } = deleteConfirmation
  setTaskId(id)
  setShowDialog(true)
}

export const handleClickCancelRemove = ({ deleteConfirmation }) => () => {
  const { setTaskId, setShowDialog } = deleteConfirmation
  setTaskId(null)
  setShowDialog(false)
}

export const handleClickConfirmRemove = ({
  tasks,
  deleteConfirmation,
}) => () => {
  const { taskId, setShowDialog } = deleteConfirmation
  tasks.api.remove({ id: taskId })
  setShowDialog(false)
}

export const handleClickStartSession = ({ focusSessions }) => () => {
  focusSessions.api.create()
}
