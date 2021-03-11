import { reorderTasks } from './helpers'

export const handleDragEnd = ({ tasks, setTasks, tasksCrud }) => (result) => {
  if (result.destination) {
    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index

    const orderedTasks = reorderTasks(tasks, sourceIndex, destinationIndex)

    // TODO: Check if these two staments could be move as a callback
    setTasks(orderedTasks)
    tasksCrud.updatePriorities({ tasks: orderedTasks })
  }
}

export const handleDeleteTask = ({
  setCurrentTaskId,
  setShowDeleteConfirmation,
}) => ({ id }) => {
  setShowDeleteConfirmation(true)
  setCurrentTaskId(id)
}
