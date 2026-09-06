import Request from './request'

const mockResponse = ({ ok, status, body }) => ({
  ok,
  status,
  json: () =>
    body === undefined
      ? Promise.reject(new Error('not json'))
      : Promise.resolve(body),
})

describe('[ api / request ]', () => {
  afterEach(() => {
    delete global.fetch
  })

  describe('when the response is successful', () => {
    it('should resolve with the parsed body', async () => {
      // Arrange
      global.fetch = jest.fn(() =>
        Promise.resolve(
          mockResponse({ ok: true, status: 200, body: [{ id: 1 }] })
        )
      )

      // Act & Assert
      await expect(new Request('tasks', 'http://api').fetch()).resolves.toEqual(
        [{ id: 1 }]
      )
    })
  })

  describe('when the response fails', () => {
    it('should use the error message from the body', async () => {
      // Arrange
      global.fetch = jest.fn(() =>
        Promise.resolve(
          mockResponse({ ok: false, status: 500, body: { error: 'Boom' } })
        )
      )

      // Act & Assert
      await expect(new Request('tasks', 'http://api').fetch()).rejects.toThrow(
        'Boom'
      )
    })

    // The hosting platform reports a crashed or timed out function this way,
    // and it used to collapse into "[object Object]".
    it('should flatten a structured platform error', async () => {
      // Arrange
      global.fetch = jest.fn(() =>
        Promise.resolve(
          mockResponse({
            ok: false,
            status: 500,
            body: {
              error: {
                code: 'FUNCTION_INVOCATION_TIMEOUT',
                message: 'Task timed out',
              },
            },
          })
        )
      )

      // Act & Assert
      await expect(new Request('tasks', 'http://api').fetch()).rejects.toThrow(
        'FUNCTION_INVOCATION_TIMEOUT: Task timed out'
      )
    })

    it('should fall back to the status when the body is not json', async () => {
      // Arrange
      global.fetch = jest.fn(() =>
        Promise.resolve(mockResponse({ ok: false, status: 502 }))
      )

      // Act & Assert
      await expect(new Request('tasks', 'http://api').fetch()).rejects.toThrow(
        'Request to "tasks" failed with status 502'
      )
    })
  })
})
