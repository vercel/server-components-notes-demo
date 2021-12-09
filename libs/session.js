export const userCookieKey = '_un'
export const sessionKey = '_sess'

export function getUser(req) {
  return req.cookies[userCookieKey] || null
}

export function getSession(req) {
  return req.cookies[sessionKey] || null
}
