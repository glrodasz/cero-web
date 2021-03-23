import { PRIOTIY_TASKS_QUANTITY } from './constants'

export const reorderTasks = (tasks, startIndex, endIndex) => {
  const clonedTasks = Array.from(tasks)
  const [removed] = clonedTasks.splice(startIndex, 1)
  clonedTasks.splice(endIndex, 0, removed)

  return clonedTasks.map((task, index) => ({ ...task, priority: index }))
}

export const getTaskType = (index) => {
  if (index > PRIOTIY_TASKS_QUANTITY - 1) {
    return null
  }

  return index === 0 ? 'active' : 'standby'
}
