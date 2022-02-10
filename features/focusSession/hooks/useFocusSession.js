import { focusSessionsApi } from '../api'
import { useQuery, useMutation, useQueryCache } from 'react-query'
import useLocalData from '../../common/hooks/useLocalData'

const QUERY_KEY = 'focus-session'

export const pauseMutation = () => focusSessionsApi.pause()
export const resumeMutation = () => focusSessionsApi.resume()

const useFocusSession = ({ initialData, onResume }) => {
  const queryCache = useQueryCache()

  const { isLoading, error, data: fetchedData } = useQuery(
    QUERY_KEY,
    () => focusSessionsApi.getActive(),
    { initialData }
  )

  const [pause] = useMutation(pauseMutation, {
    onSuccess: () => {
      queryCache.invalidateQueries(QUERY_KEY)
    },
  })

  const [resume] = useMutation(resumeMutation, {
    onSuccess: () => {
      queryCache.invalidateQueries(QUERY_KEY)
      onResume?.()
    },
  })

  const { localData, setLocalData } = useLocalData(fetchedData)

  return {
    isLoading,
    error,
    data: localData,
    setLocalData,
    api: {
      pause,
      resume,
    },
  }
}

export default useFocusSession
