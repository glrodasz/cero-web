// The `json-server`-compatible query/CRUD-shape logic, kept free of any I/O so
// it can be tested with plain arrays and no Redis mock.

const LIKE_SUFFIX = '_like'

export const getCollection = (collections, resource) => {
  if (!collections[resource]) {
    collections[resource] = []
  }

  return collections[resource]
}

export const getNextId = (collection) => {
  const ids = collection.map((item) => Number(item.id)).filter(Number.isFinite)

  return ids.length === 0 ? 1 : Math.max(...ids) + 1
}

export const findIndexById = (collection, id) =>
  collection.findIndex((item) => String(item.id) === String(id))

// `json-server` compares everything as strings, so `?focusSessionId=3` matches
// both the number `3` and the string `'3'`.
const matchesValue = (itemValue, value) => String(itemValue) === value

// The only `_like` usage in this app is pipe-separated alternation (e.g.
// `status_like=in-progress|pending`), never a genuine pattern search, so this
// checks each alternative as a plain substring instead of compiling `value`
// into a `RegExp`. The catch-all route forwards the raw query string from any
// caller straight into this function, so treating it as regex source would be
// a ReDoS vector (e.g. `?description_like=(a+)+$` against a matching value can
// hang the event loop of the same function serving other requests).
const matchesLike = (itemValue, value) => {
  const haystack = String(itemValue).toLowerCase()

  return value
    .split('|')
    .some((alternative) => haystack.includes(alternative.toLowerCase()))
}

// Repeated params are an OR (`?status=pending&status=in-progress`), different
// params are an AND.
export const matchesFilters = (item, filters) =>
  filters.every(({ field, values, isLike }) =>
    values.some((value) =>
      isLike
        ? matchesLike(item[field], value)
        : matchesValue(item[field], value)
    )
  )

export const buildFilters = (searchParams) => {
  const filters = new Map()

  searchParams.forEach((value, key) => {
    if (key.startsWith('_')) return

    const isLike = key.endsWith(LIKE_SUFFIX)
    const field = isLike ? key.slice(0, -LIKE_SUFFIX.length) : key

    if (!filters.has(key)) {
      filters.set(key, { field, isLike, values: [] })
    }

    filters.get(key).values.push(value)
  })

  return [...filters.values()]
}

const compareValues = (a, b) => {
  if (typeof a === 'number' && typeof b === 'number') return a - b

  return String(a).localeCompare(String(b))
}

export const sortItems = (items, searchParams) => {
  const sort = searchParams.get('_sort')

  if (!sort) return items

  const fields = sort.split(',')
  const orders = (searchParams.get('_order') ?? 'asc').split(',')

  return [...items].sort((itemA, itemB) => {
    for (const [index, field] of fields.entries()) {
      const comparison = compareValues(itemA[field], itemB[field])

      if (comparison !== 0) {
        const isDescending = (orders[index] ?? orders[0]) === 'desc'

        return isDescending ? -comparison : comparison
      }
    }

    return 0
  })
}

export const parseUrl = (url) => {
  // The base is irrelevant, it only lets `URL` parse the relative path.
  const { pathname, searchParams } = new URL(url, 'http://memory-db.local')
  const [resource, id] = pathname
    .split('/')
    .filter(Boolean)
    .map(decodeURIComponent)

  return { resource, id, searchParams }
}
