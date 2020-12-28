import { OAuth } from 'oauth'

const API_KEY = process.env.OAUTH_CLIENT_KEY
const API_SECRET = process.env.OAUTH_CLIENT_SECRET
const CALLBACK_URL = 'https://next-server-components.vercel.app/api/auth'

const oauth = new OAuth(
  'https://github.com/login/oauth/authorize',
  'https://github.com/login/oauth/access_token',
  API_KEY,
  API_SECRET,
  '1.0A',
  CALLBACK_URL,
  'HMAC-SHA1'
)

export default oauth
