import { focusSessionsApi } from '../../planning/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const QUERY_KEY = 'focus-sessions'

export const createMutation = (params) => focusSessionsApi.create(params)
export const finishMutation = (params) => focusSessionsApi.finish(params)

const useFocusSessions = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: create } = useMutation(createMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY)
    },
  })

  const { mutateAsync: finish } = useMutation(finishMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY)
    },
  })

  return {
    api: {
      create,
      finish,
    },
  }
}

export default useFocusSessions
