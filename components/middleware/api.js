import { NextResponse } from 'next/server'
import { getUser } from '../../libs/session'

export default function middleware(req) {
  const user = getUser(req)

  if (req.method !== 'GET' && !user) {
    return NextResponse.json({message: 'Unauthorized'}, { status: 403 })
  }

  return NextResponse.next()
}
