import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getUser, userCookieKey } from 'libs/session'

export default function middleware(req: NextRequest) {
  const userCookie = req.cookies.get(userCookieKey)?.value
  const user = getUser(userCookie)

  if (req.method !== 'GET' && !user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
  }

  return NextResponse.next()
}
