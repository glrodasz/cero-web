// FIXME: Create a Tasks feature and move to helpers there
import { maxInProgressTasks } from '../../config'

export const reorderTasks = (
  tasks,
  startIndex,
  endIndex,
  taskStatus,
  newTask
) => {
  const clonedTasks = Array.from(tasks)

  if (endIndex !== null && startIndex !== null) {
    const [removed] = clonedTasks.splice(startIndex, 1)
    clonedTasks.splice(endIndex, 0, removed)
  } else if (startIndex === null) {
    clonedTasks.splice(endIndex, 0, newTask)
  }

  if (taskStatus) {
    return clonedTasks.map((task, index) => ({
      ...task,
      priority: index,
      status: taskStatus,
    }))
  }
  return clonedTasks.map((task, index) => ({
    ...task,
    priority: index,
  }))
}

export const getTaskType = (index) => {
  if (index > maxInProgressTasks - 1) {
    return null
  }

  return index === 0 ? 'active' : 'standby'
}
