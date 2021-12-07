import { MAX_IN_PROGRESS_TASKS, MAXIMUM_BACKLOG_QUANTITY } from '../../config'
import {
  IN_PROGRESS_COLUMN_ID,
  PENDING_COLUMN_ID,
  COMPLETED_COLUMN_ID,
} from './constants'

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
  if (index > MAX_IN_PROGRESS_TASKS - 1) {
    return null
  }

  return index === 0 ? 'active' : 'standby'
}

export const getTitle = ({ column, isActive }) => {
  if (column.id === IN_PROGRESS_COLUMN_ID && !isActive) {
    return 'Tareas'
  }

  if (column.id === PENDING_COLUMN_ID && !isActive) {
    return ''
  }

  return column.title
}

export const getCurrent = ({ column, isActive, tasks }) => {
  if (column.id === PENDING_COLUMN_ID && !isActive) {
    return null
  }

  return tasks.length
}

export const getTotal = ({ column, isActive }) => {
  if (column.id === IN_PROGRESS_COLUMN_ID && !isActive) {
    return MAXIMUM_BACKLOG_QUANTITY
  }

  if (column.id === PENDING_COLUMN_ID && isActive) {
    return MAXIMUM_BACKLOG_QUANTITY
  }

  return null
}

export const normalizeData = (tasks) => {
  const normalizeTasks = tasks.reduce((prev, cur) => {
    prev[cur.id] = { ...cur }
    return prev
  }, {})

  const columns = {
    [IN_PROGRESS_COLUMN_ID]: {
      id: IN_PROGRESS_COLUMN_ID,
      title: 'En Progreso',
      taskIds: tasks
        .filter(({ status }) => status === IN_PROGRESS_COLUMN_ID)
        .sort((a, b) => a.priority - b.priority)
        .map((task) => task.id),
    },
    [PENDING_COLUMN_ID]: {
      id: PENDING_COLUMN_ID,
      title: 'Pendientes',
      taskIds: tasks
        .filter(({ status }) => status === PENDING_COLUMN_ID)
        .sort((a, b) => a.priority - b.priority)
        .map((task) => task.id),
    },
    [COMPLETED_COLUMN_ID]: {
      id: COMPLETED_COLUMN_ID,
      title: 'Completadas',
      taskIds: tasks
        .filter(({ status }) => status === COMPLETED_COLUMN_ID)
        .sort((a, b) => a.priority - b.priority)
        .map((task) => task.id),
    },
  }

  const columnOrder = [
    IN_PROGRESS_COLUMN_ID,
    PENDING_COLUMN_ID,
    COMPLETED_COLUMN_ID,
  ]

  return { tasks: normalizeTasks, columns, columnOrder }
}

// TODO: Improve this filter
export const filterColumns = ({ tasksLength, isActive }) => (column) => {
  if (isActive) {
    return true
  }

  if (!isActive && column === PENDING_COLUMN_ID && tasksLength >= 3) {
    return true
  }

  if (!isActive && column === IN_PROGRESS_COLUMN_ID) {
    return true
  }

  if (!isActive && column === COMPLETED_COLUMN_ID) {
    return false
  }
}
