import { isBrowserDataSource } from '../config/dataSource'
import browserTransport from './browserTransport'
import Tasks from './tasks'
import FocusSession from './focusSessions'

// With the data in the browser there is no server to call: requests are
// answered right here, by the same commands the API routes run.
const transport = isBrowserDataSource() ? browserTransport : undefined

export const tasks = new Tasks('tasks', { transport })
export const focusSessions = new FocusSession('focus-sessions', { transport })
