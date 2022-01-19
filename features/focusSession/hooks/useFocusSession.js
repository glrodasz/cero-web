import { useEffect, useState } from 'react'
import { focusSessionsApi } from '../api'
import { useQuery } from 'react-query'

const QUERY_KEY = 'focus-session'

const useFocusSession = () => {
  const { isLoading, error, data: serverData } = useQuery(QUERY_KEY, () =>
    focusSessionsApi.getActive()
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
    api: {},
  }
}

export default useFocusSession
