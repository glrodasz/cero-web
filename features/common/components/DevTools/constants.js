import { IS_DEMO_MODE } from '../../auth'

// Whether the dev tools are reachable at all. `NODE_ENV` is `production` for
// any `next build`, previews included, so on its own it would also hide the
// tools on the demo deployments that need them most — `IS_DEMO_MODE` is what
// keeps them there while a real production build stays clean.
//
// This lives with the feature rather than in `config/`: `config/` owns the
// data-source contract and must not start depending on `features/`.
export const IS_DEV_TOOLS_ENABLED =
  process.env.NODE_ENV !== 'production' || IS_DEMO_MODE

// Where the floating button was last dropped, per browser.
export const DEV_TOOLS_CORNER_STORAGE_KEY = 'dev-tools-corner'

// Client-side transitions. `/` is left out: it only redirects to `/planning`.
export const DEV_TOOLS_PAGES = [
  { href: '/planning', label: 'Planning', icon: 'tasks' },
  { href: '/focus-session', label: 'Focus session', icon: 'clock' },
  { href: '/retrospective', label: 'Retrospective', icon: 'reports' },
]

// API routes, so a full page load: `next/link` would try to route to them.
export const DEV_TOOLS_AUTH_LINKS = [
  { href: '/api/auth/login', label: 'Log in', icon: 'user' },
  { href: '/api/auth/logout', label: 'Log out', icon: 'arrowRight' },
]

export const RESET_DATA_CONFIRMATION =
  'Reset the demo data? Every task and focus session in this browser goes back to the seed.'
