import {
  COMPLETED_COLUMN_ID,
  IN_PROGRESS_COLUMN_ID,
  PENDING_COLUMN_ID,
} from '../tasks/constants'

export const TASK_SECTIONS = [
  { status: IN_PROGRESS_COLUMN_ID, title: 'En progreso' },
  { status: PENDING_COLUMN_ID, title: 'Pendientes' },
  { status: COMPLETED_COLUMN_ID, title: 'Completadas' },
]

// Keyed by the scores in `FOCUS_SESSION_SCORES`, worded like `Score`'s faces.
export const SCORE_LABELS = {
  0: 'Frustrado',
  2.5: 'Normal',
  5: 'Muy motivado',
}
