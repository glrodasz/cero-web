import { tasksApi } from '../../planning/api'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import useLocalData from '../../common/hooks/useLocalData'

const QUERY_KEY = 'tasks'

const useTasks = ({ initialData, onRemove }) => {
  const queryClient = useQueryClient()

  const {
    isLoading,
    error,
    data: fetchedData,
  } = useQuery(QUERY_KEY, () => tasksApi.getAll(), {
    initialData,
  })

  const { mutateAsync: create } = useMutation(
    (params) => tasksApi.create(params),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEY)
      },
    }
  )

  const { mutateAsync: remove } = useMutation(
    (params) => tasksApi.delete(params),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEY)
        onRemove?.()
      },
    }
  )

  const { mutateAsync: updateStatus } = useMutation(
    (params) => tasksApi.updateStatus(params),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEY)
      },
    }
  )

  const { mutateAsync: updatePriorities } = useMutation(
    (params) => tasksApi.updatePriorities(params),
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
      create,
      remove,
      updatePriorities,
      updateStatus,
    },
  }
}

export default useTasks
