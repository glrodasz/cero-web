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

export const DEV_TOOLS_LINKS = [
  { href: '/', label: '/index' },
  { href: '/api/auth/login', label: 'api/auth/login' },
  { href: '/api/auth/logout', label: 'api/auth/logout' },
  { href: '/home', label: 'home' },
  { href: '/planning', label: 'planning' },
  { href: '/retrospective', label: 'retrospective' },
]
