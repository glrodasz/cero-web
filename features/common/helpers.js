import { isDemoUser } from './auth'

// "Hola, Demo" reads like a placeholder leaking into the UI, so the demo user —
// and a user with no name to show — get the greeting on its own.
export const getGreeting = (greeting, user) =>
  isDemoUser(user) || !user?.name ? greeting : `${greeting}, ${user.name}`
