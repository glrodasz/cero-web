import { useState, useEffect } from 'react'

const useLocalData = (fetchedData) => {
  const [localData, setLocalData] = useState(fetchedData)

  useEffect(() => {
    setLocalData(fetchedData)
  }, [fetchedData])

  return { localData, setLocalData }
}

export default useLocalData
