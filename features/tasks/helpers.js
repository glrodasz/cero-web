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

export const getSortedTaskIdsFilteredByStatus = (filteredStatus) => (tasks) => {
  return tasks
    .filter(({ status }) => status === filteredStatus)
    .sort((a, b) => a.priority - b.priority)
    .map((task) => task.id)
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
      taskIds: getSortedTaskIdsFilteredByStatus(IN_PROGRESS_COLUMN_ID)(tasks),
    },
    [PENDING_COLUMN_ID]: {
      id: PENDING_COLUMN_ID,
      title: 'Pendientes',
      taskIds: getSortedTaskIdsFilteredByStatus(PENDING_COLUMN_ID)(tasks),
    },
    [COMPLETED_COLUMN_ID]: {
      id: COMPLETED_COLUMN_ID,
      title: 'Completadas',
      taskIds: getSortedTaskIdsFilteredByStatus(COMPLETED_COLUMN_ID)(tasks),
    },
  }

  const columnOrder = [
    IN_PROGRESS_COLUMN_ID,
    PENDING_COLUMN_ID,
    COMPLETED_COLUMN_ID,
  ]

  return { tasks: normalizeTasks, columns, columnOrder }
}

export const filterColumns = ({ tasksLength, isActive }) => (column) => {
  const AreWeInFocusSession = isActive
  const AreWeInPlanning = !isActive
  const DoWeHaveBacklogTasks = tasksLength >= MAX_IN_PROGRESS_TASKS

  if (AreWeInFocusSession) {
    return true
  }

  if (AreWeInPlanning && column === IN_PROGRESS_COLUMN_ID) {
    return true
  }

  if (AreWeInPlanning && DoWeHaveBacklogTasks && column === PENDING_COLUMN_ID) {
    return true
  }

  if (AreWeInPlanning && column === COMPLETED_COLUMN_ID) {
    return false
  }
}
