import { NextResponse } from 'next/server'
import apiMiddleware from './components/middleware/api'
import authMiddleware from './components/middleware/auth'
import editMiddleware from './components/middleware/edit'
import logoutMiddleware from './components/middleware/logout'

function matchPathname(url, pathname) {
  return url.pathname.startsWith(pathname)
}

export async function middleware(req) {
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
