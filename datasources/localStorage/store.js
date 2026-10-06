import seed from '../../db.seed.json'
import { clone } from '../collections'

export const STORAGE_KEY = 'cero:collections'

// The browser already scopes this data to one visitor, so unlike the fixtures
// store there is no session to key by: the `sessionId` the collections handler
// passes along is ignored.
const getStorage = () => {
  if (typeof window === 'undefined') {
    throw new Error(
      'The "local-storage" data source only exists in the browser; nothing on the server can read it.'
    )
  }

  return window.localStorage
}

const parse = (stored) => {
  try {
    return JSON.parse(stored)
  } catch (error) {
    return undefined
  }
}

const isCollections = (value) =>
  value != null && typeof value === 'object' && !Array.isArray(value)

export const getCollections = async () => {
  const stored = getStorage().getItem(STORAGE_KEY)

  if (stored == null) return clone(seed)

  const collections = parse(stored)

  if (isCollections(collections)) return collections

  // Anything other than a plain object means the stored value was edited or
  // truncated. Reseeding keeps the demo usable instead of failing deep inside
  // a component that expected a collection.
  console.warn(
    `[datasources/localStorage] discarding unusable stored value under "${STORAGE_KEY}"`
  )

  return clone(seed)
}

export const saveCollections = async (sessionId, collections) => {
  getStorage().setItem(STORAGE_KEY, JSON.stringify(collections))
}

// Nothing expires on its own, so this is the way back to the seed data short
// of clearing the site's data. The next read reseeds.
export const resetCollections = () => {
  getStorage().removeItem(STORAGE_KEY)
}
