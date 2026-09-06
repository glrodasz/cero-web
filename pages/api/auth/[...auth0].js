import { handleAuth } from '@auth0/nextjs-auth0'

import { DEMO_USER, IS_DEMO_MODE } from '../../../features/common/auth'

const demoHandler = (req, res) => {
  const [route] = req.query.auth0 ?? []

  if (route === 'me') {
    return res.status(200).json(DEMO_USER)
  }

  return res.redirect('/home')
}

// `handleAuth()` validates the Auth0 configuration as soon as it runs, so it
// stays lazy to keep demo deployments working without any Auth0 secret.
let auth0Handler

const getAuth0Handler = () => {
  auth0Handler = auth0Handler ?? handleAuth()

  return auth0Handler
}

// This file is a Next.js API route, so it never reaches the browser bundle,
// which makes it safe to fall back to the demo handler purely from a missing
// `AUTH0_SECRET` too. That is a second, independent safety net: if
// `NEXT_PUBLIC_DEMO_MODE` was somehow not `true` at build time (a wrong
// environment scope on the hosting provider, for instance), this route still
// degrades to the stub instead of crashing with "secret is required".
const shouldUseDemoHandler = () => IS_DEMO_MODE || !process.env.AUTH0_SECRET

export default function handler(req, res) {
  return shouldUseDemoHandler()
    ? demoHandler(req, res)
    : getAuth0Handler()(req, res)
}
