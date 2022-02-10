import { focusSessionsApi } from '../../planning/api'
import { useMutation, useQueryCache } from 'react-query'

const QUERY_KEY = 'focus-sessions'

export const createMutation = (params) => focusSessionsApi.create(params)
export const finishMutation = (params) => focusSessionsApi.finish(params)

const useFocusSessions = () => {
  const queryCache = useQueryCache()

  const [create] = useMutation(createMutation, {
    onSuccess: () => {
      queryCache.invalidateQueries(QUERY_KEY)
    },
  })

  const [finish] = useMutation(finishMutation, {
    onSuccess: () => {
      queryCache.invalidateQueries(QUERY_KEY)
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
