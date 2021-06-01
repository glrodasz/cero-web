import { focusSessionsApi } from '../../planning/api'
import { useMutation } from 'react-query'

export const createMutation = (params) => focusSessionsApi.create(params)
export const finishMutation = (params) => focusSessionsApi.finish(params)

const useFocusSessions = ({ queryCache }) => {
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
