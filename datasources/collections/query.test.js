import {
  getCollection,
  getNextId,
  findIndexById,
  matchesFilters,
  buildFilters,
  sortItems,
  parseUrl,
} from './query'

const filterUrl = (items, url) => {
  const { searchParams } = parseUrl(url)
  const filters = buildFilters(searchParams)

  return items.filter((item) => matchesFilters(item, filters))
}

describe('[ datasources / collections / query ]', () => {
  describe('parseUrl', () => {
    it('should extract the resource and id from a single-item url', () => {
      expect(parseUrl('tasks/3?status=pending')).toMatchObject({
        resource: 'tasks',
        id: '3',
      })
    })

    it('should leave `id` undefined for a collection url', () => {
      expect(parseUrl('tasks?status=pending').id).toBeUndefined()
    })
  })

  describe('buildFilters + matchesFilters', () => {
    const items = [
      { id: 1, status: 'pending' },
      { id: 2, status: 'in-progress' },
      { id: 3, status: 'completed' },
    ]

    it('should match a single value', () => {
      expect(filterUrl(items, 'tasks?status=pending')).toEqual([items[0]])
    })

    it('should treat a repeated param as an OR', () => {
      expect(
        filterUrl(items, 'tasks?status=pending&status=in-progress')
      ).toEqual([items[0], items[1]])
    })

    it('should support `_like` alternation as a substring check', () => {
      expect(filterUrl(items, 'tasks?status_like=pending|in-progress')).toEqual(
        [items[0], items[1]]
      )
    })

    it('should never compile the value into a RegExp (ReDoS safety)', () => {
      // A pattern like this causes catastrophic backtracking if it is ever
      // compiled into a `RegExp` and tested against a matching string.
      const start = Date.now()
      const result = filterUrl(items, 'tasks?status_like=' + '(a+)+$')

      expect(result).toEqual([])
      expect(Date.now() - start).toBeLessThan(50)
    })

    it('should compare values as strings', () => {
      const withNumericField = [{ id: 1, focusSessionId: 7 }]

      expect(filterUrl(withNumericField, 'tasks?focusSessionId=7')).toEqual(
        withNumericField
      )
    })

    it('should return an empty array when nothing matches', () => {
      expect(filterUrl(items, 'tasks?status=unknown')).toEqual([])
    })

    it('should AND different params together', () => {
      const withPriority = [
        { id: 1, status: 'pending', priority: 0 },
        { id: 2, status: 'pending', priority: 1 },
      ]

      expect(
        filterUrl(withPriority, 'tasks?status=pending&priority=1')
      ).toEqual([withPriority[1]])
    })
  })

  describe('sortItems', () => {
    const items = [{ id: 3 }, { id: 1 }, { id: 2 }]

    it('should order ascending by default', () => {
      const { searchParams } = parseUrl('tasks?_sort=id&_order=asc')

      expect(sortItems(items, searchParams).map((item) => item.id)).toEqual([
        1, 2, 3,
      ])
    })

    it('should order descending', () => {
      const { searchParams } = parseUrl('tasks?_sort=id&_order=desc')

      expect(sortItems(items, searchParams).map((item) => item.id)).toEqual([
        3, 2, 1,
      ])
    })

    it('should return the items unchanged when no `_sort` is given', () => {
      const { searchParams } = parseUrl('tasks')

      expect(sortItems(items, searchParams)).toEqual(items)
    })
  })

  describe('getNextId', () => {
    it('should start at 1 for an empty collection', () => {
      expect(getNextId([])).toBe(1)
    })

    it('should return one past the highest existing id', () => {
      expect(getNextId([{ id: 1 }, { id: 5 }, { id: 2 }])).toBe(6)
    })
  })

  describe('findIndexById', () => {
    it('should find an item regardless of id type', () => {
      expect(findIndexById([{ id: 1 }, { id: 2 }], '2')).toBe(1)
    })

    it('should return -1 when the item is missing', () => {
      expect(findIndexById([{ id: 1 }], '9')).toBe(-1)
    })
  })

  describe('getCollection', () => {
    it('should initialize a missing collection as an empty array', () => {
      const collections = {}

      expect(getCollection(collections, 'tasks')).toEqual([])
      expect(collections.tasks).toEqual([])
    })

    it('should return the existing collection unchanged', () => {
      const collections = { tasks: [{ id: 1 }] }

      expect(getCollection(collections, 'tasks')).toBe(collections.tasks)
    })
  })
})
