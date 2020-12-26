# React Server Components in Next.js

## Prepare

You need these environment variables to run this app:

```
REDIS_URL='rediss://:<password>@<url>:<port>'
ENDPOINT='http://localhost:3000' // <- need to be absolute url to run in prod/local
```

Then change `components/Cache.client.js` line 27 to your environment's url origin, for example `http://localhost:3000`.

## Development

1. `yarn install`
2. `yarn build` to build necessary API deps
3. `vercel dev`
