import { getUser, getSession, userCookieKey, sessionKey } from '../../libs/session'

const iv = encode('encryptiv')
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
  const { nextUrl } = req
  const { searchParams } = nextUrl
  const query = Object.fromEntries(searchParams)
  const pwHash = await crypto.subtle.digest('SHA-256', pwUtf8)
  const encrypt = createEncrypt(pwHash, algo)
  const decrypt = createDecrypt(pwHash, algo)
  

  const sessionCookie = getSession(req)
  const userCookie = getUser(req)
  // TODO: connect github OAuth

  const ghUser = query.name || 'ghost'
  const user = {
    name: ghUser,
    encrypted: await encrypt(ghUser),
  }

  let login = null
  let authErr = null
  if (sessionCookie && userCookie) {
    try {
      login = await decrypt(sessionCookie)
    } catch (e) {
      console.error(e)
      authErr = e
    }

    if (authErr || (login && (login !== userCookie))) {
      console.error('Unauthenticated', authErr, login, userCookie)
      return new Response('Unauthorized', { status: 403 })
    }
  }

  const headers = new Headers()
  headers.append('Set-Cookie', `${userCookieKey}=${user.name}; Secure; HttpOnly`)
  headers.append('Set-Cookie', `${sessionKey}=${user.encrypted}; Secure; HttpOnly`)
  headers.append('Location', '/')

  return new Response('', {
    status: 302,
    headers,
  })
}