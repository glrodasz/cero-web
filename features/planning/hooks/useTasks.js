import { useEffect, useState } from 'react'
import { tasksApi } from '../api'
import { useQuery, useMutation } from 'react-query'

const QUERY_KEY = 'tasks'

const useTasks = ({ initialData, queryCache, onRemove }) => {
  const { isLoading, error, data: serverData } = useQuery(
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
      onRemove()
    },
  })

  const [updatePriorities] = useMutation(
    (params) => tasksApi.updatePriorities(params),
    {
      onSuccess: () => {
        queryCache.invalidateQueries(QUERY_KEY)
      },
    }
  )

  const [localData, setLocalData] = useState(serverData)

  useEffect(() => {
    setLocalData(serverData)
  }, [serverData])

  return {
    isLoading,
    error,
    data: localData,
    setLocalData,
    api: {
      create,
      remove,
      updatePriorities,
    },
  }
}

export default useTasks
