import {
  userCookieKey,
  sessionKey,
  createEncrypt,
} from '../../libs/session'

const CLIENT_ID = process.env.OAUTH_CLIENT_KEY
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET


export async function middleware(req) {
  const { nextUrl } = req
  const { searchParams } = nextUrl
  const query = Object.fromEntries(searchParams)
  const encrypt = createEncrypt()
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

  const user = {
    name: token,
    encrypted: await encrypt(token),
  }
 
  const headers = new Headers()
  headers.append(
    'Set-Cookie',
    `${userCookieKey}=${user.name}; ${sessionKey}=${user.encrypted}; Secure; HttpOnly`
  )

  const url = req.nextUrl.clone()
  url.searchParams.delete('code')
  url.pathname = '/'
  headers.append('Location', url.toString())

  return new Response('', {
    status: 302,
    headers,
  })
}
