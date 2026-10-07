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
