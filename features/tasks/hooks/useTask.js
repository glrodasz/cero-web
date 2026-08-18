import { tasksApi } from '../../common/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import useLocalData from '../../common/hooks/useLocalData'

const QUERY_KEY = 'task'

const useTask = ({ id }) => {
  const queryClient = useQueryClient()

  const {
    isLoading,
    error,
    data: fetchedData,
  } = useQuery([QUERY_KEY, id], () => tasksApi.getById({ id }))

  const { mutateAsync: update } = useMutation(
    (params) => tasksApi.update(params),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEY)
      },
    }
  )

  const { localData, setLocalData } = useLocalData(fetchedData)

  return {
    isLoading,
    error,
    data: localData,
    setLocalData,
    api: {
      update,
    },
  }
}

export default useTask
