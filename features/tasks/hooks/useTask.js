import { useEffect, useState } from 'react'
import { tasksApi } from '../../planning/api'
import { useQuery, useMutation, useQueryCache } from 'react-query'

const QUERY_KEY = 'task'

const useTask = ({ id }) => {
  const queryCache = useQueryCache()

  const { isLoading, error, data: serverData } = useQuery([QUERY_KEY, id], () =>
    tasksApi.getById({ id })
  )

  const [update] = useMutation((params) => tasksApi.update(params), {
    onSuccess: () => {
      queryCache.invalidateQueries(QUERY_KEY)
    },
  })

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
      update,
    },
  }
}

export default useTask
