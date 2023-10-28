import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { userCookieKey } from 'libs/session'

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  url.pathname = '/'
  const res = NextResponse.redirect(url.toString(), 302)

  res.cookies.set(
    userCookieKey,
    `deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  )

  return res
}
