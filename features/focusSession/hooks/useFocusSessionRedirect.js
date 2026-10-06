import { useEffect, useState } from 'react'
import Router from 'next/router'
import { useQuery } from '@tanstack/react-query'

import { isServerDataSource } from '../../../config/dataSource'
import isEmpty from '../../../utils/isEmpty'
import { focusSessionsApi } from '../../common/api'
import { QUERY_KEY } from './useFocusSession'

// Server rendering redirects between planning and the focus session for the
// sources it can read (`pages/planning.js`, `pages/focus-session.js`). Data kept
// in the browser, or behind a backend elsewhere, can only be read once the page
// is there, so the same redirect happens here instead — and only here: when the
// server can read the data this stays disabled and costs nothing.
//
// Like the server's, it is decided once, as the page opens. Only an answer
// fetched after mount counts — the cache can still hold the previous page's,
// "no session" right after starting one — and later answers are ignored:
// starting or finishing a session navigates on its own, and redirecting again
// on the refetch that follows would race it.
const useFocusSessionRedirect = ({ redirectWhenActive, to }) => {
  const enabled = !isServerDataSource()
  const [shouldRedirect, setShouldRedirect] = useState()

  const { data, isSuccess, isError, isFetchedAfterMount } = useQuery(
    [QUERY_KEY],
    () => focusSessionsApi.getActive(),
    { enabled }
  )

  if (
    enabled &&
    shouldRedirect === undefined &&
    isFetchedAfterMount &&
    isSuccess
  ) {
    setShouldRedirect(!isEmpty(data) === redirectWhenActive)
  }

  useEffect(() => {
    if (shouldRedirect) Router.replace(to)
  }, [shouldRedirect, to])

  // A failed read is left to the page, which shows its own error.
  return { isReady: !enabled || shouldRedirect === false || isError }
}

export default useFocusSessionRedirect
