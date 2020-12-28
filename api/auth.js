import fetch from 'node-fetch'

import session from '../libs/session'

const CLIENT_ID = process.env.OAUTH_CLIENT_KEY
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET

export default async (req, res) => {
  session(req, res)

  const { code, verify } = req.query

  // When there's no `code` param in this callback
  // request, it's a GET from the client side. 
  // We go with the login flow.
  if (!code) {
    // Verify the authorization status
    if (verify) {
      console.log(req.session)
      return res.send(JSON.stringify({
        isLoggedIn: req.session.isLoggedIn
      }))
    }

    // Login with GitHub
    res.writeHead(302, {
      Location: `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&allow_signup=false`
    })
    return res.end()
  }

  try {
    const data = await (await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )).json()

    const accessToken = data.access_token

    // Let's also fetch the user info and store it in the session
    if (accessToken) {
      const userInfo = await (await fetch('https://api.github.com/user', {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Authorization': `token ${accessToken}`,
            'Content-Type': 'application/json'
        }
      })).json()
      console.log(userInfo)

      // req.session.accessToken = accessToken
      // req.session.accessTokenSecret = accessTokenSecret
      req.session.isLoggedIn = true
    } else {
      req.session.isLoggedIn = false
    }
  } catch (err) {
    console.error(err)
    return res.status(500).send({ error: 'Failed to auth.' + err.message })
  }

  res.writeHead(302, { Location: `/` })
  res.end()
}
