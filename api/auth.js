import fetch from 'node-fetch'

import oauth from '../lib/oauth'
import session from '../lib/session'

export default async (req, res) => {
  session(req, res)

  const { oauth_token, oauth_verifier } = req.query

  // When there's no `oauth_token` param in this callback
  // request, it's a GET from the client side. 
  // We return the authorization.
  if (!oauth_token) {
    console.log(req.session)
    return res.send(JSON.stringify({
      isLoggedIn: req.isLoggedIn
    }))
  }

  const { oauthToken, oauthTokenSecret } = req.session

  const [accessToken, accessTokenSecret] = await new Promise((resolve, reject) => {
    oauth.getOAuthAccessToken(
      oauthToken,
      oauthTokenSecret,
      oauth_verifier,
      (err, ...rest) => {
        if (err) {
          reject(err)
          return
        }
        resolve(rest)
      }
    )
  })

  // Let's also fetch the user info
  if (accessToken) {
    const userInfo = await (await fetch('https://api.github.com/user', {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',
      headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
      }
    })).json()
    console.log(userInfo)
  }

  req.session.accessToken = accessToken
  req.session.accessTokenSecret = accessTokenSecret
  res.writeHead(302, { Location: `/` })
  res.end()
}
