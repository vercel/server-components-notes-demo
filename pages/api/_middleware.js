import { NextResponse } from 'next/server'
import { getUser } from '../../libs/session'

export default function middleware(req) {
  if (req.method === 'GET') {
    return NextResponse.next()
  }
  const login = getUser(req)

  if (!login) {
    return new Response('Unauthorized', { status: 403 })
  }

  return NextResponse.next()
}