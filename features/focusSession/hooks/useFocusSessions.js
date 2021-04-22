import { focusSessionsApi } from '../../planning/api'
import { useMutation } from 'react-query'

const useFocusSessions = ({ queryCache }) => {
  const [create] = useMutation((params) => focusSessionsApi.create(params), {
    onSuccess: () => {
      queryCache.invalidateQueries('focusSessions')
    },
  })

  const [finish] = useMutation((params) => focusSessionsApi.finish(params), {
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
