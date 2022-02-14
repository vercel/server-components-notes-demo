import {
  getUser,
  getSession,
  userCookieKey,
  sessionKey,
} from '../../libs/session'

const CLIENT_ID = process.env.OAUTH_CLIENT_KEY
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET

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
  for (let i = 0; i < len; i++) {
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
    const encryptKey = await crypto.subtle.importKey(
      'raw',
      pwHash,
      algo,
      false,
      ['encrypt']
    )
    const encrypted = await crypto.subtle.encrypt(
      algo,
      encryptKey,
      encode(data)
    )
    return arrayBufferToBase64(encrypted)
  }
}

// Decrypt
function createDecrypt(pwHash, algo) {
  return async function decrypt(data) {
    const buffer = base64ToArrayBuffer(data)
    const decryptKey = await crypto.subtle.importKey(
      'raw',
      pwHash,
      algo,
      false,
      ['decrypt']
    )
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

  const { code } = query

  // When there's no `code` param specified,
  // it's a GET from the client side.
  // We go with the login flow.
  if (!code) {
    // Login with GitHub
    return new Response('', {
      status: 302,
      headers: {
        Location: `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&allow_signup=false`,
      },
    })
  }

  let token = ''
  try {
    const data = await (
      await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code,
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
    ).json()

    const accessToken = data.access_token

    // Let's also fetch the user info and store it in the session.
    if (accessToken) {
      const userInfo = await (
        await fetch('https://api.github.com/user', {
          method: 'GET',
          headers: {
            Authorization: `token ${accessToken}`,
            Accept: 'application/json',
          },
        })
      ).json()

      token = userInfo.login
    }
  } catch (err) {
    console.error(err)
    return new Response(err.toString(), {
      status: 500,
    })
  }

  if (!token) {
    return new Response('Github authorization failed', {
      status: 400,
    })
  }

  const ghUser = token
  const user = {
    name: token,
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

    if (authErr || (login && login !== userCookie)) {
      console.error('Unauthenticated', authErr, login, userCookie)
      return new Response('Unauthorized', { status: 403 })
    }
  }

  const headers = new Headers()
  headers.append(
    'Set-Cookie',
    `${userCookieKey}=${user.name}; Secure; HttpOnly`
  )
  headers.append(
    'Set-Cookie',
    `${sessionKey}=${user.encrypted}; Secure; HttpOnly`
  )
  headers.append('Location', '/')

  return new Response('', {
    status: 302,
    headers,
  })
}
