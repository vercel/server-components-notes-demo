import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import apiMiddleware from 'middleware/api'
import authMiddleware from 'middleware/auth'
import editMiddleware from 'middleware/edit'
import logoutMiddleware from 'middleware/logout'

function matchPathname(url, pathname) {
  return url.pathname.startsWith(pathname)
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  if (matchPathname(url, '/api')) {
    return apiMiddleware(req)
  }

  if (matchPathname(url, '/edit')) {
    return editMiddleware(req)
  }

  if (matchPathname(url, '/logout')) {
    return logoutMiddleware(req)
  }

  if (matchPathname(url, '/auth')) {
    return authMiddleware(req)
  }

  return NextResponse.next()
}
