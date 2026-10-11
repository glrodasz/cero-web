import time from '../../utils/time'
import { getFocusedTime } from '../focusSession/helpers'
import { COMPLETED_COLUMN_ID } from '../tasks/constants'
import { TASK_SECTIONS } from './constants'

export const getTaskSections = (tasks = []) =>
  TASK_SECTIONS.map((section) => ({
    ...section,
    tasks: tasks.filter((task) => task.status === section.status),
  }))

// What the session amounted to. A task counts when it was completed after the
// session started; tasks completed before `completedAt` existed have none and
// don't count.
export const getSessionRecap = ({
  focusSession,
  tasks = [],
  now = Date.now(),
}) => ({
  focusedTime: getFocusedTime(focusSession, now),
  completedTasks: tasks.filter(
    (task) =>
      task.status === COMPLETED_COLUMN_ID &&
      task.completedAt >= focusSession?.startTime
  ).length,
})

export const formatFocusedTime = (milliseconds) => {
  const minutes = Math.floor(milliseconds / time.ONE_MINUTE_IN_MS)

  if (minutes < 1) return 'menos de 1 min'

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (!hours) return `${minutes} min`

  return remainingMinutes ? `${hours} h ${remainingMinutes} min` : `${hours} h`
}

export const formatCompletedTasks = (count) =>
  count === 1 ? '1 tarea' : `${count} tareas`
