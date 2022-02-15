import { NextResponse } from 'next/server'
import { createDecrypt, getSession, getUser } from '../../../libs/session'

export async function middleware(req) {
  const decrypt = createDecrypt()
  const sessionCookie = getSession(req)
  const userCookie = getUser(req)

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
