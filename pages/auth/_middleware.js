import { NextResponse } from 'next/server'
import { getUser, getSession, userCookieKey, sessionKey } from '../../libs/session'

const iv = encode('encryptiv')
// const userCookieKey = '_un'
// const sessionKey = '_sess'
const password = 'reactsc'
const pwUtf8 = encode(password)
const algo = { name: 'AES-GCM', iv }

function encode(value) {
  return new TextEncoder().encode(value)
}

function decode(value) {
  return new TextDecoder().decode(value)
}

function base64ToArrayBuffer(base64) {
  const binary = atob(base64)
  const len = binary.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++)        {
      bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

function arrayBufferToBase64(buffer) {
	const bytes = new Uint8Array(buffer)
  const binary = String.fromCharCode(...bytes)
	return btoa(binary)
}

// Encrypt
function createEncrypt(pwHash, algo) {
  return async function (data) {
    const encryptKey = await crypto.subtle.importKey('raw', pwHash, algo, false, [
      'encrypt',
    ])
    const encrypted = await crypto.subtle.encrypt(algo, encryptKey, encode(data))
    return arrayBufferToBase64(encrypted)
  }
}

// Decrypt
function createDecrypt(pwHash, algo) {
  return async function decrypt(data) {
    const buffer = base64ToArrayBuffer(data)
    const decryptKey = await crypto.subtle.importKey('raw', pwHash, algo, false, [
      'decrypt',
    ])
    const ptBuffer = await crypto.subtle.decrypt(algo, decryptKey, buffer)
    const decryptedText = decode(ptBuffer)
    return decryptedText
  }
}


export async function middleware(req) {
  const { method, nextUrl } = req
  const { pathname } = nextUrl

  console.log('/auth', method, pathname)
  const pwHash = await crypto.subtle.digest('SHA-256', pwUtf8)
  const encrypt = createEncrypt(pwHash, algo)
  const decrypt = createDecrypt(pwHash, algo)
  
  const cookies = req.cookies

  const sessionCookie = getSession(req) // cookies[sessionKey]
  const userCookie = getUser(req) //cookies[userCookieKey]
  console.log('cookies', cookies, sessionCookie)
  // TODO: connect github OAuth

  const fakeUser = 'huozhi'
  const user = {
    name: fakeUser,
    encrypted: await encrypt(fakeUser),
  }

  let login = null
  let authErr = null
  console.log('user', userCookie)
  if (sessionCookie && userCookie) {
    try {
      login = await decrypt(sessionCookie)
    } catch (e) {
      console.error(e)
      authErr = e
    }

    console.log('after auth')
    if (authErr || (login && (login !== userCookie))) {
      console.error('Unauthenticated', authErr, login, userCookie)
      return new Response('Unauthorized', {
        status: 403,
      })
    }
  }

  
  
  
  const headers = new Headers()
  headers.append('Set-Cookie', `${userCookieKey}=${user.name}`)
  headers.append('Set-Cookie', `${sessionKey}=${user.encrypted}`)
  headers.append('Location', '/')

  console.log('login', login)
  console.log('Auth', user, Object.fromEntries(headers))
  return new Response('', {
    status: 302,
    headers,
  })
}