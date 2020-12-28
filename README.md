# React Server Components in Next.js

## Prepare

You need these environment variables to run this app:

```
REDIS_URL='rediss://:<password>@<url>:<port>'
ENDPOINT='http://localhost:3000' // <- need to be absolute url to run in prod/local
SESSION_KEY='<random key for cookie-based session>'
OAUTH_CLIENT_KEY='github oauth app id'
OAUTH_CLIENT_SECRET='github oauth app secret'
```

Then change `components/Cache.client.js` line 27 to your environment's url origin, for example `http://localhost:3000`.

## Development

1. `yarn install` (this will trigger the postinstall command)
2. `vercel dev`
