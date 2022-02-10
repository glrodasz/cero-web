import buildLocalApiUrl from '../../../../../utils/buildLocalApiUrl'
import fetchJsonServer from '../../../../../utils/fetchJsonServer'

export default function handler(req, res) {
  const { url, options } = buildLocalApiUrl(req)
  fetchJsonServer({ resource: 'task', url, options, res })
}
