import buildLocalApiUrl from '../../../utils/buildLocalApiUrl'
import fetchJsonServer from '../../../utils/fetchJsonServer'

export default async function handler(req, res) {
  let { url, options } = buildLocalApiUrl(req)
  const [resource] = req.query.entity

  fetchJsonServer({ resource, url, options, res })
}
