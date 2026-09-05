import buildApiUrl from '../../../../../datasources/buildApiUrl'
import fetchResource from '../../../../../datasources'
import withApiRoute from '../../../../../datasources/withApiRoute'

function handler(req, res) {
  const { url, options } = buildApiUrl(req, res)
  return fetchResource({ resource: 'task', url, options, res })
}

export default withApiRoute(handler)
