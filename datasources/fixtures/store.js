import { clone } from '../collections'
import focusSessions from './focusSessions'
import tasks from './tasks'

const DEFAULT_SESSION_ID = 'default'

const seed = () => clone({ tasks, 'focus-sessions': focusSessions })

// Deliberately per process and not shared anywhere: an integration run should
// start from the same state every time, and end when the process does. That is
// the opposite of what the demo store wants, which is why this is a separate
// data source rather than a flag on that one.
let sessions = new Map()

export const getCollections = async (sessionId = DEFAULT_SESSION_ID) => {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, seed())
  }

  return sessions.get(sessionId)
}

export const saveCollections = async (
  sessionId = DEFAULT_SESSION_ID,
  collections
) => {
  sessions.set(sessionId, collections)
}

// For tests that need to prove one case does not leak into the next.
export const resetCollections = () => {
  sessions = new Map()
}
