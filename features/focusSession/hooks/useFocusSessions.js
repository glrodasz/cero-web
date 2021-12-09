import { focusSessionsApi } from '../../planning/api'
import { useMutation, useQueryCache } from 'react-query'

export const createMutation = (params) => focusSessionsApi.create(params)
export const finishMutation = (params) => focusSessionsApi.finish(params)

const useFocusSessions = () => {
  const queryCache = useQueryCache()

  const [create] = useMutation(createMutation, {
    onSuccess: () => {
      queryCache.invalidateQueries('focusSessions')
    },
  })

  const [finish] = useMutation(finishMutation, {
    onSuccess: () => {
      queryCache.invalidateQueries('focusSessions')
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
