import {
  useUser as useAuth0User,
  withPageAuthRequired as withAuth0PageAuthRequired,
} from '@auth0/nextjs-auth0'

// Lets a preview deployment run without Auth0 secrets or per deployment
// callback URLs. It has to be a `NEXT_PUBLIC_` variable because `useUser` runs
// in the browser. Trimmed and lowercased so a stray space or `"True"` on the
// hosting provider's dashboard doesn't silently fall back to real Auth0.
export const IS_DEMO_MODE =
  (process.env.NEXT_PUBLIC_DEMO_MODE ?? '').trim().toLowerCase() === 'true'

const DEMO_AVATAR =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%236c5ce7"/><text x="50" y="64" font-size="44" font-family="sans-serif" fill="%23ffffff" text-anchor="middle">D</text></svg>'

export const DEMO_USER = {
  sub: 'demo|cero',
  name: 'Demo',
  nickname: 'demo',
  email: 'demo@cero.local',
  picture: DEMO_AVATAR,
}

const useDemoUser = () => ({
  user: DEMO_USER,
  isLoading: false,
  error: undefined,
})

// Mirrors both call shapes used in the app: `withPageAuthRequired()` on pages
// without data fetching, and `withPageAuthRequired({ getServerSideProps })` on
// the ones that do.
const withDemoPageAuthRequired = (options = {}) =>
  options.getServerSideProps ?? (async () => ({ props: {} }))

export const useUser = IS_DEMO_MODE ? useDemoUser : useAuth0User

// `withPageAuthRequired` is only ever assigned to a page's `getServerSideProps`
// export, which Next.js excludes from the client bundle. The
// `typeof window === 'undefined'` guard is still kept as a second, harmless
// safety net: it short circuits before `process.env.AUTH0_SECRET` is ever
// evaluated in the browser, so this cannot throw client-side either way. It
// mirrors the same fallback in `pages/api/auth/[...auth0].js`, so a page
// still renders instead of crashing with "secret is required" even if
// `NEXT_PUBLIC_DEMO_MODE` was somehow not `true` at build time.
const isServerSideAuth0Unconfigured = () =>
  typeof window === 'undefined' && !process.env.AUTH0_SECRET

export const withPageAuthRequired = (options) =>
  IS_DEMO_MODE || isServerSideAuth0Unconfigured()
    ? withDemoPageAuthRequired(options)
    : withAuth0PageAuthRequired(options)
