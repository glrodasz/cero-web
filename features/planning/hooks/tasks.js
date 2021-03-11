import { tasksApi } from '../api'
import { useQuery, useMutation } from 'react-query'

const CACHE_KEY = 'tasks'

export const useTasks = ({ initialData, queryCache, crudCallbacks }) => {
  const { isLoading, error, data } = useQuery(
    CACHE_KEY,
    () => tasksApi.getAll(),
    {
      initialData,
    }
  )

  const [create] = useMutation((params) => tasksApi.create(params), {
    onSuccess: () => {
      queryCache.invalidateQueries(CACHE_KEY)
    },
  })

  const [remove] = useMutation((params) => tasksApi.delete(params), {
    onSuccess: () => {
      queryCache.invalidateQueries(CACHE_KEY)
      crudCallbacks.delete()
    },
  })

  const [updatePriorities] = useMutation(
    (params) => tasksApi.updatePriorities(params),
    {
      onSuccess: () => {
        queryCache.invalidateQueries(CACHE_KEY)
      },
    }
  )

  return {
    tasksIsLoading: isLoading,
    tasksError: error,
    tasksData: data,
    tasksCrud: {
      create,
      remove,
      updatePriorities
    },
  }
}
