import buildApiUrl from '../../../../datasources/buildApiUrl'
import fetchResource from '../../../../datasources'
import withApiRoute from '../../../../datasources/withApiRoute'
import { startFocusSession } from '../../../../features/focusSession/commands'

async function handler(req, res) {
  const { options } = buildApiUrl(req, res)

  if (req.method === 'GET') {
    return fetchResource({
      resource: 'focus-sessions',
      url: 'focus-sessions',
      options,
      res,
    })
  }

  if (req.method === 'POST') {
    const { status, body } = await startFocusSession({ options })

    return res.status(status).json(body)
  }
}

export default withApiRoute(handler)
