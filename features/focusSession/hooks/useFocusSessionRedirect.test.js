import { renderHook } from '@testing-library/react-hooks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Router from 'next/router'

import { focusSessionsApi } from '../../common/api'
import useFocusSessionRedirect from './useFocusSessionRedirect'
import { QUERY_KEY } from './useFocusSession'

jest.mock('next/router', () => ({ replace: jest.fn() }))

jest.mock('../../common/api', () => ({
  focusSessionsApi: { getActive: jest.fn() },
}))

const ACTIVE_FOCUS_SESSION = { id: 1, status: 'active' }

// `waitFor` polls inside `act`, which holds effects back until it returns, so
// the redirect (an effect) is asserted after `waitForNextUpdate` instead.
const renderRedirect = ({
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  }),
  ...params
}) => {
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  return renderHook(() => useFocusSessionRedirect(params), { wrapper })
}

describe('[ features / focusSession / hooks / useFocusSessionRedirect ]', () => {
  const ORIGINAL_ENV = process.env

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV, NEXT_PUBLIC_API_URL: '' }
    Router.replace.mockReset()
    focusSessionsApi.getActive.mockReset()
  })

  afterAll(() => {
    process.env = ORIGINAL_ENV
  })

  describe('when server rendering already redirected', () => {
    it('should stay out of the way', () => {
      // Arrange
      process.env.NEXT_PUBLIC_API_URL = '/api/local'

      // Act
      const { result } = renderRedirect({
        redirectWhenActive: true,
        to: '/focus-session',
      })

      // Assert
      expect(result.current.isReady).toBe(true)
      expect(focusSessionsApi.getActive).not.toHaveBeenCalled()
      expect(Router.replace).not.toHaveBeenCalled()
    })
  })

  // Server rendering skips the read for a backend elsewhere too, so the
  // redirect has to happen here just the same.
  describe('when the data lives behind a backend elsewhere', () => {
    it('should redirect once the answer is in', async () => {
      // Arrange
      process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com'
      focusSessionsApi.getActive.mockResolvedValue(ACTIVE_FOCUS_SESSION)

      // Act
      const { waitForNextUpdate } = renderRedirect({
        redirectWhenActive: true,
        to: '/focus-session',
      })
      await waitForNextUpdate()

      // Assert
      expect(Router.replace).toHaveBeenCalledWith('/focus-session')
    })
  })

  describe('when the data lives in the browser', () => {
    it('should hold the page until the answer is in', () => {
      // Arrange
      focusSessionsApi.getActive.mockReturnValue(new Promise(() => {}))

      // Act
      const { result } = renderRedirect({
        redirectWhenActive: true,
        to: '/focus-session',
      })

      // Assert
      expect(result.current.isReady).toBe(false)
    })

    it('should leave planning for the active session', async () => {
      // Arrange
      focusSessionsApi.getActive.mockResolvedValue(ACTIVE_FOCUS_SESSION)

      // Act
      const { result, waitForNextUpdate } = renderRedirect({
        redirectWhenActive: true,
        to: '/focus-session',
      })
      await waitForNextUpdate()

      // Assert
      expect(Router.replace).toHaveBeenCalledWith('/focus-session')
      expect(result.current.isReady).toBe(false)
    })

    it('should leave the focus session when there is none', async () => {
      // Arrange
      focusSessionsApi.getActive.mockResolvedValue({})

      // Act
      const { waitForNextUpdate } = renderRedirect({
        redirectWhenActive: false,
        to: '/planning',
      })
      await waitForNextUpdate()

      // Assert
      expect(Router.replace).toHaveBeenCalledWith('/planning')
    })

    it('should let the page render when there is nowhere to go', async () => {
      // Arrange
      focusSessionsApi.getActive.mockResolvedValue(ACTIVE_FOCUS_SESSION)

      // Act
      const { result, waitFor } = renderRedirect({
        redirectWhenActive: false,
        to: '/planning',
      })
      await waitFor(() => expect(result.current.isReady).toBe(true))

      // Assert
      expect(Router.replace).not.toHaveBeenCalled()
    })

    // Right after starting a session, the cache still says there is none.
    it('should not act on what the previous page left in the cache', async () => {
      // Arrange
      const queryClient = new QueryClient()
      queryClient.setQueryData([QUERY_KEY], {})
      focusSessionsApi.getActive.mockResolvedValue(ACTIVE_FOCUS_SESSION)

      // Act
      const { result, waitFor } = renderRedirect({
        queryClient,
        redirectWhenActive: false,
        to: '/planning',
      })
      await waitFor(() => expect(result.current.isReady).toBe(true))

      // Assert
      expect(Router.replace).not.toHaveBeenCalled()
    })

    // Finishing navigates on its own; redirecting again on the refetch that
    // follows would race it.
    it('should decide once, as the page opens', async () => {
      // Arrange
      const queryClient = new QueryClient()
      focusSessionsApi.getActive.mockResolvedValue(ACTIVE_FOCUS_SESSION)
      const { result, waitFor, waitForNextUpdate } = renderRedirect({
        queryClient,
        redirectWhenActive: false,
        to: '/planning',
      })
      await waitFor(() => expect(result.current.isReady).toBe(true))
      focusSessionsApi.getActive.mockResolvedValue({})

      // Act
      queryClient.refetchQueries([QUERY_KEY])
      await waitForNextUpdate()

      // Assert
      expect(focusSessionsApi.getActive).toHaveBeenCalledTimes(2)
      expect(Router.replace).not.toHaveBeenCalled()
      expect(result.current.isReady).toBe(true)
    })

    it('should let the page show its own error when the read fails', async () => {
      // Arrange
      focusSessionsApi.getActive.mockRejectedValue(new Error('boom'))

      // Act
      const { result, waitFor } = renderRedirect({
        redirectWhenActive: true,
        to: '/focus-session',
      })
      await waitFor(() => expect(result.current.isReady).toBe(true))

      // Assert
      expect(Router.replace).not.toHaveBeenCalled()
    })
  })
})
