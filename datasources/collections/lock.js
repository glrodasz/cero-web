// A mutation is a read-modify-write of the whole session document, so two
// mutations for the same session running concurrently can lose one of them:
// both read the same snapshot, and whichever writes last wins, silently
// discarding the other's change. This is exactly what several handlers do —
// e.g. finishing a focus session fires one `PATCH` per task in parallel
// (`Promise.all`) to clear `focusSessionId`. Queuing mutations per session
// serializes them so each one reads the result of the previous one instead.
//
// Known limit: this queue lives in one process. On a serverless host each
// function instance has its own, so two writes for the same session that land
// on different instances can still lose one. Accepted for a per-visitor demo
// store, where the next write corrects it; a store that had to be correct
// under real concurrency would need a lock in the backing store itself, or a
// key per record rather than one document per session.
const sessionLocks = new Map()

const withSessionLock = (sessionId, task) => {
  const previous = sessionLocks.get(sessionId) ?? Promise.resolve()
  // Chain onto the previous mutation regardless of whether it succeeded —
  // one failed mutation must not permanently block the ones queued after it.
  const run = previous.catch(() => {}).then(task)

  const settled = run
    .catch(() => {})
    .then(() => {
      // Only clear the entry if nothing queued behind us in the meantime.
      if (sessionLocks.get(sessionId) === settled) {
        sessionLocks.delete(sessionId)
      }
    })

  sessionLocks.set(sessionId, settled)

  return run
}

export default withSessionLock
