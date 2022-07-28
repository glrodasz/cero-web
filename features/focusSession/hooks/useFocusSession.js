import { focusSessionsApi } from '../api'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import useLocalData from '../../common/hooks/useLocalData'

const QUERY_KEY = 'focus-session'

export const pauseMutation = (params) => focusSessionsApi.pause(params)
export const resumeMutation = () => focusSessionsApi.resume()

const useFocusSession = ({ initialData, onResume }) => {
  const queryClient = useQueryClient()

  const {
    isLoading,
    error,
    data: fetchedData,
  } = useQuery(QUERY_KEY, () => focusSessionsApi.getActive(), { initialData })

  const { mutateAsync: pause } = useMutation(pauseMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY)
    },
  })

  const { mutateAsync: resume } = useMutation(resumeMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY)
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
