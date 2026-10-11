import { focusSessionsApi } from '../../common/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const QUERY_KEY = 'focus-sessions'

export const createMutation = (params) => focusSessionsApi.create(params)
export const finishMutation = (params) => focusSessionsApi.finish(params)

const useFocusSessions = () => {
  const queryClient = useQueryClient()

  const {
    mutateAsync: create,
    isLoading: isCreating,
    error: createError,
  } = useMutation(createMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY)
    },
  })

  const {
    mutateAsync: finish,
    isLoading: isFinishing,
    error: finishError,
  } = useMutation(finishMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY)
    },
  })

  return {
    isCreating,
    createError,
    isFinishing,
    finishError,
    api: {
      create,
      finish,
    },
  }
}

export default useFocusSessions
