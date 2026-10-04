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
      await expect(
        new Request('tasks', { baseUrl: 'http://api' }).fetch()
      ).resolves.toEqual([{ id: 1 }])
    })
  })

  describe('when a transport is given', () => {
    it('should send through it instead of the network', async () => {
      // Arrange
      global.fetch = jest.fn()
      const transport = jest.fn(() =>
        Promise.resolve(
          mockResponse({ ok: true, status: 200, body: { id: 1 } })
        )
      )

      // Act
      const result = await new Request('tasks', { transport }).fetch(
        'tasks/1',
        {
          method: 'patch',
          body: { priority: 2 },
        }
      )

      // Assert
      expect(result).toEqual({ id: 1 })
      expect(global.fetch).not.toHaveBeenCalled()
      expect(transport).toHaveBeenCalledWith(
        'tasks/1',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ priority: 2 }),
        })
      )
    })

    it('should check its reply like any other response', async () => {
      // Arrange
      const transport = () =>
        Promise.resolve(
          mockResponse({ ok: false, status: 404, body: { error: 'Missing' } })
        )

      // Act & Assert
      await expect(new Request('tasks', { transport }).fetch()).rejects.toThrow(
        'Missing'
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
      await expect(
        new Request('tasks', { baseUrl: 'http://api' }).fetch()
      ).rejects.toThrow('Boom')
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
      await expect(
        new Request('tasks', { baseUrl: 'http://api' }).fetch()
      ).rejects.toThrow('FUNCTION_INVOCATION_TIMEOUT: Task timed out')
    })

    it('should fall back to the status when the body is not json', async () => {
      // Arrange
      global.fetch = jest.fn(() =>
        Promise.resolve(mockResponse({ ok: false, status: 502 }))
      )

      // Act & Assert
      await expect(
        new Request('tasks', { baseUrl: 'http://api' }).fetch()
      ).rejects.toThrow('Request to "tasks" failed with status 502')
    })
  })
})
