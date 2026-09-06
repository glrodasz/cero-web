import { API_NAMESPACE, getDataSource } from '../config/dataSource'
import withApiHandler from '../utils/withApiHandler'

// Wraps the generic error boundary with the one project-specific check these
// routes need: the `[source]` segment in the path has to name the data source
// this deployment is actually configured for.
//
// `API_URL` is derived from the same place, so the two agree by construction.
// They can only diverge if a stale bundle is calling a namespace this build no
// longer serves — and failing loudly here beats silently reading the wrong
// store. (`withApiHandler` stays in `utils/` precisely because it knows none of
// this: it is generic Next.js plumbing.)
const withApiRoute = (handler) =>
  withApiHandler((req, res) => {
    const expected = API_NAMESPACE[getDataSource()]

    if (req.query.source !== expected) {
      return res.status(400).json({
        error: `This deployment serves "/api/${expected}", not "/api/${req.query.source}".`,
      })
    }

    return handler(req, res)
  })

export default withApiRoute
