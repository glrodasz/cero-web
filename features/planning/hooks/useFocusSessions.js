import { focusSessionsApi } from '../api'
import { useMutation } from 'react-query'

const useFocusSessions = ({ queryCache }) => {
  const [create] = useMutation(() => focusSessionsApi.create(), {
    onSuccess: () => {
      queryCache.invalidateQueries('focusSessions')
    },
  })

  return {
    api: {
      create,
    },
  }
}

export default useFocusSessions
