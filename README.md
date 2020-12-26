# React Server Components in Next.js

You need these environment variables to run this app:

```
REDIS_URL='rediss://:<password>@<url>:<port>'
ENDPOINT='http://localhost:3000' // <- need to be absolute url to run in prod/local
```

Then change `components/Cache.client.js` line 27 to your environment's url origin, for example `http://localhost:3000`.

1. You need to first run `yarn build` to build necessary API assets
2. `vercel dev`
