import withSessionLock from './lock'

describe('[ datasources / collections / lock ]', () => {
  it('should serialize mutations queued for the same session', async () => {
    const order = []

    await Promise.all([
      withSessionLock('s', async () => {
        order.push('a-start')
        await Promise.resolve()
        order.push('a-end')
      }),
      withSessionLock('s', async () => {
        order.push('b-start')
        order.push('b-end')
      }),
    ])

    expect(order).toEqual(['a-start', 'a-end', 'b-start', 'b-end'])
  })

  it('should not serialize mutations for different sessions', async () => {
    const order = []

    // `session-x` yields once internally and `session-y` never does — if
    // sessions serialized each other, `session-x` (queued first) would
    // always finish first regardless. It finishing last instead proves the
    // two ran independently.
    await Promise.all([
      withSessionLock('session-x', async () => {
        await Promise.resolve()
        order.push('x-end')
      }),
      withSessionLock('session-y', async () => {
        order.push('y-end')
      }),
    ])

    expect(order).toEqual(['y-end', 'x-end'])
  })

  it('should let a queued mutation proceed after an earlier one fails', async () => {
    const results = await Promise.allSettled([
      withSessionLock('s', async () => {
        throw new Error('boom')
      }),
      withSessionLock('s', async () => 'ok'),
    ])

    expect(results[0].status).toBe('rejected')
    expect(results[1]).toEqual({ status: 'fulfilled', value: 'ok' })
  })
})
