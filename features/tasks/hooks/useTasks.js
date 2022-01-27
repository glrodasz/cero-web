import { tasksApi } from '../../planning/api'
import { useQuery, useMutation, useQueryCache } from 'react-query'
import useLocalData from '../../common/hooks/useLocalData'

const QUERY_KEY = 'tasks'

const useTasks = ({ initialData, onRemove }) => {
  const queryCache = useQueryCache()

  const { isLoading, error, data: fetchedData } = useQuery(
    QUERY_KEY,
    () => tasksApi.getAll(),
    {
      initialData,
    }
  )

  const [create] = useMutation((params) => tasksApi.create(params), {
    onSuccess: () => {
      queryCache.invalidateQueries(QUERY_KEY)
    },
  })

  const [remove] = useMutation((params) => tasksApi.delete(params), {
    onSuccess: () => {
      queryCache.invalidateQueries(QUERY_KEY)
      onRemove?.()
    },
  })

  const [updateStatus] = useMutation(
    (params) => tasksApi.updateStatus(params),
    {
      onSuccess: () => {
        queryCache.invalidateQueries(QUERY_KEY)
      },
    }
  )

  const [updatePriorities] = useMutation(
    (params) => tasksApi.updatePriorities(params),
    {
      onSuccess: () => {
        queryCache.invalidateQueries(QUERY_KEY)
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
