import time from '../../utils/time'
import { getChronometerStartTime } from '../focusSession/helpers'
import { COMPLETED_COLUMN_ID } from '../tasks/constants'
import { TASK_SECTIONS } from './constants'

export const getTaskSections = (tasks = []) =>
  TASK_SECTIONS.map((section) => ({
    ...section,
    tasks: tasks.filter((task) => task.status === section.status),
  }))

// What the session amounted to. The time is what the chronometer shows: the
// active session's `startTime` already comes shifted past its finished pauses
// (`readActiveFocusSession`), and an open one stops the clock. A task counts
// when it was completed in this session: starting one stamps its tasks with
// its id, and finishing clears it only from the tasks still open.
export const getSessionRecap = ({ focusSession, tasks = [] }) => {
  if (!focusSession?.startTime) return { focusedTime: 0, completedTasks: 0 }

  const activePause = focusSession.pauses?.find(
    (pause) => pause.endTime === null
  )

  return {
    focusedTime: getChronometerStartTime({
      startTime: focusSession.startTime,
      pauseStartTime: activePause?.startTime,
    }),
    completedTasks: tasks.filter(
      (task) =>
        task.status === COMPLETED_COLUMN_ID &&
        String(task.focusSessionId) === String(focusSession.id)
    ).length,
  }
}

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
