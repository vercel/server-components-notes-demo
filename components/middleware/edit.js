import { NextResponse } from 'next/server'
import { createDecrypt, getSession } from '../../libs/session'

export default async function middleware(req) {
  const decrypt = createDecrypt()
  const cookies = Object.fromEntries(req.cookies.entries())
  const [userCookie, sessionCookie] = getSession(cookies)

  let login = null
  let authErr = null

  if (sessionCookie && userCookie) {
    try {
      login = await decrypt(sessionCookie)
    } catch (e) {
      console.error(e)
      authErr = e
    }

    if (!authErr && (login === userCookie)) {
      return NextResponse.next()
    }
  }

  const url = req.nextUrl.clone()
  url.pathname = '/'
  return NextResponse.redirect(url)
}
