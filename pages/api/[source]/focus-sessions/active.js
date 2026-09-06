import buildApiUrl from '../../../../datasources/buildApiUrl'
import { readActiveFocusSession } from '../../../../features/focusSession/queries'
import withApiRoute from '../../../../datasources/withApiRoute'

async function handler(req, res) {
  const { options } = buildApiUrl(req, res)

  if (req.method === 'GET') {
    const activeFocusSession = await readActiveFocusSession({
      sessionId: options.sessionId,
    })

    return res.status(200).json(activeFocusSession)
  }
}

export default withApiRoute(handler)
