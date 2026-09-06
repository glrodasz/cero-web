import buildApiUrl from '../../../datasources/buildApiUrl'
import fetchResource from '../../../datasources'
import withApiRoute from '../../../datasources/withApiRoute'

async function handler(req, res) {
  let { url, options } = buildApiUrl(req, res)
  const [resource] = req.query.entity

  return fetchResource({ resource, url, options, res })
}

export default withApiRoute(handler)
