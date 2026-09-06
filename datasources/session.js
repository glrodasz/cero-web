import crypto from 'crypto'

export const SESSION_COOKIE_NAME = 'cero_demo_session'

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24

const parseCookieHeader = (header = '') =>
  header.split(';').reduce((cookies, part) => {
    const [name, ...value] = part.trim().split('=')

    if (name) {
      cookies[name] = decodeURIComponent(value.join('='))
    }

    return cookies
  }, {})

const readSessionId = (req) => {
  const cookies = req?.cookies ?? parseCookieHeader(req?.headers?.cookie)

  return cookies?.[SESSION_COOKIE_NAME]
}

const appendSetCookie = (res, cookie) => {
  const current = res.getHeader('Set-Cookie')
  const cookies = current ? [].concat(current) : []

  res.setHeader('Set-Cookie', [...cookies, cookie])
}

// Scopes the memory data source per browser session so two people opening the
// same preview deployment do not share (or overwrite) each other's data.
export const getOrCreateSessionId = (req, res) => {
  const existingSessionId = readSessionId(req)

  if (existingSessionId) return existingSessionId

  const sessionId = crypto.randomUUID()

  if (res) {
    appendSetCookie(
      res,
      `${SESSION_COOKIE_NAME}=${sessionId}; Path=/; Max-Age=${SESSION_MAX_AGE_SECONDS}; HttpOnly; SameSite=Lax`
    )
  }

  return sessionId
}
