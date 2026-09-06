import withSessionLock from './lock'
import {
  getCollection,
  getNextId,
  findIndexById,
  matchesFilters,
  buildFilters,
  sortItems,
  parseUrl,
} from './query'

export const clone = (value) => JSON.parse(JSON.stringify(value))

// The `json-server`-shaped CRUD every collection-backed data source performs,
// with the storage left to the caller. Redis backs the demo (`memory/`) and a
// plain per-process object backs the deterministic test data (`fixtures/`);
// both get identical semantics from here rather than each reimplementing them.
const createCollectionsHandler = ({ getCollections, saveCollections }) => {
  const readResource = async ({ sessionId, resource, id, searchParams }) => {
    const collections = await getCollections(sessionId)
    const collection = getCollection(collections, resource)

    if (id) {
      const item = collection.find(
        (current) => String(current.id) === String(id)
      )

      return item ? clone(item) : {}
    }

    const filters = buildFilters(searchParams)
    const filtered = collection.filter((item) => matchesFilters(item, filters))

    return clone(sortItems(filtered, searchParams))
  }

  const mutateResource = ({ sessionId, resource, id, method, body }) =>
    withSessionLock(sessionId, async () => {
      const collections = await getCollections(sessionId)
      const collection = getCollection(collections, resource)

      if (method === 'POST') {
        const created = { ...clone(body), id: getNextId(collection) }
        collection.push(created)
        await saveCollections(sessionId, collections)

        return clone(created)
      }

      if (method === 'PATCH' || method === 'PUT') {
        const index = findIndexById(collection, id)

        if (index === -1) {
          throw new Error(`No "${resource}" found with the id "${id}"`)
        }

        const current = collection[index]
        const updated =
          method === 'PATCH'
            ? { ...current, ...clone(body) }
            : { ...clone(body), id: current.id }

        collection[index] = updated
        await saveCollections(sessionId, collections)

        return clone(updated)
      }

      const index = findIndexById(collection, id)

      if (index !== -1) {
        collection.splice(index, 1)
        await saveCollections(sessionId, collections)
      }

      return {}
    })

  return async function handleRequest({ sessionId, url, options = {} }) {
    const { resource, id, searchParams } = parseUrl(url)

    if (!resource) {
      throw new Error(`Unable to resolve a resource from the url "${url}"`)
    }

    const method = (options.method ?? 'GET').toUpperCase()

    if (method === 'GET') {
      return readResource({ sessionId, resource, id, searchParams })
    }

    if (
      method === 'POST' ||
      method === 'PATCH' ||
      method === 'PUT' ||
      method === 'DELETE'
    ) {
      return mutateResource({
        sessionId,
        resource,
        id,
        method,
        body: options.body ?? {},
      })
    }

    throw new Error(`Unsupported method "${method}" for the url "${url}"`)
  }
}

export default createCollectionsHandler
