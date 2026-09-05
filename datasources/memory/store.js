import seed from '../../db.seed.json'
import { clone } from '../collections'
import getRedisClient from './client'

const DEFAULT_SESSION_ID = 'default'
const SESSION_KEY_PREFIX = 'cero-demo:'
export const SESSION_TTL_SECONDS = 60 * 60 * 24

export const getCollections = async (sessionId = DEFAULT_SESSION_ID) => {
  const redis = getRedisClient()

  // `@upstash/redis` serializes/deserializes JSON automatically.
  const stored = await redis.get(SESSION_KEY_PREFIX + sessionId)

  if (stored == null) return clone(seed)

  // Anything other than a plain object means the stored value did not survive
  // the round trip intact. Reseeding keeps the demo usable instead of failing
  // deep inside a component that expected a collection.
  if (typeof stored !== 'object' || Array.isArray(stored)) {
    console.warn(
      `[datasources/memory] discarding unusable stored value for session "${sessionId}" (${typeof stored})`
    )

    return clone(seed)
  }

  return stored
}

// The default has to match `getCollections`. Without it a missing session id
// reads `cero-demo:default` and writes `cero-demo:undefined`, so the write
// lands in a document nothing ever reads back.
export const saveCollections = async (
  sessionId = DEFAULT_SESSION_ID,
  collections
) => {
  const redis = getRedisClient()

  await redis.set(SESSION_KEY_PREFIX + sessionId, collections, {
    ex: SESSION_TTL_SECONDS,
  })
}
