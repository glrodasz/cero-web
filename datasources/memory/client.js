import { Redis } from '@upstash/redis'

const buildClient = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN

  if (!url || !token) {
    throw new Error(
      'Missing Upstash Redis credentials. Set UPSTASH_REDIS_REST_URL and ' +
        'UPSTASH_REDIS_REST_TOKEN (or connect the Upstash integration on Vercel).'
    )
  }

  // The client defaults to 5 retries with an exponential backoff, which adds
  // up to several seconds of waiting on top of the requests themselves. On a
  // serverless host that is long enough to blow the function's time limit, so
  // the platform kills it and reports a generic invocation failure instead of
  // the actual connection error. Failing fast keeps the real cause visible.
  return new Redis({
    url,
    token,
    retry: { retries: 1, backoff: (attempt) => attempt * 100 },
  })
}

// Constructed lazily so local development (which always sets `JSON_SERVER_URL`
// and never reaches this module) never needs Upstash credentials.
let client

const getRedisClient = () => {
  client = client ?? buildClient()

  return client
}

export default getRedisClient
