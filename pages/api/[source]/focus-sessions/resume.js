import buildApiUrl from '../../../../datasources/buildApiUrl'
import fetchResource from '../../../../datasources'
import { getActiveFocusSession } from '../../../../features/focusSession/queries'
import withApiRoute from '../../../../datasources/withApiRoute'

export async function resumeActiveFocusSession({
  activeFocusSession,
  options,
  res,
}) {
  const currentPauses = activeFocusSession.pauses ?? []

  const activePause = currentPauses.find((pause) => pause.endTime === null)
  const resumedPauses = currentPauses.filter((pause) => pause.endTime !== null)

  if (!activePause) {
    return res.status(200).json(activeFocusSession)
  }

  const pauseToResume = {
    ...activePause,
    endTime: Date.now(),
  }

  const fetchOptions = {
    ...options,
    body: { pauses: [...resumedPauses, pauseToResume] },
  }

  return fetchResource({
    resource: 'focus-sessions',
    url: `focus-sessions/${activeFocusSession.id}`,
    options: fetchOptions,
    res,
  })
}

async function handler(req, res) {
  const { options } = buildApiUrl(req, res)

  if (req.method === 'PATCH') {
    const activeFocusSession = await getActiveFocusSession({ options })
    await resumeActiveFocusSession({ activeFocusSession, options, res })
  }
}

export default withApiRoute(handler)
