import time from '../../utils/time'
import { FOCUS_SESSION_SCORES } from './constants'

export const getBarWidth = (
  currentTime,
  filledBarTime = time.ONE_HOUR_IN_MS
) => {
  const timeRatio = currentTime % filledBarTime
  return (timeRatio * 100) / filledBarTime
}

export const getChronometerStartTime = ({ startTime, pauseStartTime }) => {
  const nowTime = Date.now()

  if (startTime && pauseStartTime) {
    return nowTime - (startTime + nowTime - pauseStartTime)
  }

  if (startTime) {
    return nowTime - startTime
  }

  return 0
}

// The time actually worked: from the start to `now`, less every pause. A pause
// still open (no `endTime`) runs up to `now`.
export const getFocusedTime = (
  { startTime, pauses = [] } = {},
  now = Date.now()
) => {
  if (typeof startTime !== 'number') return 0

  const pausedTime = pauses.reduce(
    (total, pause) => total + ((pause.endTime ?? now) - pause.startTime),
    0
  )

  return Math.max(0, now - startTime - pausedTime)
}

// The retrospective's feedback arrives over HTTP, so only the known fields are
// kept: whatever else the body carries never reaches the stored session.
// Answers `{ feedback }` (`null` when none was sent) or `{ error }`.
export const parseFeedback = (feedback) => {
  if (feedback === undefined || feedback === null) return { feedback: null }

  if (!FOCUS_SESSION_SCORES.includes(feedback.score)) {
    return {
      error: `The score must be one of ${FOCUS_SESSION_SCORES.join(', ')}`,
    }
  }

  const blockers =
    typeof feedback.blockers === 'string' ? feedback.blockers.trim() : ''

  return { feedback: { score: feedback.score, blockers } }
}
