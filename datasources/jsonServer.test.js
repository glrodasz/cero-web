jest.mock('../api/request', () =>
  jest
    .fn()
    .mockImplementation(() => ({ fetch: jest.fn().mockResolvedValue('ok') }))
)

import Request from '../api/request'
import fetchFromJsonServer from './jsonServer'

describe('[ datasources / jsonServer ]', () => {
  const ORIGINAL_ENV = process.env

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV, JSON_SERVER_URL: 'http://localhost:3001' }
    Request.mockClear()
  })

  afterAll(() => {
    process.env = ORIGINAL_ENV
  })

  it('should build a `Request` against `JSON_SERVER_URL`', async () => {
    // Act
    await fetchFromJsonServer({
      resource: 'tasks',
      url: 'tasks',
      options: { method: 'get' },
    })

    // Assert
    expect(Request).toHaveBeenCalledWith('tasks', 'http://localhost:3001')
  })
})
