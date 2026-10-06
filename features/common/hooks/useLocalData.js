import { useState } from 'react'

// Mirrors the fetched data while letting the caller override it locally (an
// optimistic reorder) until the next fetch replaces it.
//
// The reset happens during render rather than in an effect. An effect runs
// after the render that received the new data, so for one render the caller
// saw `isLoading: false` next to the stale value — on a first load,
// `undefined`, which crashed the board whenever nothing was server rendered
// (the `local-storage` data source).
const useLocalData = (fetchedData) => {
  const [localData, setLocalData] = useState(fetchedData)
  const [previousFetchedData, setPreviousFetchedData] = useState(fetchedData)

  if (fetchedData !== previousFetchedData) {
    setPreviousFetchedData(fetchedData)
    setLocalData(fetchedData)
  }

  return { localData, setLocalData }
}

export default useLocalData
