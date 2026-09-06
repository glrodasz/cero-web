// Next.js answers an uncaught handler error with an opaque plain text
// "Internal Server Error", so by the time it reaches `getServerSideProps` the
// real cause is gone. Wrapping the handlers keeps the actual message in the
// response body and puts the full error in the function logs.
const withApiHandler = (handler) => async (req, res) => {
  try {
    await handler(req, res)

    // Handlers answer inside a `if (req.method === …)` guard, so any other
    // method falls through without ever touching `res`. Next.js leaves the
    // connection open when that happens, so the caller waits out a gateway
    // timeout instead of being told the method is wrong.
    if (!res.headersSent && !res.writableEnded) {
      return res
        .status(405)
        .json({ error: `Method "${req.method}" is not allowed here.` })
    }

    return undefined
  } catch (error) {
    console.error('[api]', req.method, req.url, error)

    if (res.headersSent) return undefined

    return res.status(500).json({ error: error.message })
  }
}

export default withApiHandler
