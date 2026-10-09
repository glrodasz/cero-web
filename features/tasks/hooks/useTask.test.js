import { renderHook } from '@testing-library/react-hooks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useTask from './useTask'

import { tasksApi } from '../../common/api'
jest.mock('../../common/api', () => ({
  tasksApi: {
    getById: jest.fn(),
    update: jest.fn(),
  },
}))

const TASK = { id: 7, description: 'Responder correos', duration: 30 }

const renderUseTask = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    logger: { log: () => {}, warn: () => {}, error: () => {} },
  })
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  return renderHook(() => useTask({ id: TASK.id }), { wrapper })
}

describe('[ features / tasks / hooks / useTask ]', () => {
  beforeEach(() => {
    tasksApi.getById.mockResolvedValue(TASK)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('when a field is updated', () => {
    it('should show the change before the write finishes', async () => {
      // Arrange
      tasksApi.update.mockReturnValue(new Promise(() => {}))
      const { result, waitFor } = renderUseTask()
      await waitFor(() => expect(result.current.data).toEqual(TASK))

      // Act
      result.current.api.update({ id: TASK.id, task: { duration: 60 } })

      // Assert
      await waitFor(() => expect(result.current.data?.duration).toBe(60))
      expect(tasksApi.update).toHaveBeenCalledWith({
        id: TASK.id,
        task: { duration: 60 },
      })
    })
  })

  describe('when the write fails', () => {
    it('should roll the change back and expose the error', async () => {
      // Arrange
      tasksApi.update.mockRejectedValue(new Error('offline'))
      const { result, waitFor } = renderUseTask()
      await waitFor(() => expect(result.current.data).toEqual(TASK))
      tasksApi.getById.mockReturnValue(new Promise(() => {}))

      // Act
      result.current.api.update({ id: TASK.id, task: { duration: 60 } })

      // Assert
      await waitFor(() => expect(result.current.updateError).toBeTruthy())
      expect(result.current.data?.duration).toBe(30)
    })
  })
})
