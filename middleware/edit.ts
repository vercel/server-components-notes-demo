import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createDecrypt, getSession, userCookieKey } from 'libs/session'

export default async function middleware(req: NextRequest) {
  const decrypt = createDecrypt()
  const cookie = req.cookies.get(userCookieKey)?.value
  const [userCookie, sessionCookie] = getSession(cookie)

  let login: string | null = null
  let authErr = null

  if (sessionCookie && userCookie) {
    try {
      login = await decrypt(sessionCookie)
    } catch (e) {
      console.error(e)
      authErr = e
    }

    if (!authErr && login === userCookie) {
      return NextResponse.next()
    }
  }

  const url = req.nextUrl.clone()
  url.pathname = '/'
  return NextResponse.redirect(url)
}
