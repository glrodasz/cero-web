import { useEffect, useState } from 'react'
import { tasksApi } from '../../planning/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const QUERY_KEY = 'task'

const useTask = ({ id }) => {
  const queryClient = useQueryClient()

  const {
    isLoading,
    error,
    data: serverData,
  } = useQuery([QUERY_KEY, id], () => tasksApi.getById({ id }))

  const { mutateAsync: update } = useMutation(
    (params) => tasksApi.update(params),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEY)
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
      update,
    },
  }
}

export default useTask
