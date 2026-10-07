import { useState } from 'react'

const useRetrospectiveFeedback = () => {
  const [score, setScore] = useState(null)
  const [blockers, setBlockers] = useState('')

  return { score, setScore, blockers, setBlockers }
}

export default useRetrospectiveFeedback
