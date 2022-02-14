import { sessionKey, userCookieKey } from '../../libs/session'

export default function middleware() {
  // Set-Cookie: token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT
  const headers = new Headers()
  headers.append(
    'Set-Cookie',
    `${userCookieKey}=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  )
  headers.append(
    'Set-Cookie',
    `${sessionKey}=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  )
  headers.append('Location', '/')

  return new Response('', {
    status: 302,
    headers,
  })
}
